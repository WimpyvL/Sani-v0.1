import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    show: false,
    autoHideMenuBar: true,
    frame: false, // Custom Sani UI
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // SaniWin System Bridge
  ipcMain.handle('exec-command', async (_, command) => {
    const { spawn } = await import('child_process')
    return new Promise((resolve) => {
      // Use PowerShell to execute
      const ps = spawn('powershell.exe', ['-Command', command])
      let stdout = ''
      let stderr = ''

      ps.stdout.on('data', (data) => { stdout += data.toString() })
      ps.stderr.on('data', (data) => { stderr += data.toString() })

      ps.on('close', (code) => {
        resolve({ code, stdout, stderr })
      })
      ps.on('error', (err) => {
        resolve({ code: -1, stdout: '', stderr: err.message })
      })
    })
  })

  // Sani Identity Reader & File System Bridge
  ipcMain.handle('read-sani-file', async (_, filePath) => {
    const { readFile } = await import('fs/promises')
    const { resolve, isAbsolute } = await import('path')

    let fullPath = filePath
    if (!isAbsolute(filePath)) {
      const saniRoot = resolve(process.cwd(), '../')
      fullPath = resolve(saniRoot, filePath)
    }

    console.log(`[SANI_DEBUG] Reading file: ${fullPath}`)

    try {
      const content = await readFile(fullPath, 'utf-8')
      return { success: true, content }
    } catch (err) {
      console.error(`[SANI_DEBUG] Failed to read ${fullPath}:`, err.message)
      return { success: false, error: err.message, path: fullPath }
    }
  })

  ipcMain.handle('write-sani-file', async (_, { relativePath, content }) => {
    const { writeFile, mkdir } = await import('fs/promises')
    const { resolve, dirname, isAbsolute } = await import('path')

    // Support absolute paths
    let fullPath = relativePath
    if (!isAbsolute(relativePath)) {
      const saniRoot = resolve(process.cwd(), '../')
      fullPath = resolve(saniRoot, relativePath)
    }

    console.log(`[SANI_DEBUG] Writing file: ${fullPath}`)

    try {
      await mkdir(dirname(fullPath), { recursive: true })
      await writeFile(fullPath, content, 'utf-8')
      return { success: true, path: fullPath }
    } catch (err) {
      console.error(`[SANI_DEBUG] Failed to write ${fullPath}:`, err.message)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('list-sani-dir', async (_, dirPath) => {
    const { readdir, stat } = await import('fs/promises')
    const { resolve, join, isAbsolute } = await import('path')

    let fullPath = dirPath
    if (!isAbsolute(dirPath)) {
      const saniRoot = resolve(process.cwd(), '../')
      fullPath = resolve(saniRoot, dirPath)
    }

    console.log(`[SANI_DEBUG] Listing dir: ${fullPath}`)

    try {
      const files = await readdir(fullPath)
      const details = []

      for (const file of files) {
        try {
          const stats = await stat(join(fullPath, file))
          details.push({
            name: file,
            isDirectory: stats.isDirectory(),
            size: stats.size
          })
        } catch (e) {
          // Ignore stat errors for individual files
        }
      }
      return { success: true, files: details }
    } catch (err) {
      console.error(`[SANI_DEBUG] Failed to list ${fullPath}:`, err.message)
      return { success: false, error: err.message }
    }
  })

  ipcMain.handle('http-request', async (_, { url, method = 'GET', body, headers = {} }) => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      })

      const data = await response.json()
      return { success: response.ok, data, status: response.status }
    } catch (err) {
      return { success: false, error: err.message }
    }
  })

  // === AI PROXY ===
  ipcMain.handle('chat-completion', async (_, { model, messages, tools, apiKey }) => {
    console.log(`[SANI_MAIN] Chat Request: ${model}`)
    const { OpenAI } = await import('openai')

    // Determine configuration based on model
    // Fix: Weak check for 'gpt' causing local models starting with 'gpt' to fail
    const isLocal = !['gpt-4o', 'gpt-4', 'gpt-3.5-turbo'].some(k => model.startsWith(k))

    const config = isLocal
      ? { baseURL: 'http://localhost:11434/v1', apiKey: 'ollama' }
      : { apiKey: apiKey }

    try {
      const openai = new OpenAI(config)

      const options = {
        model,
        messages,
        temperature: 0.7
      }

      // Only attach tools if NOT local (unless we confirm local supports them consistently)
      if (!isLocal && tools) {
        options.tools = tools
        options.tool_choice = 'auto'
      }

      const completion = await openai.chat.completions.create(options)
      return { success: true, message: completion.choices[0].message }

    } catch (error) {
      console.error('[SANI_MAIN] AI Error:', error)
      return { success: false, error: error.message }
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

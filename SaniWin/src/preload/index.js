import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  execCommand: (cmd) => ipcRenderer.invoke('exec-command', cmd),
  readSaniFile: (path) => ipcRenderer.invoke('read-sani-file', path),
  writeSaniFile: (path, content) => ipcRenderer.invoke('write-sani-file', { relativePath: path, content }),
  listSaniDir: (path) => ipcRenderer.invoke('list-sani-dir', path),
  request: (options) => ipcRenderer.invoke('http-request', options),
  chatCompletion: (params) => ipcRenderer.invoke('chat-completion', params)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

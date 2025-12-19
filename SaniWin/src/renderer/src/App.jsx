import { useEffect, useState, useRef } from 'react'
import { TitleBar } from './components/TitleBar'
import { TerminalInput } from './components/TerminalInput'
import { MessageList } from './components/MessageList'
import { Bootloader } from './engine/Bootloader'
import { StateEngine } from './engine/StateEngine'
import { SaniBrain } from './engine/SaniBrain'
import { DebugPanel } from './components/DebugPanel'
import { ModelSelector } from './components/ModelSelector'

const bootloader = new Bootloader()
const stateEngine = new StateEngine()
const brain = new SaniBrain()

function App() {
  const [bootStatus, setBootStatus] = useState({ step: 'INIT', details: [] })
  const [activeState, setActiveState] = useState(stateEngine.getCurrentState())
  const [messages, setMessages] = useState([])
  const [logs, setLogs] = useState([])
  const [showDebug, setShowDebug] = useState(false)
  const [currentModel, setCurrentModel] = useState('gpt-4o')
  const [availableModels, setAvailableModels] = useState(['gpt-4o', 'gpt-3.5-turbo'])
  const [isProcessing, setIsProcessing] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    async function initModels() {
      try {
        const res = await window.api.request({ url: 'http://localhost:11434/api/tags' })
        if (res.success && res.data?.models) {
          const names = res.data.models.map(m => m.name)
          setAvailableModels(prev => [...new Set([...prev, ...names])])
        }
      } catch (e) { console.error(e) }
    }
    initModels()
  }, [])

  const addMsg = (type, content) => setMessages(prev => [...prev, { type, content }])

  const addLog = (level, message) => {
    console.log(`[${level.toUpperCase()}] ${message}`)
    setLogs(prev => [...prev, { timestamp: Date.now(), level, message }])
  }

  useEffect(() => {
    async function runBoot() {
      if (initialized.current) return
      initialized.current = true

      addLog('info', 'SANI_KERNEL: Starting boot sequence...')
      addMsg('system', 'SANI_KERNEL: Starting boot sequence...')
      setBootStatus({ step: 'LOADING', details: [] })

      const res = await bootloader.boot()
      res.details.forEach(d => addLog(d.status === 'OK' ? 'success' : 'error', `Loaded ${d.file}: ${d.status} ${d.error || ''}`))

      if (res.success) {
        addLog('info', 'SANI_KERNEL: Identity Loaded.')
        if (res.memory['vault/SANI_GLOBAL_STATE_MAP.md']) {
          stateEngine.init(res.memory['vault/SANI_GLOBAL_STATE_MAP.md'])
        }

        // Init Brain
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY
        if (apiKey) {
          brain.init(apiKey, res.memory, addLog)
          addMsg('system', 'SANI_BRAIN: GPT-4o Online.')
        } else {
          addLog('error', 'SANI_BRAIN: No API Key found.')
          addMsg('error', 'SANI_BRAIN: No API Key found in .env')
        }

        setBootStatus({ step: 'READY', details: res.details })
        setActiveState(stateEngine.getCurrentState())
        addMsg('sani', 'I am listening. State: ' + stateEngine.getCurrentState())
      } else {
        addLog('error', 'SANI_KERNEL: Boot Failed.')
        addMsg('error', 'SANI_KERNEL: Boot Failed.')
        setBootStatus({ step: 'ERROR', details: res.details })
      }
    }
    setTimeout(runBoot, 800)
  }, [])

  const handleCommand = async (text) => {
    addMsg('user', text)
    setIsProcessing(true)
    addLog('info', `USER CMD: ${text}`)

    if (text.startsWith('/')) {
      const cmd = text.slice(1).trim()
      addLog('info', `EXEC: ${cmd}`)
      try {
        const res = await window.api.execCommand(cmd)
        if (res.code === 0) {
          addLog('success', `STDOUT: ${res.stdout}`)
          addMsg('system', res.stdout)
        } else {
          addLog('error', `EXIT ${res.code}: ${res.stderr}`)
          addMsg('error', `Exit Code: ${res.code}\n${res.stderr || res.stdout}`)
        }
      } catch (err) {
        addLog('error', `EXEC FAIL: ${err.message}`)
        addMsg('error', err.message)
      }
    } else {
      try {
        const reply = await brain.chat(text, currentModel)
        addMsg('sani', reply)
      } catch (e) {
        addLog('error', `BRAIN ERROR: ${e.message}`)
        addMsg('error', 'Brain Error: ' + e.message)
      }
    }

    setIsProcessing(false)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0a0a0a',
      color: '#e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative' // For absolute debug panel
    }}>
      <TitleBar />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 20px',
        background: '#111',
        borderBottom: '1px solid #333',
        fontSize: '12px',
        color: '#666',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>STATUS: {bootStatus.step}</span>
          <span style={{ color: 'cyan', fontWeight: 'bold' }}>MODEL:</span>
          <select
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
            style={{
              background: '#222',
              color: '#eee',
              border: '1px solid #555',
              padding: '2px 8px',
              borderRadius: '4px',
              width: '120px',
              cursor: 'pointer',
              zIndex: 10000 // Force on top
            }}
          >
            {availableModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {/* OLLAMA DEBUG: */}
          <button onClick={async () => {
            const res = await window.api.request({ url: 'http://localhost:11434/api/tags' })
            addLog('info', 'Ollama Models: ' + JSON.stringify(res))
          }} style={{ fontSize: '10px', cursor: 'pointer' }}>Check Ollama</button>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button
            onClick={() => setShowDebug(!showDebug)}
            title="Toggle Kernel Log"
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}>
            🐞
          </button>
          <span style={{ color: activeState === 'ERROR' ? 'red' : '#44ff44' }}>{activeState}</span>
        </div>
      </div>

      <MessageList messages={messages} />

      {showDebug && <DebugPanel logs={logs} onClose={() => setShowDebug(false)} />}

      <TerminalInput onSubmit={handleCommand} disabled={isProcessing} />
    </div>
  )
}

export default App

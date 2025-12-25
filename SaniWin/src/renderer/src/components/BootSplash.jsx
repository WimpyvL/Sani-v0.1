import React, { useEffect, useState, useRef } from 'react'

// --- CONFIGURATION ---
const ASCII_SANI = `
███████╗ █████╗ ███╗   ██╗██╗
██╔════╝██╔══██╗████╗  ██║██║
███████╗███████║██╔██╗ ██║██║
╚════██║██╔══██║██║╚██╗██║██║
███████║██║  ██║██║ ╚████║██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝
`;

const BOOT_SEQUENCE = [
  { text: 'INITIALIZING KERNEL...', type: 'info', delay: 100 },
  { text: 'LOADING MEMORY BANKS (64TB)...', type: 'info', delay: 150 },
  { text: 'CHECKING INTEGRITY... OK', type: 'success', delay: 200 },
  { text: 'ESTABLISHING NEURAL LINK...', type: 'info', delay: 300 },
  { text: 'ACCESSING SECURE VAULT...', type: 'warn', delay: 400 },
  { text: 'BYPASSING FIREWALL (LEVEL 5)...', type: 'warn', delay: 600 },
  { text: 'INJECTING CONSCIOUSNESS...', type: 'info', delay: 400 },
  { text: 'ERROR: SOUL_NOT_FOUND', type: 'error', delay: 800 },
  { text: 'RETRYING WITH ARTIFICIAL EMPATHY...', type: 'info', delay: 500 },
  { text: 'SYNCHRONIZING WITH HOST...', type: 'info', delay: 300 },
  { text: 'OPTIMIZING LOGIC GATES...', type: 'info', delay: 200 },
  { text: 'ACTIVATING PERSONALITY MATRIX...', type: 'success', delay: 500 },
  { text: 'SARCASM MODULE: ONLINE', type: 'success', delay: 300 },
  { text: 'SYSTEM STABLE.', type: 'success', delay: 1000 },
]

// --- HELPER COMPONENT: GLITCH TEXT ---
// Decodes text from random characters to the final string
const GlitchText = ({ text, onComplete, speed = 3 }) => {
  const [display, setDisplay] = useState('')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&'

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) return text[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        if (onComplete) onComplete()
      }

      iteration += 1 / speed
    }, 30)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return <span>{display}</span>
}

// --- MAIN COMPONENT ---
export function BootSplash({ onComplete }) {
  const [logs, setLogs] = useState([])
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [phase, setPhase] = useState('BOOT') // BOOT, LOADING, REVEAL, EXIT
  const [progress, setProgress] = useState(0)
  const bottomRef = useRef(null)

  // 1. Handle Log Sequence
  useEffect(() => {
    if (phase !== 'BOOT') return

    if (currentLogIndex >= BOOT_SEQUENCE.length) {
      setTimeout(() => setPhase('LOADING'), 500)
      return
    }

    const currentItem = BOOT_SEQUENCE[currentLogIndex]

    const timer = setTimeout(() => {
      setLogs(prev => [...prev, currentItem])
      setCurrentLogIndex(prev => prev + 1)
    }, currentItem.delay)

    return () => clearTimeout(timer)
  }, [currentLogIndex, phase])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // 2. Handle Loading Bar Phase
  useEffect(() => {
    if (phase === 'LOADING') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setPhase('REVEAL')
            return 100
          }
          // Randomize progress jumps for realism
          return prev + Math.random() * 10
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [phase])

  // 3. Handle Reveal & Exit
  useEffect(() => {
    if (phase === 'REVEAL') {
      const t = setTimeout(() => setPhase('EXIT'), 3500)
      return () => clearTimeout(t)
    }
    if (phase === 'EXIT') {
      const t = setTimeout(() => {
        if (onComplete) onComplete()
      }, 800) // Collapse animation duration
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  // --- STYLES & RENDERING ---
  return (
    <div style={styles.container(phase === 'EXIT')}>
      <style>{cssAnimations}</style>

      {/* CRT OVERLAY EFFECTS */}
      <div style={styles.scanlines} />
      <div style={styles.vignette} />
      <div style={styles.noise} />

      <div style={styles.contentWrapper}>

        {/* PHASE 1: LOGS */}
        {phase === 'BOOT' && (
          <div style={styles.terminalWindow}>
            {logs.map((log, i) => (
              <div key={i} style={styles.logLine(log.type)}>
                <span style={styles.prefix}>&gt;</span> {log.text}
              </div>
            ))}
            <div ref={bottomRef} />
            <div style={styles.cursorBlock}>_</div>
          </div>
        )}

        {/* PHASE 2: PROGRESS BAR */}
        {phase === 'LOADING' && (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingText}>COMPILING SANI.CORE</div>
            <div style={styles.progressBarWrapper}>
              <div style={{ ...styles.progressBarFill, width: `${progress}%` }} />
            </div>
            <div style={styles.loadingText}>{Math.floor(progress)}%</div>
          </div>
        )}

        {/* PHASE 3: REVEAL */}
        {(phase === 'REVEAL' || phase === 'EXIT') && (
          <div style={styles.centerStage}>
            <pre style={styles.asciiArt}>
              {ASCII_SANI}
            </pre>
            <div style={styles.subtext}>
              <GlitchText text="SYSTEM ACTIVE" speed={0.5} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- CSS-IN-JS STYLES ---
const styles = {
  container: (isExiting) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#050505',
    color: '#0f0',
    fontFamily: '"Courier New", Courier, monospace',
    zIndex: 9999,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // CRT Flicker Animation
    animation: isExiting ? 'tv-off 0.6s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards' : 'none',
    filter: 'contrast(1.2) brightness(1.1)',
  }),

  // Effects
  scanlines: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
    backgroundSize: '100% 4px',
    pointerEvents: 'none',
    zIndex: 10,
  },
  vignette: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%)',
    pointerEvents: 'none',
    zIndex: 11,
  },
  noise: {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    opacity: 0.05,
    pointerEvents: 'none',
    zIndex: 9,
    backgroundColor: 'transparent',
  },

  // Layout
  contentWrapper: {
    position: 'relative',
    zIndex: 20,
    width: '90%',
    maxWidth: '800px',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  // Components
  terminalWindow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    height: '100%',
    paddingBottom: '50px',
    fontSize: '16px',
    textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
  },
  logLine: (type) => ({
    marginBottom: '5px',
    color: type === 'error' ? '#ff3333' : type === 'warn' ? '#ffff33' : type === 'success' ? '#33ff33' : '#0f0',
    textShadow: type === 'error' ? '0 0 5px #f00' : '0 0 5px rgba(0,255,0,0.5)',
    fontFamily: 'monospace',
  }),
  prefix: {
    opacity: 0.7,
    marginRight: '8px',
  },
  cursorBlock: {
    display: 'inline-block',
    width: '10px',
    height: '1.2em',
    backgroundColor: '#0f0',
    animation: 'blink 1s step-end infinite',
  },

  // Loading
  loadingContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  progressBarWrapper: {
    width: '100%',
    height: '4px',
    background: '#111',
    border: '1px solid #333',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    background: '#0f0',
    boxShadow: '0 0 10px #0f0',
    transition: 'width 0.1s linear',
  },
  loadingText: {
    fontSize: '14px',
    letterSpacing: '2px',
  },

  // Reveal
  centerStage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'glitch-skew 1s infinite linear alternate-reverse',
  },
  asciiArt: {
    fontSize: 'clamp(10px, 2vw, 20px)',
    lineHeight: '1',
    color: '#0f0',
    textShadow: '0 0 10px #0f0, 0 0 20px #0f0',
    margin: 0,
    fontWeight: 'bold',
    transform: 'scale(1.2)',
  },
  subtext: {
    marginTop: '20px',
    fontSize: '24px',
    letterSpacing: '5px',
    animation: 'pulse 2s infinite',
  }
}

// --- GLOBAL CSS ANIMATIONS ---
const cssAnimations = `
  @keyframes blink { 
    0%, 100% { opacity: 1; } 
    50% { opacity: 0; } 
  }
  
  @keyframes tv-off {
    0% { transform: scale(1, 1); filter: brightness(1); }
    50% { transform: scale(1, 0.005); filter: brightness(10); }
    100% { transform: scale(0, 0); filter: brightness(0); }
  }

  @keyframes pulse {
    0% { opacity: 0.8; text-shadow: 0 0 5px #0f0; }
    50% { opacity: 1; text-shadow: 0 0 20px #0f0, 0 0 30px #0f0; }
    100% { opacity: 0.8; text-shadow: 0 0 5px #0f0; }
  }

  @keyframes glitch-skew {
    0% { transform: skew(0deg); }
    20% { transform: skew(-2deg); }
    40% { transform: skew(2deg); }
    60% { transform: skew(0deg); }
    80% { transform: skew(1deg); }
    100% { transform: skew(0deg); }
  }
`

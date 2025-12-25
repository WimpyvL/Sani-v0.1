import React, { useEffect, useRef } from 'react'

export function DebugPanel({ logs, onClose }) {
    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [logs])

    return (
        <div style={{
            position: 'absolute',
            top: '40px',
            right: '20px',
            width: '400px',
            height: 'calc(100vh - 100px)',
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #333',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            fontFamily: 'monospace',
            fontSize: '11px',
            overflow: 'hidden'
        }}>
            <div style={{
                padding: '8px 12px',
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)'
            }}>
                <span style={{ color: '#aaa', fontWeight: 'bold' }}>SYSTEM KERNEL LOG</span>
                <button onClick={onClose} style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '14px'
                }}>×</button>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
            }}>
                {logs.map((log, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        gap: '8px',
                        color: getColor(log.level),
                        opacity: 0.9
                    }}>
                        <span style={{ color: '#444', minWidth: '60px' }}>
                            {new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}
                        </span>
                        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                            {log.message}
                        </span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    )
}

function getColor(level) {
    switch (level) {
        case 'error': return '#ff5555'
        case 'warn': return '#ffb86c'
        case 'success': return '#50fa7b'
        default: return '#8be9fd'
    }
}

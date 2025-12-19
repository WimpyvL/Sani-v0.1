import React, { useState } from 'react'

export function TerminalInput({ onSubmit, disabled }) {
    const [input, setInput] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (input.trim()) {
                onSubmit(input)
                setInput('')
            }
        }
    }

    return (
        <div style={{
            padding: '10px 20px',
            background: '#0a0a0a',
            borderTop: '1px solid #333'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#44ff44', marginRight: '10px', fontSize: '14px' }}>{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    autoFocus
                    placeholder="Command specific Sani..."
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                />
            </div>
        </div>
    )
}

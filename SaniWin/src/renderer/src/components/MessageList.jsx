import React, { useEffect, useRef } from 'react'

export function MessageList({ messages }) {
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        }}>
            {messages.map((msg, index) => (
                <div key={index} style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    color: msg.type === 'user' ? '#aaa' :
                        msg.type === 'error' ? '#ff5555' :
                            msg.type === 'system' ? '#44ff44' : '#e0e0e0', // Sani default
                    paddingLeft: msg.type === 'user' ? '0' : '10px',
                    borderLeft: msg.type === 'sani' ? '2px solid #fff' : 'none'
                }}>
                    {msg.type === 'user' ? (
                        <span><span style={{ color: '#666' }}>{'>'}</span> {msg.content}</span>
                    ) : (
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                        </div>
                    )}
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    )
}

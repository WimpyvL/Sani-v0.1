import React from 'react'

export function TitleBar() {
    const handleClose = () => window.close() // Or via IPC
    // For now standard windows close button might be missing
    // We can add simple window controls if needed

    return (
        <div style={{
            height: '32px',
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 10px',
            WebkitAppRegion: 'drag', // Electron drag
            color: '#fff',
            fontFamily: 'monospace',
            borderBottom: '1px solid #333'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>
                SANI // WIN_AGENT // v0.1
            </div>

            <div style={{ WebkitAppRegion: 'no-drag', display: 'flex', gap: '10px' }}>
                {/* Placeholder controls */}
                <div style={{ width: 10, height: 10, background: '#444', borderRadius: '50%' }}></div>
            </div>
        </div>
    )
}

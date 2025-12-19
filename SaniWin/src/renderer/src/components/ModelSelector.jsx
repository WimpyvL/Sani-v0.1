import React, { useEffect, useState } from 'react'

export function ModelSelector({ currentModel, onSelectModel, logger }) {
    const [models, setModels] = useState(['gpt-4o', 'gpt-3.5-turbo'])

    useEffect(() => {
        async function fetchOllamaModels() {
            try {
                if (!window.api || !window.api.request) {
                    console.error("Window API not available for ModelSelector")
                    return
                }
                const res = await window.api.request({
                    url: 'http://localhost:11434/api/tags',
                    method: 'GET'
                })

                if (res.success && res.data?.models) {
                    const ollamaModels = res.data.models.map(m => m.name)
                    setModels(prev => [...new Set([...prev, ...ollamaModels])])
                    if (logger) logger('success', `Found Ollama models: ${ollamaModels.join(', ')}`)
                }
            } catch (e) {
                console.error("Error fetching models:", e)
            }
        }

        fetchOllamaModels()
    }, [])

    return (
        <select
            value={currentModel}
            onChange={(e) => onSelectModel(e.target.value)}
            style={{
                display: 'block',
                background: '#444',
                color: '#fff',
                padding: '5px',
                border: '1px solid #777',
                borderRadius: '4px',
                minWidth: '100px',
                height: '30px',
                zIndex: 9999,
                cursor: 'pointer'
            }}
        >
            {models.map(m => (
                <option key={m} value={m}>{m}</option>
            ))}
        </select>
    )
}

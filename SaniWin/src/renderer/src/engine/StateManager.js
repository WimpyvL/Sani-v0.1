// src/renderer/src/engine/StateManager.js

export class StateManager {
    constructor() {
        this.session = {
            history: [],
            variables: {}
        }
    }

    addMessage(role, content) {
        this.session.history.push({ role, content })
        // keep only recent 50 entries
        if (this.session.history.length > 50) this.session.history.shift()
    }

    getHistory() {
        return this.session.history
    }

    setVariable(key, value) {
        this.session.variables[key] = value
    }

    getVariable(key) {
        return this.session.variables[key]
    }

    // Serialize to JSON for persistence
    serialize() {
        return JSON.stringify(this.session)
    }

    // Load from JSON string
    deserialize(jsonStr) {
        try {
            this.session = JSON.parse(jsonStr)
        } catch (e) {
            console.error('StateManager deserialize error:', e)
        }
    }
}

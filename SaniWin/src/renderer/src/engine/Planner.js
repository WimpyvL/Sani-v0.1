// src/renderer/src/engine/Planner.js

export class Planner {
    constructor(config) {
        this.config = config || {}
    }

    decide(intentObj) {
        const { intent, args } = intentObj
        // Simple decision logic based on intent type
        switch (intent) {
            case 'greeting':
                return { type: 'knowledge', key: 'greeting' }
            case 'read_file':
                return { type: 'tool', intent: 'read_file', args: { path: args[0] } }
            case 'write_file':
                return { type: 'tool', intent: 'write_file', args: { path: args[0], content: args[1] } }
            case 'list_dir':
                return { type: 'tool', intent: 'list_dir', args: { path: args[0] } }
            case 'run_command':
                return { type: 'tool', intent: 'run_command', args: { command: args[0] } }
            case 'run_python':
                return { type: 'tool', intent: 'run_python', args: { code: args[0] } }
            default:
                // Fallback to knowledge base if possible
                return { type: 'fallback' }
        }
    }
}

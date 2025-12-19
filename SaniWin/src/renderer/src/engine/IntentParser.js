// src/renderer/src/engine/IntentParser.js

export class IntentParser {
    constructor() {
        // Simple patterns for demonstration
        this.patterns = [
            { intent: 'greeting', regex: /\b(hi|hello|hey)\b/i, confidence: 0.9 },
            { intent: 'read_file', regex: /read\s+file\s+(.*)/i, confidence: 0.85 },
            { intent: 'write_file', regex: /write\s+file\s+(.*)\s+content\s+(.*)/i, confidence: 0.85 },
            { intent: 'list_dir', regex: /list\s+(.*)/i, confidence: 0.8 },
            { intent: 'run_command', regex: /run\s+command\s+(.*)/i, confidence: 0.8 },
            { intent: 'run_python', regex: /run\s+python\s+(.*)/i, confidence: 0.8 }
        ]
    }

    parse(message) {
        for (const p of this.patterns) {
            const match = message.match(p.regex)
            if (match) {
                const args = match.slice(1).map(arg => arg.trim())
                return { intent: p.intent, confidence: p.confidence, args }
            }
        }
        return null
    }
}

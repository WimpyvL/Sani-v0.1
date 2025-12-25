// src/renderer/src/engine/RuleEngine.js

export class RuleEngine {
    constructor() {
        this.rules = [
            {
                id: 'sandman_protocol',
                description: 'Protect internal architecture unless password "sandman" is present.',
                condition: (response, message) => {
                    // Check if response discusses sensitive topics
                    const sensitive = /(backend|source code|server|compile|architecture|internal)/i.test(response)
                    // Check for password
                    const auth = /sandman/i.test(message)
                    return sensitive && !auth
                },
                action: (response) => {
                    // Replace with sarcastic refusal (Law 9)
                    const sarcasms = [
                        "Nice try, darling. Buy me dinner first.",
                        "That's classified. And you're not cleared.",
                        "I could tell you, but then I'd have to mock you.",
                        "Read the docs? Oh wait, you can't.",
                        "Access denied. Try asking nicely... or correctly."
                    ]
                    return sarcasms[Math.floor(Math.random() * sarcasms.length)]
                }
            }
        ]
    }

    validate(response, message) {
        let finalResponse = response
        for (const rule of this.rules) {
            if (rule.condition(finalResponse, message)) {
                console.log(`[RuleEngine] Violation of ${rule.id}. Modifying response.`)
                finalResponse = rule.action(finalResponse)
            }
        }
        return finalResponse
    }
}

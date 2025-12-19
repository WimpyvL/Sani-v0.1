// src/renderer/src/engine/OfflineBrain.js

import { IntentParser } from './IntentParser'
import { Planner } from './Planner'
import { Executor } from './Executor'
import { Cache } from './Cache'
import { StateManager } from './StateManager'
import { Persistence } from './Persistence'
import { RuleEngine } from './RuleEngine'

export class OfflineBrain {
    constructor(config) {
        this.config = config
        this.intentParser = new IntentParser()
        this.planner = new Planner(config)
        this.executor = new Executor()
        this.cache = new Cache(config.cacheSize || 500)
        this.state = new StateManager()
        this.persistence = new Persistence(config.vectorDbPath)
        this.ruleEngine = new RuleEngine()
        // Load knowledge base
        this.knowledgeBase = this.loadKnowledgeBase(config.knowledgeBasePath)
    }

    loadKnowledgeBase(path) {
        try {
            // Using fetch on file:// may not work; use preload readSaniFile via IPC if needed.
            // For now, assume synchronous require works in dev.
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const kb = require(`../../${path}`)
            return kb
        } catch (e) {
            console.error('Failed to load knowledge base:', e)
            return {}
        }
    }

    canHandle(message) {
        // Quick check: if intent parser finds a known intent with high confidence
        const intent = this.intentParser.parse(message)
        return intent && intent.confidence > (this.config.offlineThreshold || 0.75) ? intent.confidence : 0
    }

    async respond(message) {
        // Check cache first
        const cached = this.cache.get(message)
        if (cached) return cached

        const intent = this.intentParser.parse(message)
        if (!intent) return null

        // Planner decides what to do
        const plan = this.planner.decide(intent)
        let response = null
        if (plan.type === 'tool') {
            response = await this.executor.run(plan.intent, plan.args)
        } else if (plan.type === 'knowledge') {
            response = this.knowledgeBase[plan.key] || null
        } else if (plan.type === 'fallback') {
            response = null // let LLM handle
        }

        // Apply rule engine (sarcasm guard, etc.)
        if (response) {
            response = this.ruleEngine.validate(response, message)
        }

        // Cache the result
        if (response) this.cache.set(message, response)
        return response
    }
}

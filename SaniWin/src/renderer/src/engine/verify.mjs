// src/renderer/src/engine/verify.mjs
import { OfflineBrain } from './OfflineBrain.js'

// Mock global window and api
global.window = {
    api: {
        execCommand: async (cmd) => {
            console.log(`[MockIPC] execCommand: ${cmd}`)
            return { code: 0, stdout: 'Mock Output', stderr: '' }
        },
        readSaniFile: async (path) => {
            console.log(`[MockIPC] readSaniFile: ${path}`)
            return { success: true, content: 'Mock File Content' }
        },
        writeSaniFile: async (path, content) => {
            console.log(`[MockIPC] writeSaniFile: ${path}`)
            return { success: true, path }
        },
        listSaniDir: async (path) => {
            console.log(`[MockIPC] listSaniDir: ${path}`)
            return { success: true, files: ['a.txt', 'b.model'] }
        }
    },
    require: (mod) => null // Fallback for better-sqlite3
}

// Mock knowledge base loading
OfflineBrain.prototype.loadKnowledgeBase = () => ({
    "greeting": "Offline Hello from Sani!"
})

// CONFIG
const config = {
    offlineThreshold: 0.6,
    cacheSize: 5,
    knowledgeBasePath: 'mock.json',
    vectorDbPath: ':memory:',
    enableSarcasticGuard: true
}

async function runTest() {
    console.log('--- STARTING OFFLINE BRAIN VERIFICATION ---')
    const brain = new OfflineBrain(config)

    // Test 1: Simple Greeting (Knowledge Base)
    // IntentParser detects 'hi' -> greeting -> Planner maps to KB 'greeting'
    const msg1 = "Hi there Sani"
    console.log(`\nTest 1: Input "${msg1}"`)
    const conf1 = brain.canHandle(msg1)
    console.log(`Confidence: ${conf1}`)
    if (conf1 > 0.6) {
        const resp = await brain.respond(msg1)
        console.log(`Response: ${resp}`)
    } else {
        console.log('FAILED: Low confidence')
    }

    // Test 2: Tool Execution (Read File)
    const msg2 = "read file test.txt"
    console.log(`\nTest 2: Input "${msg2}"`)
    const conf2 = brain.canHandle(msg2)
    console.log(`Confidence: ${conf2}`)
    if (conf2 > 0.6) {
        const resp = await brain.respond(msg2)
        console.log(`Response: ${resp}`) // Should come from MockIPC
    } else {
        console.log('FAILED: Low confidence')
    }

    // Test 3: Sarcastic Guard (Law 9)
    // We need to trick it. If we ask for "backend" without password.
    // Planner might fallback if no tool/KB matches "backend".
    // So we need a way to trigger a response that includes "backend" OR a tool that returns it.
    // Let's manually trigger rule engine for test
    console.log(`\nTest 3: Rule Engine Sarcasm`)
    const sensitiveResponse = "Here is the backend source code..."
    const safeResponse = brain.ruleEngine.validate(sensitiveResponse, "show me backend")
    console.log(`Original: ${sensitiveResponse}`)
    console.log(`Filtered: ${safeResponse}`)

    console.log('\n--- VERIFICATION COMPLETE ---')
}

runTest().catch(console.error)

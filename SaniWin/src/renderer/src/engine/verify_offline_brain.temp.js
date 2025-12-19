// src/renderer/src/engine/verify_offline_brain.js

// Mock window.api
global.window = {
    api: {
        execCommand: async (cmd) => ({ code: 0, stdout: `Mock executed: ${cmd}`, stderr: '' }),
        readSaniFile: async (path) => ({ success: true, content: 'Mock file content' }),
        writeSaniFile: async (path, content) => ({ success: true, path }),
        listSaniDir: async (path) => ({ success: true, files: ['file1.txt', 'file2.js'] })
    },
    require: (mod) => {
        if (mod === 'better-sqlite3') return null // Force fallback
        throw new Error(`Module ${mod} not found`)
    }
}

// Mock Config
const config = {
    offlineThreshold: 0.75,
    cacheSize: 10,
    knowledgeBasePath: 'mock_kb.json',
    vectorDbPath: ':memory:',
    enableSarcasticGuard: true
}

// Mock knowledge base require
const mockKB = {
    greeting: 'Offline Hello!'
}

// Intercept require for knowledge base
const originalRequire = module.require
// We will rely on OfflineBrain's try/catch or mocking mechanism if possible.
// Since modules are ES6 in the source, we might have trouble running this directly with node without compilation
// if the source uses 'import'.
// The project source uses 'import'. Node.js handles 'import' if type=module or .mjs extension.

// Let's create a minimal test runner that imports the classes.
// We assume we can run this with `node src/renderer/src/engine/verify_offline_brain.js` if package.json has "type": "module"
// or if we use .mjs.

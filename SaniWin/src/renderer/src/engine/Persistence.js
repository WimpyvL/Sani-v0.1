// src/renderer/src/engine/Persistence.js

export class Persistence {
    constructor(dbPath) {
        this.dbPath = dbPath || './offline_vectors.db'
        this.db = null
        this.memoryStore = new Map() // Fallback
        this.useMemory = false

        this.init()
    }

    init() {
        try {
            // Attempt to load better-sqlite3 (native module)
            // If it fails (e.g., no binary for Electron context), fallback to memory
            const Database = window.require ? window.require('better-sqlite3') : null
            if (!Database) throw new Error('Native modules not available in renderer')

            this.db = new Database(this.dbPath)
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS vectors (
          id TEXT PRIMARY KEY,
          embedding BLOB NOT NULL,
          metadata TEXT
        )
      `)
            console.log('Persistence: SQLite initialized.')
        } catch (e) {
            console.warn('Persistence: SQLite Init Failed, using In-Memory Fallback.', e.message)
            this.useMemory = true
        }
    }

    addVector(id, embedding, metadata) {
        if (this.useMemory) {
            this.memoryStore.set(id, { embedding, metadata })
            return
        }

        try {
            const stmt = this.db.prepare('INSERT OR REPLACE INTO vectors (id, embedding, metadata) VALUES (?, ?, ?)')
            // Store Float32Array as buffer
            const buffer = Buffer.from(new Float32Array(embedding).buffer)
            stmt.run(id, buffer, JSON.stringify(metadata))
        } catch (e) {
            console.error('Persistence Add Failed:', e)
        }
    }

    search(queryEmbedding, topK = 5) {
        // Simple cosine similarity scan
        // For large datasets, use FAISS or specialized extension. For <10k, scan is fine.
        const results = []

        if (this.useMemory) {
            for (const [id, item] of this.memoryStore.entries()) {
                const score = this.cosineSimilarity(queryEmbedding, item.embedding)
                results.push({ id, score, metadata: item.metadata })
            }
        } else {
            try {
                const stmt = this.db.prepare('SELECT id, embedding, metadata FROM vectors')
                for (const row of stmt.iterate()) {
                    const embedding = new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4)
                    const score = this.cosineSimilarity(queryEmbedding, embedding)
                    results.push({ id: row.id, score, metadata: JSON.parse(row.metadata) })
                }
            } catch (e) {
                console.error('Persistence Search Failed:', e)
                return []
            }
        }

        return results.sort((a, b) => b.score - a.score).slice(0, topK)
    }

    cosineSimilarity(a, b) {
        let dot = 0
        let normA = 0
        let normB = 0
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i]
            normA += a[i] * a[i]
            normB += b[i] * b[i]
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1)
    }
}

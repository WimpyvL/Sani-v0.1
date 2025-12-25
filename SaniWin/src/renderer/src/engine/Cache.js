// src/renderer/src/engine/Cache.js

export class Cache {
    constructor(maxSize = 500) {
        this.maxSize = maxSize
        this.map = new Map()
    }

    get(key) {
        if (!this.map.has(key)) return null
        const value = this.map.get(key)
        // refresh order
        this.map.delete(key)
        this.map.set(key, value)
        return value
    }

    set(key, value) {
        if (this.map.has(key)) this.map.delete(key)
        this.map.set(key, value)
        if (this.map.size > this.maxSize) {
            // delete oldest entry
            const firstKey = this.map.keys().next().value
            this.map.delete(firstKey)
        }
    }
}

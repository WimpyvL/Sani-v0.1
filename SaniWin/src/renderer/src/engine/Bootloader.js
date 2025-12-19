// Sani Bootloader
// Reads core identity files from the parent repo.

export class Bootloader {
    constructor() {
        this.coreFiles = [
            'vault/SANI_FULL_IDENTITY.md',
            'vault/SANI_BEHAVIORAL_LAWS.md',
            'vault/SANI_GLOBAL_STATE_MAP.md',
            'vault/SANI_CODING_MANUAL.md'
        ]
        this.memory = {}
    }

    async boot() {
        console.log('SANI_BOOT: Initiating sequence...')
        const results = []

        for (const file of this.coreFiles) {
            try {
                console.log(`SANI_BOOT: Loading ${file}...`)
                // Ensure path uses forward slashes or handles OS diffs if needed, 
                // but typically the relative path logic in main process handles it.
                // We pass relative path from Sani Root.
                const response = await window.api.readSaniFile(file)

                if (response.success) {
                    this.memory[file] = response.content
                    results.push({ file, status: 'OK' })
                } else {
                    console.error(`SANI_BOOT: Failed to load ${file}`, response.error)
                    results.push({ file, status: 'ERROR', error: response.error })
                }
            } catch (e) {
                results.push({ file, status: 'CRITICAL', error: e.message })
            }
        }

        return {
            success: results.every(r => r.status === 'OK'),
            details: results,
            memory: this.memory
        }
    }
}

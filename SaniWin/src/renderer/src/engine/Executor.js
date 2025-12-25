// src/renderer/src/engine/Executor.js

export class Executor {
    constructor() { }

    async run(intent, args) {
        // Map intent to IPC calls defined in preload
        switch (intent) {
            case 'run_command':
                return await window.api.execCommand(args.command)
            case 'read_file':
                return await window.api.readSaniFile(args.path)
            case 'write_file':
                return await window.api.writeSaniFile(args.path, args.content)
            case 'list_dir':
                return await window.api.listSaniDir(args.path)
            case 'run_python':
                // Write temporary python file then execute
                const tempFile = 'calc_temp.py'
                await window.api.writeSaniFile(tempFile, args.code)
                return await window.api.execCommand(`python ${tempFile}`)
            default:
                throw new Error(`Unknown intent ${intent}`)
        }
    }
}

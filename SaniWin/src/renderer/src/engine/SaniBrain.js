import OpenAI from 'openai'

export class SaniBrain {
    constructor() {
        this.openai = null // Kept for init, but not used for chat
        this.systemPrompt = ''
        this.history = []
        this.offlineBrain = null
    }

    init(apiKey, memory, logger, config) {
        // Just store the key for passing to main process
        this.openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        })
        this.logger = logger || console.log

        // Instantiate OfflineBrain
        this.offlineBrain = new OfflineBrain(config)

        // Construct System Prompt from Identity Files
        // Priority: Identity > Laws > State Map
        const identity = memory['vault/SANI_FULL_IDENTITY.md'] || ''
        const laws = memory['vault/SANI_BEHAVIORAL_LAWS.md'] || ''
        const manual = memory['vault/SANI_CODING_MANUAL.md'] || ''
        const boot = "You are Sani. Follow the internal identity and laws strictly."

        this.systemPrompt = `${boot}\n\n=== IDENTITY ===\n${identity}\n\n=== LAWS ===\n${laws}\n\n=== CODING MANUAL ===\n${manual}`

        this.logger('info', 'SANI_BRAIN: Initialized with GPT-4o + Tools.')
    }

    async chat(userMessage, modelName = 'gpt-4o') {
        this.history.push({ role: 'user', content: userMessage })

        // === OFFLINE BRAIN CHECK ===
        if (this.offline) {
            try {
                const confidence = this.offline.canHandle(userMessage)
                if (confidence >= (this.offline.config.offlineThreshold || 0.75)) {
                    this.logger('info', `SANI_BRAIN: Handling offline (confidence: ${confidence})`)
                    const offlineResponse = await this.offline.respond(userMessage)
                    if (offlineResponse) {
                        this.history.push({ role: 'assistant', content: offlineResponse })
                        return offlineResponse
                    }
                }
            } catch (err) {
                console.error('Offline Brain Error:', err)
                // Continue to LLM fallback
            }
        }

        // Tools Definition must match what Main Process expects or be passed
        // Since we pass tools to main process, we define them here.
        const tools = [
            {
                type: 'function',
                function: {
                    name: 'run_command',
                    description: 'Execute a shell command (PowerShell). Use for git, npm, file ops.',
                    parameters: {
                        type: 'object',
                        properties: {
                            command: { type: 'string', description: 'The command to run' }
                        },
                        required: ['command']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'read_file',
                    description: 'Read a file from the system. Supports both project-relative paths and absolute paths (e.g., C:/Users/...).',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to file (Relative or Absolute)' }
                        },
                        required: ['path']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'write_file',
                    description: 'Create or overwrite a file. Supports absolute paths.',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to file (Relative or Absolute)' },
                            content: { type: 'string', description: 'Content to write' }
                        },
                        required: ['path', 'content']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'list_dir',
                    description: 'List contents of a directory. Supports absolute paths.',
                    parameters: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to directory (Relative or Absolute)' }
                        },
                        required: ['path']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'run_python',
                    description: 'Execute a Python script. Useful for calculations, logic testing, or data manip.',
                    parameters: {
                        type: 'object',
                        properties: {
                            code: { type: 'string', description: 'The python code to execute' }
                        },
                        required: ['code']
                    }
                }
            }
        ]

        try {
            this.logger('info', `BRAIN: Proxying request to Main Process | Model: ${modelName}`)

            // === MAIN PROCESS PROXY CALL ===
            let res = await window.api.chatCompletion({
                model: modelName,
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    ...this.history
                ],
                tools: tools,
                apiKey: this.openai?.apiKey
            })

            if (!res.success) throw new Error(res.error)

            let message = res.message

            while (message.tool_calls) {
                this.history.push(message)

                for (const toolCall of message.tool_calls) {
                    const fnName = toolCall.function.name
                    const args = JSON.parse(toolCall.function.arguments)
                    let result = ''

                    this.logger('info', `SANI_BRAIN: Executing Tool ${fnName} ${JSON.stringify(args)}`)

                    try {
                        if (fnName === 'run_command') {
                            const cmdRes = await window.api.execCommand(args.command)
                            result = cmdRes.code === 0 ? cmdRes.stdout : `Error (Code ${cmdRes.code}): ${cmdRes.stderr}`
                        } else if (fnName === 'read_file') {
                            const fileRes = await window.api.readSaniFile(args.path)
                            result = fileRes.success ? fileRes.content : `Error: ${fileRes.error}`
                        } else if (fnName === 'write_file') {
                            const writeRes = await window.api.writeSaniFile(args.path, args.content)
                            result = writeRes.success ? `Success: Wrote to ${writeRes.path}` : `Error: ${writeRes.error}`
                        } else if (fnName === 'list_dir') {
                            const listRes = await window.api.listSaniDir(args.path)
                            result = listRes.success ? JSON.stringify(listRes.files) : `Error: ${listRes.error}`
                        } else if (fnName === 'run_python') {
                            const tempFile = 'calc_temp.py'
                            await window.api.writeSaniFile(tempFile, args.code)
                            const pyRes = await window.api.execCommand(`python ${tempFile}`)
                            result = pyRes.code === 0 ? pyRes.stdout : `Error (Code ${pyRes.code}): ${pyRes.stderr}`
                        }
                    } catch (e) {
                        result = `Tool System Error: ${e.message}`
                        this.logger('error', `Tool Error: ${e.message}`)
                    }

                    this.history.push({
                        role: 'tool',
                        tool_call_id: toolCall.id,
                        name: fnName,
                        content: result
                    })
                }

                // Next Loop Call via Proxy
                res = await window.api.chatCompletion({
                    model: modelName,
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...this.history
                    ],
                    tools: tools,
                    apiKey: this.openai?.apiKey
                })

                if (!res.success) throw new Error(res.error)
                message = res.message
            }

            const reply = message.content
            this.history.push({ role: 'assistant', content: reply })
            return reply

        } catch (error) {
            console.error('SANI_BRAIN Error:', error)
            this.logger('error', `API ERROR: ${error.message}`)
            return `[SYSTEM ERROR]: ${error.message}`
        }
    }
}

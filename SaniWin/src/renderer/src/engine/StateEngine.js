// Sani State Engine
// Manages the active Protocol/State based on Global State Map

export class StateEngine {
    constructor() {
        this.currentState = 'BASELINE_ARCHITECT' // Default start
        this.stateHistory = []
    }

    // initialize with loaded state map content
    init(mapContent) {
        this.mapContent = mapContent
        console.log('SANI_STATE: Engine initialized.')
        // TODO: Parse mapContent to validate transitions
    }

    transition(newState) {
        console.log(`SANI_STATE: Transitioning from ${this.currentState} to ${newState}`)
        this.stateHistory.push(this.currentState)
        this.currentState = newState
        return this.currentState
    }

    getCurrentState() {
        return this.currentState
    }
}

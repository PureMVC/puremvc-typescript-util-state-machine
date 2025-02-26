export class State {
    constructor(name, entering = null, exiting = null, changed = null) {
        this.transitions = {};
        this.name = name;
        this.entering = entering || null;
        this.exiting = exiting || null;
        this.changed = changed || null;
    }
    defineTransition(action, target) {
        if (this.getTarget(action) != null)
            return;
        this.transitions[action] = target;
    }
    removeTransition(action) {
        this.transitions[action] = undefined;
    }
    getTarget(action) {
        return action ? this.transitions[action] : undefined;
    }
}

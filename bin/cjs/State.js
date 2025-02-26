"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
class State {
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
exports.State = State;

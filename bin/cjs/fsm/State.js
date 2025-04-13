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
        if (this.getTarget(action) !== undefined)
            return;
        this.transitions[action] = target;
    }
    getTarget(action) {
        return action ? this.transitions[action] : undefined;
    }
}
exports.State = State;

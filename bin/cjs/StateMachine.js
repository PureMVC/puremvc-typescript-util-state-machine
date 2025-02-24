"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
const puremvc_typescript_multicore_framework_1 = require("@puremvc/puremvc-typescript-multicore-framework");
class StateMachine extends puremvc_typescript_multicore_framework_1.Mediator {
    constructor() {
        super(StateMachine.NAME);
        this.states = {};
        this.initial = null;
        this.canceled = false;
        this.currentState = null;
    }
    onRegister() {
        if (this.initial)
            this.transitionTo(this.initial, null);
    }
    registerState(state, initial = false) {
        if (state == null || this.states[state.name] != null)
            return;
        this.states[state.name] = state;
        if (initial)
            this.initial = state;
    }
    removeState(stateName) {
        const state = this.states[stateName];
        if (state == null)
            return;
        delete this.states[stateName];
    }
    transitionTo(nextState, data = null) {
        if (nextState === null)
            return;
        this.canceled = false;
        if (this.currentState && this.currentState.exiting) {
            this.sendNotification(this.currentState.exiting, data, nextState.name);
        }
        if (this.canceled) {
            this.canceled = false;
            return;
        }
        if (nextState.entering) {
            this.sendNotification(nextState.entering, data);
        }
        if (this.canceled) {
            this.canceled = false;
            return;
        }
        this.currentState = nextState;
        if (nextState.changed) {
            if (this.currentState.changed != null) {
                this.sendNotification(this.currentState.changed, data);
            }
        }
        this.sendNotification(StateMachine.CHANGED, this.currentState, this.currentState.name);
    }
    listNotificationInterests() {
        return [StateMachine.ACTION, StateMachine.CANCEL];
    }
    handleNotification(note) {
        var _a;
        switch (note.name) {
            case StateMachine.ACTION:
                const action = note.type;
                const target = (_a = this.currentState) === null || _a === void 0 ? void 0 : _a.getTarget(action);
                const newState = this.states[target];
                if (newState)
                    this.transitionTo(newState, note.body);
                break;
            case StateMachine.CANCEL:
                this.canceled = true;
                break;
        }
    }
    get viewComponent() {
        return this.currentState;
    }
    set viewComponent(state) {
        this.currentState = state;
    }
}
exports.StateMachine = StateMachine;
StateMachine.NAME = "StateMachine";
StateMachine.ACTION = StateMachine.NAME + "/notes/action";
StateMachine.CHANGED = StateMachine.NAME + "/notes/changed";
StateMachine.CANCEL = StateMachine.NAME + "/notes/cancel";

import { Notifier, } from "@puremvc/puremvc-typescript-multicore-framework";
import { State } from "./State";
import { StateMachine } from "./StateMachine";
export class FSMInjector extends Notifier {
    constructor(multitonKey, fsmConfig) {
        super();
        this.stateList = null;
        this.initializeNotifier(multitonKey);
        this.fsmConfig = fsmConfig;
    }
    inject() {
        const stateMachine = new StateMachine();
        stateMachine.initializeNotifier(this.multitonKey);
        for (const state of this.states) {
            stateMachine.registerState(state, this.isInitial(state.name));
        }
        // Register the StateMachine with the facade
        this.facade.registerMediator(stateMachine);
        return stateMachine;
    }
    get states() {
        if (this.stateList === null) {
            this.stateList = [];
            for (const stateDef of this.fsmConfig.states) {
                const state = this.createState(stateDef);
                this.stateList.push(state);
            }
        }
        return this.stateList;
    }
    createState(stateDef) {
        const name = stateDef.name;
        const exiting = stateDef.exiting || null;
        const entering = stateDef.entering || null;
        const changed = stateDef.changed || null;
        const state = new State(name, entering, exiting, changed);
        const transitions = stateDef.transitions || [];
        for (const transDef of transitions) {
            state.defineTransition(transDef.action, transDef.target);
        }
        return state;
    }
    isInitial(stateName) {
        return stateName === this.fsmConfig.initial;
    }
}

import {
  Notifier,
  IMediator,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { State } from "./State.js";
import { StateMachine } from "./StateMachine.js";
import { FSM, StateDef } from "../types.js";

export class FSMInjector extends Notifier {
  private fsmConfig: FSM;
  private stateList: State[] | null = null;

  constructor(multitonKey: string, fsmConfig: FSM) {
    super();
    this.initializeNotifier(multitonKey);
    this.fsmConfig = fsmConfig;
  }

  public inject(): StateMachine {
    const stateMachine: StateMachine = new StateMachine();
    stateMachine.initializeNotifier(this.multitonKey);
    for (const state of this.states) {
      stateMachine.registerState(state, this.isInitial(state.name));
    }

    // Register the StateMachine with the facade
    this.facade.registerMediator(stateMachine as IMediator);
    return stateMachine;
  }

  protected get states(): State[] {
    if (this.stateList === null) {
      this.stateList = [];
      for (const stateDef of this.fsmConfig.states) {
        const state: State = this.createState(stateDef);
        this.stateList.push(state);
      }
    }
    return this.stateList;
  }

  protected createState(stateDef: StateDef): State {
    const name: string = stateDef.name;
    const exiting: string | null = stateDef.exiting || null;
    const entering: string | null = stateDef.entering || null;
    const changed: string | null = stateDef.changed || null;
    const state: State = new State(name, entering, exiting, changed);

    const transitions = stateDef.transitions || [];
    for (const transDef of transitions) {
      state.defineTransition(transDef.action, transDef.target);
    }

    return state;
  }

  protected isInitial(stateName: string): boolean {
    return stateName === this.fsmConfig.initial;
  }
}

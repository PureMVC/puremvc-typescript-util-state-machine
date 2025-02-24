import {
  Notifier,
  IMediator,
} from "@puremvc/puremvc-typescript-multicore-framework/"
import { State } from "./State";
import { StateMachine } from "./StateMachine";

export type Transition = {
  action: string;
  target: string;
};

export type StateDef = {
  name: string;
  entering?: string;
  exiting?: string;
  changed?: string;
  transitions?: Transition[];
};

export type FSM = {
  initial: string;
  states: StateDef[];
};

export class FSMInjector extends Notifier {
  private fsmConfig: FSM;
  private stateList: State[] | null = null;

  constructor(fsmConfig: FSM) {
    super();
    this.fsmConfig = fsmConfig;
  }

  public inject(): void {
    const stateMachine: StateMachine = new StateMachine();

    for (const state of this.states) {
      stateMachine.registerState(state, this.isInitial(state.name));
    }

    // Register the StateMachine with the facade
    this.facade.registerMediator(stateMachine as IMediator);
  }

  protected get states(): State[] {
    if (this.stateList == null) {
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
      state.defineTrans(transDef.action, transDef.target);
    }

    return state;
  }

  protected isInitial(stateName: string): boolean {
    return stateName === this.fsmConfig.initial;
  }
}

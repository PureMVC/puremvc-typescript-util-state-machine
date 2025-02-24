import {
  Mediator,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { State } from "./State";

export class StateMachine extends Mediator {
  public static NAME: string = "StateMachine";
  public static ACTION: string = StateMachine.NAME + "/notes/action";
  public static CHANGED: string = StateMachine.NAME + "/notes/changed";
  public static CANCEL: string = StateMachine.NAME + "/notes/cancel";

  protected states: { [name: string]: State } = {};
  protected initial: State | null = null;
  protected canceled: boolean = false;
  protected currentState: State | null = null;

  constructor() {
    super(StateMachine.NAME);
  }

  public onRegister(): void {
    if (this.initial) this.transitionTo(this.initial, null);
  }

  public registerState(state: State, initial: boolean = false): void {
    if (state == null || this.states[state.name] != null) return;
    this.states[state.name] = state;
    if (initial) this.initial = state;
  }

  public removeState(stateName: string): void {
    const state: State = this.states[stateName];
    if (state == null) return;
    delete this.states[stateName];
  }

  protected transitionTo(nextState: State, data: unknown = null): void {
    if (nextState === null) return;

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

    this.sendNotification(
      StateMachine.CHANGED,
      this.currentState,
      this.currentState.name,
    );
  }

  public listNotificationInterests(): string[] {
    return [StateMachine.ACTION, StateMachine.CANCEL];
  }

  public handleNotification(note: INotification): void {
    switch (note.name) {
      case StateMachine.ACTION:
        const action: string | undefined = note.type;
        const target: string | undefined = this.currentState?.getTarget(action);
        const newState: State = this.states[target as string];
        if (newState) this.transitionTo(newState, note.body);
        break;

      case StateMachine.CANCEL:
        this.canceled = true;
        break;
    }
  }

  get viewComponent(): State | null {
    return this.currentState;
  }

  set viewComponent(state: State) {
    this.currentState = state;
  }
}

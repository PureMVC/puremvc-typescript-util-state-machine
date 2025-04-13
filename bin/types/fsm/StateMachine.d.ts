import { Mediator, INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { State } from "./State";
export declare class StateMachine extends Mediator {
    static NAME: string;
    static ACTION: string;
    static CHANGED: string;
    static CANCEL: string;
    protected states: {
        [name: string]: State;
    };
    protected initial: State | null;
    protected canceled: boolean;
    protected currentState: State | null;
    constructor();
    onRegister(): void;
    registerState(state: State, initial?: boolean): void;
    getState(name: string): State | undefined;
    removeState(stateName: string): void;
    protected transitionTo(nextState: State, data?: unknown): void;
    listNotificationInterests(): string[];
    handleNotification(note: INotification): void;
    get viewComponent(): State | null;
}

import { Notifier } from "@puremvc/puremvc-typescript-multicore-framework/";
import { State } from "./State";
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
export declare class FSMInjector extends Notifier {
    private fsmConfig;
    private stateList;
    constructor(fsmConfig: FSM);
    inject(): void;
    protected get states(): State[];
    protected createState(stateDef: StateDef): State;
    protected isInitial(stateName: string): boolean;
}

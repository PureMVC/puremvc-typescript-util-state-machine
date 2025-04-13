import { Notifier } from "@puremvc/puremvc-typescript-multicore-framework";
import { State } from "./State";
import { StateMachine } from "./StateMachine";
import { FSM, StateDef } from "../types";
export declare class FSMInjector extends Notifier {
    private fsmConfig;
    private stateList;
    constructor(multitonKey: string, fsmConfig: FSM);
    inject(): StateMachine;
    protected get states(): State[];
    protected createState(stateDef: StateDef): State;
    protected isInitial(stateName: string): boolean;
}

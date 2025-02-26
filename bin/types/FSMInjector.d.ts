import { Notifier } from "@puremvc/puremvc-typescript-multicore-framework";
import { State } from "./State";
import { FSM, StateDef } from "./types";
export declare class FSMInjector extends Notifier {
    private fsmConfig;
    private stateList;
    constructor(fsmConfig: FSM);
    inject(): void;
    protected get states(): State[];
    protected createState(stateDef: StateDef): State;
    protected isInitial(stateName: string): boolean;
}

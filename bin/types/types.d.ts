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

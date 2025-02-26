export declare class State {
    name: string;
    entering: string | null;
    exiting: string | null;
    changed: string | null;
    protected transitions: {
        [action: string]: string | undefined;
    };
    constructor(name: string, entering?: string | null, exiting?: string | null, changed?: string | null);
    defineTransition(action: string, target: string): void;
    removeTransition(action: string): void;
    getTarget(action: string | undefined): string | undefined;
}

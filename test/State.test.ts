import { State } from '../src';

describe('State', () => {
    test('should create a State instance with minimal constructor args', () => {
        const state = new State("Waiting");
        expect(state).toBeInstanceOf(State);
    });
    test('should create a State instance with all constructor args', () => {
        const state = new State("Waiting", "enteringWaiting", "exitingWaiting", "changedToWaiting");
        expect(state).toBeInstanceOf(State);
    });
    test('should define a transition' , () => {
        const state = new State("Waiting", "enteringWaiting", "exitingWaiting", "changedToWaiting");
        state.defineTransition('exit', 'Doing');
        expect(state.getTarget('exit')).toEqual('Doing');
    });
    test('should not replace a transition that is already defined' , () => {
        const state = new State("Waiting", "enteringWaiting", "exitingWaiting", "changedToWaiting");
        state.defineTransition('exit', 'Doing');
        state.defineTransition('exit', 'Loitering');
        expect(state.getTarget('exit')).toEqual('Doing');
    });
    test('should not replace a transition that is already defined' , () => {
        const state = new State("Waiting", "enteringWaiting", "exitingWaiting", "changedToWaiting");

        expect(state.getTarget('')).toEqual(undefined);
    });
});

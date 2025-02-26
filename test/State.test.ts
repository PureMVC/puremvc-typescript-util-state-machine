import { State } from '../src';

describe('State', () => {
    test('should create a State instance', () => {
        const state = new State("Waiting", "enteringWaiting", "exitingWaiting", "changedToWaiting");
        expect(state).toBeInstanceOf(State);
    });
});

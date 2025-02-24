import { StateMachine } from '../src';

describe('StateMachine', () => {
    test('should create a StateMachine instance', () => {
        const stateMachine = new StateMachine();
        expect(stateMachine).toBeInstanceOf(StateMachine);
    });
});
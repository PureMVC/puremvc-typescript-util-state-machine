import * as index from '../src';

describe('Index Module', () => {
    test('should export expected components', () => {
        expect(index).toBeDefined();
        expect(index.StateMachine).toBeDefined();
        expect(index.FSMInjector).toBeDefined();
        expect(index.State).toBeDefined();
    });
});

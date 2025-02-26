import { FSMInjector } from '../src';
import {FSM} from "../src";

const fsmConfig:FSM = {
    initial: "Closed",
    states: [
        {
            name: "Closed",
            transitions: [
                {
                    action: "Open",
                    target: "Opened",
                },
                {
                    action: "Lock",
                    target: "Locked",
                }
            ]
        },
        {
            name: "Opened",
            transitions: [
                {
                    action: "Close",
                    target: "Closed",
                }
            ]
        },
        {
            name: "Locked",
            transitions: [
                {
                    action: "Unlock",
                    target: "Closed",
                }
            ]
        }
    ]
};

describe('FSMInjector', () => {
    test('should create an FSMInjector instance', () => {
        const fsmInjector = new FSMInjector("Test", fsmConfig);
        expect(fsmInjector).toBeInstanceOf(FSMInjector);
    });

    test('should inject a state machine from configuration', () => {
        const fsmInjector = new FSMInjector("Test", fsmConfig);
        fsmInjector.inject();
        expect(fsmInjector).toBeInstanceOf(FSMInjector);
    });

});

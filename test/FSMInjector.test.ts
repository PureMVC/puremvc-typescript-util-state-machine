import { FSMInjector } from '../src';
import {FSM, StateDef, Transition} from "../src";

describe('FSMInjector', () => {
    test('should create an FSMInjector instance', () => {
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

        const fsmInjector = new FSMInjector(fsmConfig);
        expect(fsmInjector).toBeInstanceOf(FSMInjector);
    });
});

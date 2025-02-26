import {FSM, FSMInjector, State, StateMachine} from '../src';
import {Notification} from "@puremvc/puremvc-typescript-multicore-framework";

const fsmConfig: FSM = {
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
            ],
            exiting: "leaveClosed"
        },
        {
            name: "Opened",
            transitions: [
                {
                    action: "Close",
                    target: "Closed",
                }
            ],
            entering: "enteringClosed",
            changed: "doorIsClosed"
        },
        {
            name: "Locked",
            transitions: [
                {
                    action: "Unlock",
                    target: "Closed",
                },
                {
                    action: "KickIn",
                    target: "KickedIn",
                },
            ]
        },
        {
            name: "KickedIn"
        },
    ]
};
const multitonKey: string = "FSM_Unit_Tests";
const testState: () => State = () => new State("Waiting", "enteringWaiting", "exitingWaiting", "changedToWaiting");

describe('StateMachine', () => {
    test('should create a StateMachine instance', () => {
        const stateMachine = new StateMachine();
        expect(stateMachine).toBeInstanceOf(StateMachine);
    });

    test('should register a state', () => {
        const stateMachine = new StateMachine();
        const state = testState();
        stateMachine.registerState(state);
        expect(stateMachine.getState("Waiting")).toBeInstanceOf(State);
        expect(stateMachine.getState("Waiting")).toBe(state);
    });

    test('should remove a state', () => {
        const stateMachine = new StateMachine();
        const state =  testState();
        stateMachine.registerState(state);
        stateMachine.removeState("Waiting");
        expect(stateMachine.getState("Waiting")).toBe(undefined);
    });

    test('should transition to initial state on registration', () => {
        const fsmInjector = new FSMInjector(multitonKey, fsmConfig);
        const stateMachine = fsmInjector.inject();
        stateMachine.onRegister();
        expect(stateMachine.viewComponent).toBeInstanceOf(State);
        expect(stateMachine.viewComponent?.name).toBe("Closed");
    });

    test('should transition state on valid ACTION note', () => {
        const fsmInjector = new FSMInjector(multitonKey, fsmConfig);
        const stateMachine = fsmInjector.inject();
        stateMachine.onRegister();

        // Try a valid action
        const action = new Notification(StateMachine.ACTION, "", "Open");
        stateMachine.handleNotification(action);

        expect(stateMachine.viewComponent).toBeInstanceOf(State);
        expect(stateMachine.viewComponent?.name).toBe("Opened");
    });

    test('should not transition state on invalid ACTION note', () => {
        const fsmInjector = new FSMInjector(multitonKey, fsmConfig);
        const stateMachine = fsmInjector.inject();
        stateMachine.onRegister();

        // Try an invalid action
        const action = new Notification(StateMachine.ACTION, "", "Zork");
        stateMachine.handleNotification(action);

        expect(stateMachine.viewComponent?.name).toBe("Closed");
    });




});

import { FSMInjector, FSM, StateMachine } from "../src";

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
        },
      ],
    },
    {
      name: "Opened",
      transitions: [
        {
          action: "Close",
          target: "Closed",
        },
      ],
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
      ],
    },
    {
      name: "KickedIn",
    },
  ],
};

describe("FSMInjector", () => {
  test("should create an FSMInjector instance", () => {
    const fsmInjector = new FSMInjector("Test", fsmConfig);
    expect(fsmInjector).toBeInstanceOf(FSMInjector);
  });

  test("should inject a state machine from configuration", () => {
    const fsmInjector = new FSMInjector("FSM_Unit_Tests", fsmConfig);
    const stateMachine = fsmInjector.inject();
    expect(stateMachine.name).toBe(StateMachine.NAME);
  });
});

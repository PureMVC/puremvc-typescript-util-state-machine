## PureMVC MultiCore tate Machine Utility — Developer Guide

This guide explains how the Finite State Machine (FSM) utility works and how to use it with PureMVC (MultiCore) in TypeScript. It includes practical examples showing both programmatic setup and JSON-driven configuration via `FSMInjector`.

### What you get
- A lightweight `StateMachine` `Mediator` that manages named `State` objects
- Declarative transitions between states triggered by simple action strings
- Optional notifications fired when entering, exiting, or after changing state
- A `FSMInjector` that builds and registers the `StateMachine` from a JSON config

### Install
```
npm install @puremvc/puremvc-typescript-multicore-framework
npm install @puremvc/puremvc-typescript-util-state-machine
```

### Imports (ESM)
```ts
import {
  StateMachine,
  FSMInjector,
  State,
  type FSM,
} from '@puremvc/puremvc-typescript-util-state-machine';
```

---

### Core concepts

- StateMachine (Mediator)
  - Name: `StateMachine.NAME` (`"StateMachine"`)
  - Notifications it cares about:
    - `StateMachine.ACTION` — trigger transitions (type = action string; body = optional data)
    - `StateMachine.CANCEL` — cancel a pending transition during exiting/entering
  - Notification it emits:
    - `StateMachine.CHANGED` — broadcast after a successful transition; body = new `State`; type = state name
  - Holds a registry of `State` instances and tracks `currentState`.

- State
  - Properties: `name`, optional `entering`, `exiting`, `changed` notification names
  - Methods:
    - `defineTransition(action: string, target: string)` — define an action that leads to another state
    - `getTarget(action: string)` — resolve the target state name for an action

- FSM JSON schema (for `FSMInjector`)
  - Types exported as `FSM`, `StateDef`, `Transition`
  - Shape:
    ```ts
    type Transition = { action: string; target: string };
    type StateDef = {
      name: string;
      entering?: string; // notification to send on entering
      exiting?: string;  // notification to send on exiting
      changed?: string;  // notification to send after state becomes current
      transitions?: Transition[];
    };
    type FSM = { initial: string; states: StateDef[] };
    ```

---

### Transition lifecycle

When an actor sends `StateMachine.ACTION` with the desired action in the notification type, the `StateMachine` checks the current state for a matching transition:

1. If found, an exit sequence starts:
   - If the current state has `exiting`, it sends that notification with:
     - body = any `data` passed in the ACTION
     - type = next state name (so observers know where we’re going)
   - Any observer can cancel the transition by sending `StateMachine.CANCEL` while handling the exit notification.
2. If not canceled, an enter sequence starts for the next state:
   - If the next state has `entering`, it sends that notification with body = the same `data`.
   - Observers may also cancel here by sending `StateMachine.CANCEL`.
3. If not canceled:
   - `currentState` becomes the next state.
   - If the state has `changed`, it sends that notification with body = the same `data`.
   - Then `StateMachine.CHANGED` is sent with body = the new `State` and type = its name.

Notes:
- Cancelation resets the internal flag and the `currentState` remains unchanged.
- The `StateMachine` is a `Mediator`; it should be registered with your `Facade`.
- On registration (`onRegister`), if an initial state is set, it transitions to it immediately (running the enter/changed notifications for that state only).

---

### Programmatic setup example

This minimal example shows how to create states, define transitions, register the `StateMachine`, and fire actions.

```ts
import {
  Facade,
  Notifier,
  INotification,
  Mediator,
} from '@puremvc/puremvc-typescript-multicore-framework';
import { StateMachine, State } from '@puremvc/puremvc-typescript-util-state-machine';

const MULTITON_KEY = 'com.example.app';

// 1) Build your states
const opened = new State(
  'OPENED',
  'note/opening',   // entering
  null,             // exiting
  'note/opened',    // changed
);
const closed = new State(
  'CLOSED',
  'note/closing',   // entering
);

// 2) Define transitions
opened.defineTransition('CLOSE', 'CLOSED');
closed.defineTransition('OPEN', 'OPENED');

// 3) Create and register the StateMachine
const fsm = new StateMachine();
fsm.initializeNotifier(MULTITON_KEY);
fsm.registerState(opened /* initial? */);
fsm.registerState(closed, /* initial = */ true);

Facade.getInstance(MULTITON_KEY).registerMediator(fsm as Mediator);

// 4) Listen for changes and lifecycle notifications elsewhere
class DoorMediator extends Mediator {
  public static NAME = 'DoorMediator';
  constructor() { super(DoorMediator.NAME); }

  listNotificationInterests(): string[] {
    return [
      'note/opening',
      'note/opened',
      'note/closing',
      StateMachine.CHANGED,
    ];
  }

  handleNotification(note: INotification): void {
    switch (note.name) {
      case 'note/opening':
        console.log('Entering OPENED with data:', note.body);
        break;
      case 'note/opened':
        console.log('Changed to OPENED');
        break;
      case 'note/closing':
        console.log('Entering CLOSED with data:', note.body);
        break;
      case StateMachine.CHANGED:
        // note.body is the new State
        console.log('FSM changed to:', (note.body as State).name);
        break;
    }
  }
}

const facade = Facade.getInstance(MULTITON_KEY);
facade.registerMediator(new DoorMediator());

// 5) Trigger transitions from any Notifier-aware actor
class UserAction extends Notifier {
  constructor() { super(); this.initializeNotifier(MULTITON_KEY); }
  openDoor() {
    this.sendNotification(StateMachine.ACTION, { by: 'user' }, 'OPEN');
  }
  closeDoor() {
    this.sendNotification(StateMachine.ACTION, { by: 'user' }, 'CLOSE');
  }
}

const user = new UserAction();
user.openDoor();  // CLOSED -> OPENED
user.closeDoor(); // OPENED -> CLOSED
```

Tip: The action string is passed in the notification `type`. The optional `body` payload flows through exiting/entering/changed notifications.

---

### Canceling a transition

Any observer of an `exiting` or `entering` notification can veto the move by sending `StateMachine.CANCEL` before the sequence completes.

```ts
class GuardMediator extends Mediator {
  public static NAME = 'GuardMediator';
  constructor() { super(GuardMediator.NAME); }

  listNotificationInterests(): string[] {
    return ['note/unlocking']; // suppose this is an exiting/entering note
  }

  handleNotification(note: INotification): void {
    const shouldBlock = /* your rule */ false;
    if (shouldBlock) {
      this.facade.sendNotification(StateMachine.CANCEL);
    }
  }
}
```

When canceled, the FSM remains in the current state and no `changed` or `StateMachine.CHANGED` notifications are sent.

---

### JSON-driven setup with FSMInjector

Use `FSMInjector` when you want to drive the FSM from configuration rather than code.

```ts
import {
  Facade,
} from '@puremvc/puremvc-typescript-multicore-framework';
import {
  FSMInjector,
  StateMachine,
  type FSM,
} from '@puremvc/puremvc-typescript-util-state-machine';

const MULTITON_KEY = 'com.example.app';

const fsmConfig: FSM = {
  initial: 'CLOSED',
  states: [
    {
      name: 'OPENED',
      entering: 'note/opening',
      changed: 'note/opened',
      transitions: [
        { action: 'CLOSE', target: 'CLOSED' },
      ],
    },
    {
      name: 'CLOSED',
      entering: 'note/closing',
      transitions: [
        { action: 'OPEN', target: 'OPENED' },
        { action: 'LOCK', target: 'LOCKED' },
      ],
    },
    {
      name: 'LOCKED',
      entering: 'note/locking',
      exiting: 'note/unlocking',
      transitions: [
        { action: 'UNLOCK', target: 'CLOSED' },
      ],
    },
  ],
};

// Build + register the StateMachine from JSON
const injector = new FSMInjector(MULTITON_KEY, fsmConfig);
const fsm = injector.inject(); // returns the created & registered StateMachine

// Listen for global CHANGED notifications
Facade.getInstance(MULTITON_KEY).registerMediator(new (class extends Mediator {
  constructor() { super('LogFSM'); }
  listNotificationInterests() { return [StateMachine.CHANGED]; }
  handleNotification(note: INotification) {
    console.log('FSM CHANGED ->', note.type); // state name
  }
})());

// Fire actions as before
Facade.getInstance(MULTITON_KEY).sendNotification(StateMachine.ACTION, undefined, 'OPEN');
```

How it works under the hood:
- `FSMInjector.inject()` creates a new `StateMachine`, initializes it with your Multiton key, builds `State` instances from each `StateDef`, registers initial state, and registers the `StateMachine` with your `Facade`.
- On `onRegister()`, the `StateMachine` automatically transitions to the initial state if one was provided.

---

### Practical tips

- Keep action strings short and consistent (e.g., `OPEN`, `CLOSE`). Consider centralizing them in a `const` enum or constants module.
- Use the `exiting` notification’s type (which the FSM sets to the target state name) to detect where you’re headed, useful for preloading or validation.
- Avoid side effects in `CHANGED` handlers that could recursively trigger more actions unless you explicitly want chained transitions.
- If a transition is often canceled, consider checking preconditions before sending `StateMachine.ACTION` to reduce churn.
- Unit tests: mock observers can assert the exact order of notifications: exiting -> entering -> changed -> StateMachine.CHANGED.

---

### Troubleshooting

- Nothing happens when you send `StateMachine.ACTION`:
  - Ensure the `StateMachine` is registered with the same Multiton key as the sender.
  - Ensure the current state defines a transition for the given action string.
  - Verify you passed the action in `type`, not `body`.

- Transition always aborts:
  - Some observer may be sending `StateMachine.CANCEL` while handling `exiting` or `entering`. Add logging to those handlers to find the culprit.

- Didn’t enter the initial state:
  - The initial state is set by passing `initial=true` to `registerState(...)` or via the JSON `initial` property.
  - Confirm `onRegister()` is being called (i.e., the `StateMachine` is actually registered as a Mediator).

---

### API quick reference

- StateMachine
  - Constants: `NAME`, `ACTION`, `CHANGED`, `CANCEL`
  - Methods:
    - `registerState(state: State, initial?: boolean): void`
    - `getState(name: string): State | undefined`
    - `removeState(name: string): void`
    - `viewComponent: State | null` — current state

- State
  - Constructor: `new State(name, entering?, exiting?, changed?)`
  - `defineTransition(action, target)`
  - `getTarget(action)`

- FSMInjector
  - Constructor: `new FSMInjector(multitonKey: string, fsm: FSM)`
  - `inject(): StateMachine` — creates states, registers the `StateMachine` with the Facade

---

If you need deeper details, see the source in `src/fsm` and the type definitions in `src/types.ts`.

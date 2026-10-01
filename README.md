# `pts-finite-state` - Finite State Machine (FSM) Framework

> **Author**: pTSern  
> **Version**: `1.0.0`  
> **Cocos Creator Compatibility**: `>= 3.8.0`  
> **Category**: Game Architecture, AI & State Management

---

## 1. Overview

`pts-finite-state` is an enterprise-grade Finite State Machine (FSM) runtime framework for Cocos Creator. It bridges traditional OOP state machine patterns with the **ScriptableObject architecture** of `pts-core` and `pts-asset`.

Instead of hardcoding character states, AI behaviors, or game flow transitions inside monolithic scripts, `pts-finite-state` allows developers to define individual states as modular, reusable `.pts` data assets that can be customized in the Inspector, swapped dynamically, and shared across multiple entity archetypes.

---

## 2. Process Architecture & Topology

```
┌─────────────────────────────────────────────────────────────┐
│                 AssetDB Mount: `db://assets`                │
│  Mounted from `./assets` as read-only runtime package       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       FSM Architecture                      │
│                                                             │
│   [ Pure TypeScript Base ]          [ ScriptableObject FSM ]│
│  ┌────────────────────────┐        ┌───────────────────────┐│
│  │FiniteState_Base_Machine│        │FiniteState_pTSAsset_  ││
│  │- change(id, force)     │◄───────┤Machine                ││
│  │- tick(dt)              │        │- Stored as .pts asset ││
│  └───────────┬────────────┘        └───────────┬───────────┘│
│              │                                 │            │
│              ▼                                 ▼            │
│  ┌────────────────────────┐        ┌───────────────────────┐│
│  │FiniteState_Base_State  │        │FiniteState_pTSAsset_  ││
│  │- onEnter(context)      │◄───────┤State                  ││
│  │- onExit(context)       │        │- Inspector Properties ││
│  │- onTick(dt, context)   │        │- Reusable behaviors   ││
│  └────────────────────────┘        └───────────────────────┘│
│                                                │            │
│                                                ▼            │
│                                    ┌───────────────────────┐│
│                                    │FiniteState_LazyMachine││
│                                    │- Enum State Mapping   ││
│                                    │- Dynamic Initer Hook  ││
│                                    └───────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Core Classes & Subsystems

### 3.1. Standard OOP Foundation (`assets/scripts/Base/`)

* **`FiniteState_Base_Machine<TId, TContext>`**:
  * Generic state machine controller.
  * Manages active state, state transitions (`change({ id, force })`), and frame ticks (`tick(dt)`).
  * Enforces lifecycle ordering: `oldState.onExit()` -> `newState.onEnter()`.
* **`FiniteState_Base_State<TContext, TOnEnter, TOnExit, TOnTick>`**:
  * Abstract state class.
  * Exposes typed hooks:
    * `onEnter(context, ...args)`: Triggered on state entry.
    * `onExit(context, ...args)`: Triggered when leaving state.
    * `onTick(dt, context, ...args)`: Frame update hook while active.

---

### 3.2. ScriptableObject FSM Engine (`assets/scripts/pTSAsset/`)

* **`FiniteState_pTSAsset_Machine`**:
  * Inherits from `pTSAsset` and implements `FiniteState_Base_Machine`.
  * Serializes state dictionary and initial state into a `.pts` asset file.
  * Enables drag-and-drop state configuration directly in the Inspector.
* **`FiniteState_pTSAsset_State<TContext>`**:
  * Inherits from `pTSAsset` and implements `FiniteState_Base_State`.
  * Allows game designers to author states with exposed tuning parameters (e.g. `attackRange`, `patrolSpeed`, `cooldownDuration`, `animationName`).
* **`FiniteState_pTSAsset_LazyMachine`**:
  * Dynamic, enum-driven state machine.
  * Automatically resolves state implementations on demand, reducing upfront memory overhead for complex entity behavior trees.
* **`FiniteState_pTSAsset_IdSigner`**:
  * Asset maintaining a registered list of state string IDs, preventing magic strings across development teams.
* **`FiniteState_pTSAsset_Helper_Initer`**:
  * Utility helper providing automated initialization, event binding, and dependency injection between the scene node and the state asset.

---

## 4. Implementation Example

### Step 1: Define Character States
```typescript
import { _decorator } from 'cc';
import { FiniteState_pTSAsset_State } from 'db://pts-finite-state/scripts/pTSAsset/FiniteState.pTSAsset.State';
import { CharacterController } from './CharacterController';

const { ccclass, property } = _decorator;

@ccclass('IdleState')
export class IdleState extends FiniteState_pTSAsset_State<CharacterController> {
    @property({ tooltip: 'Name of the idle animation' })
    public animName: string = 'anim_idle';

    public onEnter(context: CharacterController): void {
        context.playAnimation(this.animName);
    }

    public onTick(dt: number, context: CharacterController): void {
        if (context.hasMovementInput()) {
            context.fsm.change({ id: 'MOVE', force: false });
        }
    }

    public onExit(context: CharacterController): void {}
}
```

### Step 2: Bind FSM to Character Component
```typescript
import { _decorator, Component } from 'cc';
import { FiniteState_pTSAsset_LazyMachine } from 'db://pts-finite-state/scripts/pTSAsset/FiniteState.pTSAsset.LazyMachine';

const { ccclass, property } = _decorator;

@ccclass('CharacterController')
export class CharacterController extends Component {
    @property({ type: FiniteState_pTSAsset_LazyMachine })
    public fsm: FiniteState_pTSAsset_LazyMachine = null;

    start() {
        this.fsm?.init(this);
    }

    update(dt: number) {
        this.fsm?.tick(dt);
    }

    public playAnimation(name: string) {
        // Trigger Cocos animation component...
    }

    public hasMovementInput(): boolean {
        return false; // Input check
    }
}
```

---

## 5. Integration with `pts-core` & `pts-asset`

* States and machines derive from `pTSAsset`, granting them deep `.clone()` capabilities, automated serialization, and custom inspector rendering.
* Can be validated via `pts-asset`'s drag-and-drop inheritance matcher so only compatible states can be attached to a given machine slot.

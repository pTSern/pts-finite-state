import { _decorator } from "cc";
import { FiniteState_Base_State } from "./FiniteState.Base.State";

const { ccclass } = _decorator

type _TState<_TContext> = FiniteState_Base_State<_TContext, any[], any[], any[]> | null

interface _IChangeOpt<_TId extends pFlex.TKey> {
    id: _TId
    force: boolean
}

@ccclass("FiniteState_Base_Machine")
export abstract class FiniteState_Base_Machine<
    _TId extends pFlex.TKey,
    _TContext,
> implements FiniteState_Base_Machine.I<_TId, _TContext> {
    get cid(): _TId | null { return this._cid! }

    protected _cid: _TId | null = null
    protected _isNoDuplicated: boolean = true
    protected _cstate: _TState<_TContext> = null;
    protected readonly _states: Map<_TId, _TState<_TContext>> = new Map();

    public get cstate() { return this._cstate }

    public add(id: _TId, state: _TState<_TContext>) {
        this._states.set(id, state);
        return this;
    }

    public remove(id: _TId, context?: _TContext, exits: any[] = []) {
        const state = this._states.get(id);
        if(!state) return false;

        if(this.cid === id) {
            if(context !== undefined) {
                state.exit(context, ...exits);
            }

            this._cid = null;
            this._cstate = null;
        }

        return this._states.delete(id);
    }

    public change<
        _TOnEnter extends _TState<_TContext> = _TState<_TContext>,
        _TOnExit extends _TState<_TContext> = _TState<_TContext>
    >(id: _TId | _IChangeOpt<_TId>, context: _TContext, enters: _TOnEnter[] = [] as any, exits: _TOnExit[] = [] as any) {
        const [_cid, _force]: [_TId, boolean] = typeof id === "object" ? [id.id, id.force] : [id, this._isNoDuplicated];
        const _next = this._states.get(_cid);

        if(!_next) return false;
        if(this._cid === _cid && !_force) return true;

        this._cstate?.exit(context, ...exits);
        this._cid = _cid;
        this._cstate = _next;
        this._cstate.enter(context, ...enters);

        return true;
    }

    tick(context: _TContext, dt: number, args: any[] = []) {
        this._cstate?.tick(context, dt, ...args);
    }

    later(context: _TContext, dt: number, args: any[] = []) {
        this._cstate?.later?.(context, dt, ...args);
    }
}

export namespace FiniteState_Base_Machine {
    export type TState<_TContext> = FiniteState_Base_State<_TContext, any[], any[], any[]> | null;

    export interface IChangeOpt<_TId extends pFlex.TKey> {
        id: _TId;
        force: boolean;
    }

    export interface I<_TId extends pFlex.TKey, _TContext> {
        readonly cid: _TId | null;
        readonly cstate: TState<_TContext>;
        add(id: _TId, state: TState<_TContext>): any;
        remove(id: _TId, context?: _TContext, exits?: any[]): boolean;
        change<
            _TOnEnter extends TState<_TContext> = TState<_TContext>,
            _TOnExit extends TState<_TContext> = TState<_TContext>
        >(id: _TId | IChangeOpt<_TId>, context: _TContext, enters?: _TOnEnter[], exits?: _TOnExit[]): boolean;
        tick(context: _TContext, dt: number, args?: any[]): void;
        later(context: _TContext, dt: number, args?: any[]): void;
    }

    export type Interface<_TId extends pFlex.TKey, _TContext> = I<_TId, _TContext>;
}

export namespace FiniteState_Base_Machine {
    export type TOptions<_TId extends pFlex.TKey> = _IChangeOpt<_TId>;
}

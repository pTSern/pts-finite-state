import { implement, pTSAsset } from "db://pts-core/scripts/utils"
import { FiniteState_Base_Machine } from "../Base/FiniteState.Base.Machine";
import { _decorator } from "cc";
import { editor_property } from "db://pts-core/scripts/utils/pClass";
import { FiniteState_pTSAsset_State } from "./FiniteState.pTSAsset.State";

const { ccclass, property } = _decorator;

type _TState<_TContext> = FiniteState_pTSAsset_State<_TContext>;
type _IChangeOpt<_TId extends pFlex.TKey> = FiniteState_Base_Machine.IChangeOpt<_TId>;

@implement(FiniteState_Base_Machine)
@ccclass("FiniteState_pTSAsset_Machine")
export class FiniteState_pTSAsset_Machine<
    _TId extends pFlex.TKey,
    _TContext
> extends pTSAsset
  implements FiniteState_Base_Machine.I<
    _TId,
    _TContext
> {
    get cid(): _TId | null {
        return this._cid;
    }

    @property({ visible: true })
    protected _cid: _TId | null = null;
    @property({ visible: true })
    protected _isNoDuplicated: boolean = true;
    @editor_property({ type: FiniteState_pTSAsset_State, visible: true })
    protected _cstate: _TState<_TContext> = null;
    protected readonly _states: Map<_TId, _TState<_TContext>> = new Map();

    public get cstate(): _TState<_TContext> {
        return this._cstate;
    }

    public add(id: _TId, state: _TState<_TContext>): this {
        this._states.set(id, state);
        return this;
    }

    public remove(id: _TId, context?: _TContext, exits: any[] = []): boolean {
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

    // @ts-ignore
    public change<
        _TOnEnter extends _TState<_TContext> = _TState<_TContext>,
        _TOnExit extends _TState<_TContext> = _TState<_TContext>
    >(id: _TId | _IChangeOpt<_TId>, context: _TContext, enters: _TOnEnter[] = [] as any, exits: _TOnExit[] = [] as any): boolean {
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

    tick(context: _TContext, dt: number, args: any[] = []): void {
        this._cstate?.tick(context, dt, ...args);
    }

    later(context: _TContext, dt: number, args: any[] = []): void {
        this._cstate?.later?.(context, dt, ...args);
    }
}


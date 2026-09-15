import { implement, pTSAsset } from "db://pts-core/scripts/utils";
import { FiniteState_Base_State } from "../Base/FiniteState.Base.State";
import { _decorator } from "cc";

const { ccclass } = _decorator;

@implement(FiniteState_Base_State)
@ccclass("FiniteState_pTSAsset_State")
export abstract class FiniteState_pTSAsset_State<
    _TContext,
    _TOnEnter extends unknown[] = any[],
    _TOnExit extends unknown[] = any[],
    _TOnTick extends unknown[] = any[]
> extends pTSAsset
  implements FiniteState_Base_State<
    _TContext,
    _TOnEnter,
    _TOnExit,
    _TOnTick
> {
    abstract enter(context: _TContext, ...args: _TOnEnter): void
    abstract exit(context: _TContext, ...args: _TOnExit): void
    abstract tick(context: _TContext, dt: number, ...args: _TOnTick): void
    later?(context: _TContext, dt: number, ...args: _TOnTick): void
}

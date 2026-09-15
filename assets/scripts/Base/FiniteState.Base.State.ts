import { _decorator } from "cc";

const { ccclass } = _decorator

@ccclass("FiniteState_Base_State")
export abstract class FiniteState_Base_State<
    _TContext,
    _TOnEnter extends unknown[] = any[],
    _TOnExit extends unknown[] = any[],
    _TOnTick extends unknown[] = any[]
> {
    abstract enter(context: _TContext, ...args: _TOnEnter): void
    abstract exit(context: _TContext, ...args: _TOnExit): void
    abstract tick(context: _TContext, dt: number, ...args: _TOnTick): void
    later?(context: _TContext, dt: number, ...args: _TOnTick): void
}

export namespace FiniteState_Base_State {
    export type TOnEnter<_TState extends FiniteState_Base_State<any, any[], any[]>> =
        _TState extends FiniteState_Base_State<any, infer _TEnterArgs, any[]> ? _TEnterArgs : any[];

    export type TOnExit<_TState extends FiniteState_Base_State<any, any[], any[]>> =
        _TState extends FiniteState_Base_State<any, any[], infer _TExitArgs> ? _TExitArgs : any[];
}

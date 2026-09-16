import { _decorator, CCClass } from "cc";
import { FiniteState_pTSAsset_Machine } from "./FiniteState.pTSAsset.Machine";
import { CC_IEnumList } from "db://pts-core/scripts/interfaces/cc/CC.IEnumable";
import { FiniteState_pTSAsset_IdSigner } from "./FiniteState.pTSAsset.IdSigner";
import { FiniteState_pTSAsset_Helper_Initer } from "./FiniteState.pTSAsset.Helper";

const { ccclass, property } = _decorator

@ccclass("FiniteState_pTSAsset_LazyMachine")
export class FiniteState_pTSAsset_LazyMachine<
    _TId extends pFlex.TKey,
    _TContext
> extends FiniteState_pTSAsset_Machine<_TId, _TContext> {
    protected static _ids: (string[] | readonly string[]) = [];

    @property({ type: FiniteState_pTSAsset_Helper_Initer })
    protected arrInitStates: FiniteState_pTSAsset_Helper_Initer[] = [];

    @property({ type: FiniteState_pTSAsset_IdSigner, visible() { console.log("THIS", this.constructor['_ids']); return !(this.constructor['_ids']?.length > 0) } })
    signer: FiniteState_pTSAsset_IdSigner = null;

    protected _onAwake(): void | Promise<void> {
        for(const init of this.arrInitStates) {
            this._states.set(init.id as _TId, init.state);
        }
        this.change(this._cid as _TId, null, [], []);
    }

    onFocusInEditor(): void {
        const list = this.constructor['_ids'] || ( this.signer?.list ?? [] );
        const elist = CC_IEnumList.generator(list);

        const [_type, _list] = elist.length > 0 ? ['Enum', elist] : ['String', []]

        CCClass.Attr.setClassAttr(this, '_cid', 'type', _type);
        CCClass.Attr.setClassAttr(this, '_cid', 'enumList', _list);

        for(const init of this.arrInitStates) {
            init.focus(_type, _list);
        }
    }
}

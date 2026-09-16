import { _decorator, CCClass, Enum } from "cc";
import { FiniteState_pTSAsset_State } from "./FiniteState.pTSAsset.State";
import { CC_IEnumList } from "db://pts-core/scripts/interfaces/cc/CC.IEnumable";

const { ccclass, property } = _decorator

@ccclass("FiniteState_pTSAsset_Helper_Initer")
export class FiniteState_pTSAsset_Helper_Initer {
    @property({ type: Enum({}) })
    id: string = '';

    @property({ type: FiniteState_pTSAsset_State })
    state: FiniteState_pTSAsset_State<any> = null;

    focus(type: string, list: CC_IEnumList<any, any>[]) {
        CCClass.Attr.setClassAttr(this, 'id', 'type', type);
        CCClass.Attr.setClassAttr(this, 'id', 'enumList', list);
    }
}

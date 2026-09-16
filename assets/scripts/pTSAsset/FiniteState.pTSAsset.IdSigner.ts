import { _decorator, CCString } from "cc";
import { pTSAsset } from "db://pts-core/scripts/utils";

const { ccclass, property } = _decorator

@ccclass("FiniteState_pTSAsset_IdSigner")
export class FiniteState_pTSAsset_IdSigner extends pTSAsset {
    @property({ type: [CCString] })
    list: string[] = []
}

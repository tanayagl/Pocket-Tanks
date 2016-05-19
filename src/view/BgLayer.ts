import GameHelper from '../helper/GameHelper';
import {res} from '../resource';

export default class BgLayer extends cc.Layer {
    backLayer: any;
    bgColor: any;
    constructor() {
        super();
        this.init();
    }
    
    init() {
        super.init();
        this.bgColor = new cc.LayerColor(GameHelper.hexToRgb("#3A5894"));
        this.backLayer = flax.assetsManager.createDisplay(res.tankwatch_plist, "bg");
        // this.backLayer.setScaleX(cc.winSize.width / this.backLayer.getContentSize().width);
        // this.backLayer.setScaleY(cc.winSize.height / this.backLayer.getContentSize().height);
        // this.backLayer.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        // this.backLayer.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(this.bgColor);
        // this.addChild(this.backLayer);
        return true;
    }
}
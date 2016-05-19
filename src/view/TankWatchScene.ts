import TankWatchLayer from './TankWatchLayer';
import BgLayer from './BgLayer';
export default class TankWatchScene extends cc.Scene {
    tankWatchLayer: cc.Layer = null;
    bgLayer: cc.Layer = null;
    constructor() {
        super();
        console.log('Inside TankWatchScene');
        this.bgLayer = new BgLayer();
        this.addChild(this.bgLayer);
        this.startGame();
    }

    startGame() {
        console.log('Start the game');
        this.tankWatchLayer = new TankWatchLayer();
        this.addChild(this.tankWatchLayer);
    }

}
import AudioHelper from './AudioHelper';

declare var AppConstants: any;
declare var platform: any;
declare var window: any;

export default class GameHelper {
    public static pausedActions: any;
    public static makeTTFFont(str, fntFile, color, fontSize, hAlignment?, vAlignment?, dimensions?) {
        if (arguments.length === 4) {
            hAlignment = fontSize;
            fontSize = color;
            color = fntFile;
            fntFile = AppConstants.MAIN_FONT;
        }
        var label = new cc.LabelTTF(str, fntFile, fontSize, dimensions, hAlignment, vAlignment);
        //change the color
        if (color != null)
            label.setColor(color);
        return label;
    }

    public static sendRecommendation(userData) {
        let xhrRequest = cc.loader.getXMLHttpRequest();
        xhrRequest.open("POST", "https://brainbuilder.herokuapp.com/recommendation/add");
        xhrRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhrRequest.setRequestHeader("Cache-Control", "no-cache");
        xhrRequest.setRequestHeader("Content-Type", "application/json");

        let progressProxy = platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).retrieveProxy(platform.model.ProgressProxy.NAME);
        let progressVO = progressProxy.getData();

        let currentUser = progressVO.currentUser;

        let object: any = {};
        object.contentId = userData.ID;
        object.userId = currentUser;
        object.userAge = userData.kidage;
        object.like = userData.like;
        object.type = userData.type;

        let args = JSON.stringify(object);
        cc.log("Log arguments " + args);
        xhrRequest.send(args);
    }
    public static hexToRgb(hex) {
        hex = hex.replace('#', '');
        let r, g, b, a;
        var color;
        if (hex.length == 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            color = cc.color(r, g, b);
        } else {
            a = parseInt(hex.substring(0, 2), 16);
            r = parseInt(hex.substring(2, 4), 16);
            g = parseInt(hex.substring(4, 6), 16);
            b = parseInt(hex.substring(6, 8), 16);
            color = cc.color(r, g, b, a);
        }

        return color;
    }
    public static deleteRecommendation(userData) {
        let xhrRequest = cc.loader.getXMLHttpRequest();
        xhrRequest.open("POST", "https://brainbuilder.herokuapp.com/recommendation/delete");
        xhrRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhrRequest.setRequestHeader("Cache-Control", "no-cache");
        xhrRequest.setRequestHeader("Content-Type", "application/json");
        let object: any = {};
        object.contentId = userData.ID;
        object.userAge = userData.kidage;

        let args = JSON.stringify(object);
        cc.log("Log arguments " + args);
        xhrRequest.send(args);
    }
    public static isScenePaused() {
        var currentScene = cc.director.getRunningScene();
        return currentScene['paused'];
    }
    public static pauseScene() {
        var currentScene = cc.director.getRunningScene();
        currentScene['paused'] = true;
        currentScene.pause();
        cc.eventManager.pauseTarget(currentScene, true);
        var pausedActions = cc.director.getActionManager().pauseAllRunningActions();
        if (pausedActions.length) {
            GameHelper.pausedActions = pausedActions;
        }
        //FIXME @nilesh Enable Scheduler pause for native
        //Use setTimeScale for schedulers
        //Need Modification in js-binding tools/tojs/cocos2dx.ini
        //Scheduler::[pause resume ^unschedule$ unscheduleUpdate unscheduleAllForTarget schedule isTargetPaused isScheduled pauseAllTargets],
        AudioHelper.pauseMusic();
    }
    public static resetCurrentScene() {
        var currentScene = cc.director.getRunningScene();
        currentScene.resume();

        if (GameHelper.pausedActions && GameHelper.pausedActions.length)
            cc.director.getActionManager().resumeTargets(GameHelper.pausedActions);

        delete currentScene['exitingGame'];
        //FIXME @nilesh Enable Schedular pause for native
        //Need Modification in js-binding tools/tojs/cocos2dx.ini
        //Scheduler::[pause resume ^unschedule$ unscheduleUpdate unscheduleAllForTarget schedule isTargetPaused isScheduled pauseAllTargets],

        cc.eventManager.resumeTarget(currentScene, true);
        delete currentScene['paused'];
    }
    public static resumeScene() {
        GameHelper.resetCurrentScene();
        AudioHelper.resumeMusic();
    }

    public static showTutorialScreen(gameData) {
        var currentScene = cc.director.getRunningScene();
        var gameLayer = currentScene['layer'];
        var hintButton = gameLayer.hintButton;

        if (!(gameLayer.tutorialScreen && gameLayer.tutorialScreen.parent)) {
            //adding the masking inside the tut1
            gameLayer.tutorialScreen = new cc.LayerColor(GameHelper.hexToRgb("#AA000000"));
            var clipper = new cc.ClippingNode();
            clipper.width = AppConstants.DEVICE_WIDTH;
            clipper.height = AppConstants.DEVICE_HEIGHT;
            clipper.setTag(1);

            var stencil = new cc.DrawNode();
            var rectangle = [cc.p(0, 0), cc.p(clipper.width, 0),
                cc.p(clipper.width, clipper.height),
                cc.p(0, clipper.height)];

            var white = cc.color(255, 255, 255, 255);
            stencil.drawPoly(rectangle, white, 1, white);
            clipper.stencil = stencil;

            var tutorialScreen = new window[gameData.zipName].mediator.layer.TutorialLayer(GameHelper.removeTutorial.bind(this));
            tutorialScreen.setContentSize(AppConstants.DEVICE_WIDTH, AppConstants.DEVICE_HEIGHT);
            cc.eventManager.resumeTarget(hintButton, true);

            clipper.addChild(tutorialScreen);
            gameLayer.tutorialScreen.addChild(clipper, 2);

            clipper.scaleX = 0;
            clipper.scaleY = 0;
            clipper.anchorX = 1;
            clipper.anchorY = 0;
            clipper.x = AppConstants.DEVICE_WIDTH - hintButton.width / 2 - 5;
            clipper.y = hintButton.height / 2 + 5;

            var scaleAction = cc.scaleTo(0.1, 0.9, 0.9);
            clipper.runAction(scaleAction);

            //adding tutorial screen
            gameLayer.addChild(gameLayer.tutorialScreen);
        } else {
            //remove the tutorial
            GameHelper.removeTutorial();
        }
    }

    public static removeTutorial() {
        var currentScene = cc.director.getRunningScene();
        var gameLayer = currentScene['layer'];

        var scaleAction = cc.scaleTo(0.1, 0, 0);
        var callFunction = cc.callFunc(GameHelper.removeTutorialLayer.bind(this), this);
        gameLayer.tutorialScreen.getChildByTag(1).runAction(cc.sequence([scaleAction, callFunction]));
    }

    public static removeTutorialLayer() {
        var currentScene = cc.director.getRunningScene();
        var gameLayer = currentScene['layer'];

        GameHelper.resumeScene();
        if (gameLayer.tutorialScreen) {
            gameLayer.removeChild(gameLayer.tutorialScreen);
            gameLayer.tutorialScreen = null;
        }
    }
}
import GameHelper from './GameHelper';
import EventHelper from './EventHelper';
import * as _ from 'lodash';

declare var AppConstants: any;
declare var res: any;

export default class TutorialLayer extends cc.Layer {
    slides: any;
    //whiteDot:any;
    current: number = 0;
    keyboardListener: any;
    transitionTime: number = 0.2;
    fullScale: number = 1;
    smallScale: number = 0;
    pointSize: number = 10;
    pointSizeOffset: number = 50;
    playButton: any;
    playText: any;
    _margin: number = 20;
    _positionFactor: number = 0.6;
    _gameData: any;
    _tutPrefix: any;
    _tutorialFinishedCallBack: any;
    slideContainer: any;
    bgColor: any;

    constructor(gameData, callBackFunction) {
        super();
        this.ctor();
        cc.log("Inside the constructor");

        //setting the gameData
        this._gameData = gameData;

        //storing the callback function
        this._tutorialFinishedCallBack = callBackFunction;

        //pause the game
        GameHelper.pauseScene();
    }

    prev() {
        if (this.current > 0) {
            var action = cc.moveBy(this.transitionTime, cc.p(AppConstants.DEVICE_WIDTH * this._positionFactor, 0)).easing(cc.easeOut(this.transitionTime));
            var actionScale = cc.scaleTo(this.transitionTime, this.fullScale).easing(cc.easeOut(this.transitionTime));
            var actionSmallScale = cc.scaleTo(this.transitionTime, this.smallScale).easing(cc.easeOut(this.transitionTime));
            var prevScale = cc.targetedAction(this.slides[this.current], actionSmallScale);
            var slide = cc.targetedAction(this.slideContainer, action);

            var gameDataPrefix = this._gameData.mcPrefix || "";

            //stop the last frame
            if (flax.assetsManager.getAssetType(this._gameData.spriteSheet, this._tutPrefix + (this.current + 1).toString() + gameDataPrefix)) {
                var tutAnim = this.slides[this.current];
                tutAnim.remote && tutAnim.remote.gotoAndStop(0);

                //playing animation inside the the clipper
                var clipperAnimation = this.slides[this.current].getChildByTag(0).getChildByTag(0);
                clipperAnimation.gotoAndStop(0);
            }

            //remove all the actions
            this.slides[this.current].stopAllActions();

            this.current -= 1;

            //remove all the actions
            this.slides[this.current].stopAllActions();

            //this.whiteDot.x -= this.pointSizeOffset;
            var currentScale = cc.targetedAction(this.slides[this.current], actionScale);
            this.slideContainer.runAction(cc.spawn([slide, prevScale, currentScale]));

            //play the current frame
            if (flax.assetsManager.getAssetType(this._gameData.spriteSheet, this._tutPrefix + (this.current + 1).toString() + gameDataPrefix)) {
                var tutAnim = this.slides[this.current].remote;
                //tutAnim && (tutAnim.autoPlayChildren = true);
                tutAnim && tutAnim.gotoAndPlay(0);

                //playing animation inside the the clipper
                var clipperAnimation = this.slides[this.current].getChildByTag(0).getChildByTag(0);
                //clipperAnimation.autoPlayChildren = true;
                clipperAnimation.gotoAndPlay(0);
            }
        }
    }

    handleMouseEvent(event, touch, action) {
        switch (action) {
            case EventHelper.ON_CLICK:
            case EventHelper.ON_SWIPE_LEFT:
                this.next();
                break;
            case EventHelper.ON_SWIPE_RIGHT:
                this.prev();
                break;
        }
        return true;
    }
    _onAnimationOver(sprite) {
        _.each(sprite.children, function (child) {
            child.stop && child.stop();
        });
    }
    handleKeyboard(event, keyCode, action) {
        if (action === EventHelper.ON_BEGAN) {
            switch (keyCode) {
                case cc.KEY.left:
                    this.prev();
                    break;
                case cc.KEY.enter:
                    this.startTheGame();
                    break;
                case cc.KEY.right:
                    this.next();
                    break;
            }
        }
        return true;
    }

    playClicked(event, touch, state) {
        if (state == EventHelper.ON_CLICK) {
            this.playButton.gotoAndStop(0);
            this.playText.setColor(GameHelper.hexToRgb("#FFFFFF"));
            this.startTheGame();
        } else if (state == EventHelper.ON_BEGAN) {
            this.playButton.gotoAndStop(1);
            this.playText.setColor(GameHelper.hexToRgb("#CCCCCC"));
        } else if (state == EventHelper.ON_END) {
            if (this.playButton && this.playText && this.playButton.parent && this.playText.parent) {
                this.playButton.gotoAndStop(0);
                this.playText.setColor(GameHelper.hexToRgb("#FFFFFF"));
            }
        } else if (state == EventHelper.ON_OUT) {
            this.playButton.gotoAndStop(0);
            this.playText.setColor(GameHelper.hexToRgb("#FFFFFF"));
        }
        return true;
    }

    startTheGame() {
        GameHelper.resumeScene();
        if (this.parent['startGame']) {
            this.parent['startGame']();
            this.parent.removeChild(this);
        } else {
            this._tutorialFinishedCallBack();
        }
    }

    onEnter() {
        super.onEnter();
        this.slides = [];

        //adding the background layer outside the tutorial
        var currentScene = cc.director.getRunningScene();
        this.bgColor = new cc.LayerColor(currentScene['getBGColor']());
        this.addChild(this.bgColor);

        //adding the tinted layer over the bg layer
        var tintedLayer = new cc.LayerColor(GameHelper.hexToRgb("#55000000"));
        this.addChild(tintedLayer);

        //initialize the variable
        this.slideContainer = new cc.Node();

        var buttonBackground = new cc.DrawNode();
        var dotBackgroundHeight = AppConstants.DEVICE_HEIGHT * 0.2;
        buttonBackground.setContentSize(cc.size(AppConstants.DEVICE_WIDTH, dotBackgroundHeight));
        buttonBackground.drawRect(cc.p(0, 0), cc.p(AppConstants.DEVICE_WIDTH, dotBackgroundHeight), GameHelper.hexToRgb("#091824"), 1, GameHelper.hexToRgb("#00000000"));
        this.addChild(buttonBackground, 1);

        var num = 1;

        //setting the this._tutPrefix
        this._tutPrefix = 'tutMobile';
        if (AppConstants.DEVICE_TYPE == AppConstants.TV_VERSION)
            this._tutPrefix = 'tut';

        var gameDataPrefix = this._gameData.mcPrefix || "";

        while (true) {
            if (flax.assetsManager.getAssetType(this._gameData.spriteSheet, this._tutPrefix + num + gameDataPrefix)) {
                var tut1 = flax.assetsManager.createDisplay(this._gameData.spriteSheet, this._tutPrefix + num + gameDataPrefix);
                tut1.onAnimationOver.add(this._onAnimationOver.bind(this), this);

                //adding the tutorial text here
                tut1.tutorialText.setFontName(AppConstants.MAIN_FONT);
                tut1.tutorialText.text = this._gameData.locale[this._tutPrefix + num + gameDataPrefix];
                tut1.tutorialText.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);

                var maxWidth = tut1.mainGame.background.width * tut1.mainGame.background.scaleX * tut1.mainGame.scaleX;
                var maxHeight = tut1.mainGame.background.height * tut1.mainGame.background.scaleY * tut1.mainGame.scaleY;

                var backWidth = tut1.mainGame.background.width * tut1.mainGame.background.scaleX;
                var backHeight = tut1.mainGame.background.height * tut1.mainGame.background.scaleY;
                var backNode = new cc.DrawNode();
                backNode.setContentSize(backWidth, backHeight);
                backNode.drawRect(cc.p(0, 0), cc.p(backWidth, backHeight), currentScene['getBGColor'](), 1, GameHelper.hexToRgb("#00000000"));
                backNode.x = tut1.mainGame.background.x;
                backNode.y = tut1.mainGame.background.y;
                backNode.anchorX = 0.5;
                backNode.anchorY = 0.5;
                tut1.mainGame.addChild(backNode, -1);

                //adding the masking inside the tut1
                var clipper = new cc.ClippingNode();
                clipper.width = maxWidth;
                clipper.height = maxHeight;
                clipper.x = tut1.mainGame.x;
                clipper.y = tut1.mainGame.y;
                clipper.anchorX = 0.5;
                clipper.anchorY = 0.5;

                var stencil = new cc.DrawNode();
                var rectangle = [cc.p(0, 0), cc.p(clipper.width, 0),
                    cc.p(clipper.width, clipper.height),
                    cc.p(0, clipper.height)];

                var white = cc.color(255, 255, 255, 255);
                stencil.drawPoly(rectangle, white, 1, white);
                clipper.stencil = stencil;

                //removing the main game from the tutorial
                var mainGame = tut1.mainGame;
                mainGame.x = clipper.width / 2;
                mainGame.y = clipper.height / 2;
                tut1.removeChild(tut1.mainGame);

                tut1.x = clipper.width / 2;
                tut1.y = clipper.height / 2;
                clipper.addChild(mainGame);
                mainGame.tag = 0;
                clipper.tag = 0;

                tut1.setScale(this.fullScale);

                //adding clipper inside the tut1
                tut1.addChild(clipper);

                this.slides.push(tut1);
            } else {
                break;
            }
            num++;
        }

        this.playButton = flax.assetsManager.createDisplay(res.shared.score_plist, "PlayButton");
        var btnText = res.shared.locale.next;
        if (this.slides.length == 1) {
            this.playButton = flax.assetsManager.createDisplay(res.shared.score_plist, "PlayGreen");
            btnText = res.shared.locale.play;
            EventHelper.addMouseTouchEvent(this.playClicked.bind(this), this.playButton);
        } else {
            EventHelper.addMouseTouchEvent(this.nextClicked.bind(this), this.playButton);
        }

        this.playButton.x = AppConstants.DEVICE_WIDTH / 2;
        this.playButton.y = dotBackgroundHeight / 2;
        this.playButton.anchorX = 0.5;
        this.playButton.anchorY = 0.5;

        this.addChild(this.playButton, 2);

        this.playText = GameHelper.makeTTFFont(btnText, GameHelper.hexToRgb("#FFFFFF"), 25, cc.TEXT_ALIGNMENT_CENTER);
        this.playText.y = this.playButton.y;
        this.playText.x = this.playButton.x;
        this.playText.anchorX = 0.5;
        this.playText.anchorY = 0.5;
        this.addChild(this.playText, 3);

        _.each(this.slides, function (slide, key: number) {
            slide.attr({
                x: AppConstants.DEVICE_WIDTH / 2,
                y: AppConstants.DEVICE_HEIGHT / 2 + dotBackgroundHeight
            });

            slide.x += (key * AppConstants.DEVICE_WIDTH * this._positionFactor);

            //setting the y position of tutorial
            if (AppConstants.DEVICE_TYPE == AppConstants.TV_VERSION)
                slide.y = AppConstants.DEVICE_HEIGHT / 2 + dotBackgroundHeight - 30;
            else if (AppConstants.DEVICE_TYPE == AppConstants.MOBILE_VERSION)
                slide.y = AppConstants.DEVICE_HEIGHT / 2 + dotBackgroundHeight / 2 + 30;

            slide.scale = this.smallScale;
            this.slideContainer.addChild(slide);
            //this.dotsContainer.addChild(this.newDot(key));

        }, this);

        this.addChild(this.slideContainer);
        this.slides[this.current].scale = this.fullScale;

        if (flax.assetsManager.getAssetType(this._gameData.spriteSheet, this._tutPrefix + (this.current + 1) + gameDataPrefix) == flax.ASSET_MOVIE_CLIP) {
            //get the movieClip
            var tutAnim = this.slides[this.current].remote;
            //tutAnim && (tutAnim.autoPlayChildren = true);
            tutAnim && tutAnim.gotoAndPlay(0);

            //playing animation inside the the clipper
            var clipperAnimation = this.slides[this.current].getChildByTag(0).getChildByTag(0);
            //clipperAnimation.autoPlayChildren = true;
            clipperAnimation.gotoAndPlay(0);
        }

        //Adding keyboard events
        EventHelper.addMouseTouchEvent(this.handleMouseEvent.bind(this), this);
        EventHelper.addKeyBoardEvent(this.handleKeyboard.bind(this), this);
    }

    nextClicked(event, touch, state) {
        if (state == EventHelper.ON_CLICK) {
            this.playButton.gotoAndStop(0);
            this.playText.setColor(GameHelper.hexToRgb("#FFFFFF"));
            this.next();
        } else if (state == EventHelper.ON_BEGAN) {
            this.playButton.gotoAndStop(1);
            this.playText.setColor(GameHelper.hexToRgb("#CCCCCC"));
        } else if (state == EventHelper.ON_END) {
            this.playButton.gotoAndStop(0);
            this.playText.setColor(GameHelper.hexToRgb("#FFFFFF"));
        } else if (state == EventHelper.ON_OUT) {
            this.playButton.gotoAndStop(0);
            this.playText.setColor(GameHelper.hexToRgb("#FFFFFF"));
        }
        return true;
    }

    next() {
        if ((this.current + 1) < this.slides.length) {
            var action = cc.moveBy(this.transitionTime, cc.p(-AppConstants.DEVICE_WIDTH * this._positionFactor, 0)).easing(cc.easeOut(this.transitionTime));
            var actionScale = cc.scaleTo(this.transitionTime, this.fullScale).easing(cc.easeOut(this.transitionTime));
            var actionSmallScale = cc.scaleTo(this.transitionTime, this.smallScale).easing(cc.easeOut(this.transitionTime));
            var prevScale = cc.targetedAction(this.slides[this.current], actionSmallScale);
            var slide = cc.targetedAction(this.slideContainer, action);

            var gameDataPrefix = this._gameData.mcPrefix || "";

            //stop the last frame
            if (flax.assetsManager.getAssetType(this._gameData.spriteSheet, this._tutPrefix + (this.current + 1) + gameDataPrefix) == flax.ASSET_MOVIE_CLIP) {
                var tutAnim = this.slides[this.current];
                tutAnim.remote && tutAnim.remote.gotoAndStop(0);

                //playing animation inside the the clipper
                var clipperAnimation = this.slides[this.current].getChildByTag(0).getChildByTag(0);
                clipperAnimation.gotoAndStop(0);
            }

            //remove all the actions
            this.slides[this.current].stopAllActions();

            this.current += 1;

            //remove all the actions
            this.slides[this.current].stopAllActions();

            var currentScale = cc.targetedAction(this.slides[this.current], actionScale);
            this.slideContainer.runAction(cc.spawn([slide, prevScale, currentScale]));
            //this.whiteDot.x += this.pointSizeOffset;

            //play the current frame
            if (flax.assetsManager.getAssetType(this._gameData.spriteSheet, this._tutPrefix + (this.current + 1) + gameDataPrefix) == flax.ASSET_MOVIE_CLIP) {
                var tutAnim = this.slides[this.current].remote;
                //tutAnim && (tutAnim.autoPlayChildren = true);
                tutAnim && tutAnim.gotoAndPlay(0);

                //playing animation inside the the clipper
                var clipperAnimation = this.slides[this.current].getChildByTag(0).getChildByTag(0);
                //clipperAnimation.autoPlayChildren = true;
                clipperAnimation.gotoAndPlay(0);
            }

            //change the play text
            if (this.current == this.slides.length - 1) {
                //removing the play button
                var playButtonX = this.playButton.x;
                var playButtonY = this.playButton.y;
                this.removeChild(this.playButton);

                //add the play button again
                this.playButton = flax.assetsManager.createDisplay(res.shared.score_plist, "PlayGreen");
                this.playButton.x = playButtonX;
                this.playButton.y = playButtonY;
                this.playButton.anchorX = 0.5;
                this.playButton.anchorY = 0.5;
                EventHelper.addMouseTouchEvent(this.playClicked.bind(this), this.playButton);
                this.addChild(this.playButton, 2);

                this.playText.setString(res.shared.locale.play);
            }

        }
    }
}
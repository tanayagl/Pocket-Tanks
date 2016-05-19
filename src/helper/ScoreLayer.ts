import GameHelper from './GameHelper';
import EventHelper from './EventHelper';
import PlatformBridge from './PlatformBridge';
import EmailHelper from './EmailHelper';


declare var res: any;
declare var AppConstants: any;
declare var platform: any;
/**
 * Created by Nilesh on 14/05/16.
 */
export default class ScoreLayer extends cc.Layer {
    _gameData: any;
    scoreCardText: any;
    backBtn: any;
    localScore: number = 0;
    scoreCard: any;
    highScoreBadge: any;
    finalScoreText: any;
    shareBtn: any;
    replayBtn: any;
    replayTxt: any;
    continueBtn: any;
    showHighScore: boolean = true;
    star: any;
    keyBoardListener: any;
    xPos: number = 0;
    _increaseScoreAction: any;
    _increaseScoreIndex: any;
    _iterator: number = 10;
    shareClickedListener: any;
    finalScoreNumber: any;
    shareTxt: any;
    continueTxt: any;

    constructor(gameData) {
        super();
        this._gameData = gameData;
        this.init();
    }

    init():boolean {
        var scoreText;

        if (this._gameData.star == 3)
            scoreText = res.shared.locale.greatJob;
        else if (this._gameData.star == 2)
            scoreText = res.shared.locale.niceJob;
        else
            scoreText = res.shared.locale.scoreCard;

        var dotBackground = new cc.DrawNode();
        var dotBackgroundHeight = AppConstants.DEVICE_HEIGHT * 0.2;
        dotBackground.setContentSize(cc.size(AppConstants.DEVICE_WIDTH, dotBackgroundHeight));
        dotBackground.drawRect(cc.p(0, 0), cc.p(AppConstants.DEVICE_WIDTH, dotBackgroundHeight), GameHelper.hexToRgb("#091824"), 1, GameHelper.hexToRgb("#00000000"));
        this.addChild(dotBackground);

        //making ttf text
        this.scoreCardText = GameHelper.makeTTFFont(scoreText, GameHelper.hexToRgb("#FFFFFF"), 45, cc.TEXT_ALIGNMENT_CENTER);
        this.scoreCardText.anchorX = 0.5;
        this.scoreCardText.anchorY = 0.5;
        this.scoreCardText.lineWidth = 1.5;

        this.scoreCardText.attr({
            x: AppConstants.DEVICE_WIDTH / 2,
            y: AppConstants.DEVICE_HEIGHT / 2,
            scaleX: 0,
            scaleY: 0
        });

        this.addChild(this.scoreCardText);

        //Adding Scorecard
        this.scoreCard = flax.assetsManager.createDisplay(res.shared.score_plist, "scoreBoard");
        this.scoreCard.attr({
            x: AppConstants.DEVICE_WIDTH / 2,
            y: AppConstants.DEVICE_HEIGHT / 2 - 25
        });
        this.addChild(this.scoreCard);
        if (this._gameData.highscore !== undefined && this._gameData.highscore > this._gameData.score || !this._gameData.score) {
            this.showHighScore = false;
        }

        if (this.showHighScore) {
            var HIGH_SCORE = HIGH_SCORE || false;
            if (!cc.sys.isNative && HIGH_SCORE) {
                var localStorage = cc.sys.localStorage;
                localStorage.setItem(HIGH_SCORE, this._gameData.score);
            }

            //Adding Scorecard
            this.highScoreBadge = flax.assetsManager.createDisplay(res.shared.score_plist, "NewHighScore");
            this.highScoreBadge.cascadeOpacity = true;

            //adding the text inside high score badge
            var newHighScoreText = GameHelper.makeTTFFont(res.shared.locale.newHighScore, AppConstants.MAIN_FONT, GameHelper.hexToRgb("#000000"), 23, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER, cc.size(this.highScoreBadge.width - 40, this.highScoreBadge.height / 2));
            this.highScoreBadge.addChild(newHighScoreText);
            newHighScoreText.x = this.highScoreBadge.width / 2;
            newHighScoreText.y = this.highScoreBadge.height / 2 + 30;
            newHighScoreText.rotation = -15;

            this.highScoreBadge.setScale(5);
            this.highScoreBadge.setOpacity(0);
            this.highScoreBadge.attr({
                x: AppConstants.DEVICE_WIDTH / 2 + this.scoreCard.width / 2,
                y: this.scoreCard.y + this.scoreCard.height / 2
            });
            this.addChild(this.highScoreBadge, 1);
        }

        this.finalScoreText = GameHelper.makeTTFFont(res.shared.locale.finalScore + ": ", GameHelper.hexToRgb("#FFFFFF"), 40, cc.TEXT_ALIGNMENT_CENTER);
        this.finalScoreText.attr({
            x: AppConstants.DEVICE_WIDTH / 2,
            y: AppConstants.DEVICE_HEIGHT / 2 + this.scoreCard.height / 2 + this.finalScoreText.height
        });

        this.addChild(this.finalScoreText);
        this.finalScoreText.scaleX = 0;
        this.finalScoreText.scaleY = 0;

        this.finalScoreNumber = GameHelper.makeTTFFont("0", GameHelper.hexToRgb("#FFFF00"), 40, cc.TEXT_ALIGNMENT_CENTER);
        this.finalScoreNumber.x = this.finalScoreText.x + this.finalScoreText.width / 2;
        this.finalScoreNumber.y = this.finalScoreText.y;
        this.finalScoreNumber.anchorX = 0;
        this.addChild(this.finalScoreNumber);
        this.finalScoreNumber.scaleX = 0;
        this.finalScoreNumber.scaleY = 0;

        //getting the array of value
        for (var i = 0; i < this._gameData.scoreLine.length; i++) {
            this.addScoreLine(this._gameData.scoreLine[i].name.toString(), (i + 1), this._gameData.scoreLine[i].value.toString());
        }

        //scaling scorecard to 0
        this.scoreCard.scaleX = 0;
        this.scoreCard.scaleY = 0;

        //Adding Replay Btn
        this.replayBtn = flax.assetsManager.createDisplay(res.shared.score_plist, "ReplayButton");
        this.replayBtn.anchorX = 0.5;
        this.replayBtn.anchorY = 0.5;
        this.replayBtn.x = AppConstants.DEVICE_WIDTH / 2;
        this.replayBtn.y = dotBackground.height / 2;

        this.replayTxt = GameHelper.makeTTFFont(res.shared.locale.replay, GameHelper.hexToRgb("#FFFFFF"), 35, cc.TEXT_ALIGNMENT_CENTER);
        this.replayTxt.x = this.replayBtn.width / 2;
        this.replayTxt.y = this.replayBtn.height / 2;
        this.replayBtn.addChild(this.replayTxt, 1);

        this.replayBtn.setScale(0);
        EventHelper.addMouseTouchEvent(this.replayClicked.bind(this), this.replayBtn);
        this.addChild(this.replayBtn);

        //Adding Share Btn
        this.shareBtn = flax.assetsManager.createDisplay(res.shared.score_plist, "shareBtn");
        this.shareBtn.anchorX = 0.5;
        this.shareBtn.anchorY = 0.5;
        this.shareBtn.attr({
            x: this.replayBtn.x - this.shareBtn.width - 30,
            y: dotBackground.height / 2
        });
        //adding share text inside share button
        this.shareTxt = GameHelper.makeTTFFont(res.shared.locale.share, GameHelper.hexToRgb("#FFFFFF"), 35, cc.TEXT_ALIGNMENT_CENTER);
        this.shareTxt.x = this.shareBtn.width / 2;
        this.shareTxt.y = this.shareBtn.height / 2;
        this.shareBtn.addChild(this.shareTxt, 1);

        this.shareBtn.setScale(0);

        if (!cc.sys.isNative) {
            this.shareBtn.visible = false;
            this.shareTxt.visible = false;
        }

        if (AppConstants.FINGERPRINT_VERSION) {
            this.replayBtn.x -= this.replayBtn.width / 2;
        } else {
            this.shareClickedListener = EventHelper.addMouseTouchEvent(this.shareClicked.bind(this), this.shareBtn);
            this.addChild(this.shareBtn);
        }


        if (AppConstants.DEVICE_TYPE == AppConstants.TV_VERSION)
            this.shareBtn.visible = false;

        //Adding Continue Btn
        this.continueBtn = flax.assetsManager.createDisplay(res.shared.score_plist, "continueBtn");
        this.continueBtn.anchorX = 0.5;
        this.continueBtn.anchorY = 0.5;
        this.continueBtn.attr({
            x: this.replayBtn.x + this.continueBtn.width + 30,
            y: dotBackground.height / 2
        });

        //adding continue text inside continue button
        this.continueTxt = GameHelper.makeTTFFont(res.shared.locale.continue, GameHelper.hexToRgb("#FFFFFF"), 35, cc.TEXT_ALIGNMENT_CENTER);
        this.continueTxt.x = this.continueBtn.width / 2;
        this.continueTxt.y = this.continueBtn.height / 2;
        this.continueBtn.addChild(this.continueTxt, 1);

        this.continueBtn.setScale(0);

        if (!cc.sys.isNative) {
            this.continueBtn.visible = false;
            this.continueTxt.visible = false;
        }

        EventHelper.addMouseTouchEvent(this.complete.bind(this), this.continueBtn);
        this.addChild(this.continueBtn);

        if (AppConstants.DEVICE_TYPE == AppConstants.TV_VERSION) {
            this.continueBtn.x = AppConstants.DEVICE_WIDTH / 2;
        }

        this.animateScoreBoard();

        //making the increase score interval
        this._increaseScoreIndex = this._gameData.score < this._iterator ? 1 : Math.floor(this._gameData.score / this._iterator);

        //function for starting the loop
        function makeRepeatLoop() {
            this._increaseScoreAction = cc.repeatForever(cc.sequence([cc.delayTime(0.04), cc.callFunc(this.scoreTextAnim.bind(this), this)]));
            this.runAction(this._increaseScoreAction);
        }

        //increasing the score with run action
        var delayAction = cc.delayTime(1.2);
        var callRepeatFunction = cc.callFunc(makeRepeatLoop.bind(this));
        this.runAction(cc.sequence([delayAction, callRepeatFunction]));

        //add keyboard event
        EventHelper.addKeyBoardEvent(this.keyBoardComplete.bind(this), this);
        return true;
    }

    keyBoardComplete(event, keyCode, state) {
        if (keyCode == cc.KEY.enter) {
            if (state == EventHelper.ON_BEGAN) {
                this.continueBtn.gotoAndStop(1);
            } else if (state == EventHelper.ON_END) {
                this.continueBtn.gotoAndStop(0);
                this._gameData.star = this._gameData.star;
                this._gameData.score = this._gameData.score;
                PlatformBridge.completed(this._gameData);
            }
        }
        return true;
    }

    complete(event, touch, state) {
        if (state == EventHelper.ON_CLICK) {
            this.continueBtn.gotoAndStop(0);
            this.continueTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
            PlatformBridge.completed(this._gameData);
        } else if (state == EventHelper.ON_BEGAN) {
            this.continueBtn.gotoAndStop(1);
            this.continueTxt.setColor(GameHelper.hexToRgb("#000000"));
        } else if (state == EventHelper.ON_END) {
            this.continueBtn.gotoAndStop(0);
            this.continueTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
        } else if (state == EventHelper.ON_OUT) {
            this.continueBtn.gotoAndStop(0);
            this.continueTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
        }
        return true;
    }

    replayClicked(event, touch, state) {
        if (state == EventHelper.ON_CLICK) {
            this.replayBtn.gotoAndStop(0);
            this.replayTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
            //change the event name to store data
            this._gameData.name = PlatformBridge.STORE_DATA;
            PlatformBridge.storeData(this._gameData);
            //change the event name to restart
            this._gameData.name = PlatformBridge.RESTART_EVENT;
            PlatformBridge.restart(this._gameData);
        } else if (state == EventHelper.ON_BEGAN) {
            this.replayBtn.gotoAndStop(1);
            this.replayTxt.setColor(GameHelper.hexToRgb("#000000"));
        } else if (state == EventHelper.ON_END) {
            this.replayBtn.gotoAndStop(0);
            this.replayTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
        } else if (state == EventHelper.ON_OUT) {
            this.replayBtn.gotoAndStop(0);
            this.replayTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
        }
        return true;
    }

    shareClicked(event, touch, state) {
        if (state == EventHelper.ON_CLICK) {
            this.shareBtn.gotoAndStop(0);
            this.shareTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
            //make the object of the score
            var data = this._gameData;
            var scoreObject: any = {};
            scoreObject.parent_email = data.parentemail;
            scoreObject.score = this._gameData.score;
            if (data.URL != undefined)
                scoreObject.gameLink = 'http://infiniteme-dev.s3-website-us-east-1.amazonaws.com/lwactivities/' + data.zipName;

            scoreObject.gameName = data.title;
            scoreObject.thumbURL = data.thumbURL;
            scoreObject.topic = data.topic;
            scoreObject.kidAge = data.kidage;
            scoreObject.kidName = data.kidname;

            var stringify = JSON.stringify(scoreObject);

            //call the share score method
            EmailHelper.gameScoreShare(stringify);
        } else if (state == EventHelper.ON_BEGAN) {
            this.shareBtn.gotoAndStop(1);
            this.shareTxt.setColor(GameHelper.hexToRgb("#000000"));
        } else if (state == EventHelper.ON_END) {
            this.shareBtn.gotoAndStop(0);
            this.shareTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
            this.showMessageSent();
        } else if (state == EventHelper.ON_OUT) {
            this.shareBtn.gotoAndStop(0);
            this.shareTxt.setColor(GameHelper.hexToRgb("#FFFFFF"));
        }
        return true;
    }

    showMessageSent() {
        EventHelper.removeEventListener(this.shareClickedListener);
        var opacity = 100;
        this.shareBtn.opacity = opacity;
        this.shareTxt.opacity = opacity;
        if (platform) {
            var runningScene = cc.director.getRunningScene();
            var popUp = new platform.mediator.view.Dialog({
                title: "Message Sent!",
                message: "Your score has been shared with your parent"
            });
            runningScene.addChild(popUp);
        }
    }

    addScoreLine(desc, lineNumber, data) {
        var totalLines = this._gameData.scoreLine.length;
        this["scoreLine" + lineNumber] = GameHelper.makeTTFFont(desc + ":  ", GameHelper.hexToRgb("#FFFFFF"), 30, cc.TEXT_ALIGNMENT_RIGHT);
        this["scoreLine" + lineNumber].anchorX = 1;
        this["scoreLine" + lineNumber].attr({
            x: this.xPos,
            y: this.scoreCard.height - (lineNumber * this.scoreCard.height / (totalLines + 1))
        });

        this["dataLine" + lineNumber] = GameHelper.makeTTFFont(data, GameHelper.hexToRgb("#FFFFFF"), 30, cc.TEXT_ALIGNMENT_LEFT);
        this["dataLine" + lineNumber].anchorX = 0;
        this["dataLine" + lineNumber].attr({
            x: this.xPos,
            y: this.scoreCard.height - (lineNumber * this.scoreCard.height / (totalLines + 1))
        });

        var currentXPos = this.scoreCard.width / 2 - this["dataLine" + lineNumber].width / 2 + this["scoreLine" + lineNumber].width / 2;
        if (currentXPos > this.xPos) {
            this.xPos = currentXPos;
            var currentLine = lineNumber;
            while (this["dataLine" + currentLine]) {
                this["dataLine" + currentLine].x = this.xPos;
                this["scoreLine" + currentLine].x = this.xPos;
                currentLine--;
            }
        }

        this.scoreCard.addChild(this["dataLine" + lineNumber]);
        this.scoreCard.addChild(this["scoreLine" + lineNumber]);
    }

    scoreTextAnim() {
        this.localScore += this._increaseScoreIndex;
        if (this.localScore >= this._gameData.score) {
            //removing the action from the node
            this.stopAction(this._increaseScoreAction);
            //setting the string for the localScore
            this.finalScoreNumber.setString(" " + this._gameData.score);
            return;
        }

        this.finalScoreNumber.setString(" " + this.localScore);
    }

    animateScoreBoard() {
        var time = 0.3;
        var scoreShow = cc.moveTo(time, cc.p(AppConstants.DEVICE_WIDTH / 2, AppConstants.DEVICE_HEIGHT - 3 * this.scoreCardText.height / 2)).easing(cc.easeBackOut());
        var btnScale = cc.scaleTo(time, 1).easing(cc.easeBackOut());
        var fadeOut = cc.fadeTo(time / 2, 255);

        var scoreScale = cc.targetedAction(this.scoreCardText, btnScale.clone());
        var scaleScoreCard = cc.targetedAction(this.scoreCardText, btnScale.clone());
        var scoreTextShow = cc.targetedAction(this.scoreCardText, scoreShow);
        var scoreCardAction = cc.sequence([scoreScale, scoreTextShow]);
        var scoreCardScale = cc.targetedAction(this.scoreCard, btnScale.clone());
        var finalScoreText = cc.targetedAction(this.finalScoreText, btnScale.clone());
        var finalScoreNumber = cc.targetedAction(this.finalScoreNumber, btnScale.clone());
        var shareBtnAnim = cc.targetedAction(this.shareBtn, btnScale.clone());
        var continueAnim = cc.targetedAction(this.continueBtn, btnScale.clone());
        var replayAnim = cc.targetedAction(this.replayBtn, btnScale.clone());


        if (this.showHighScore) {
            var highScoreBadgeAnim = cc.targetedAction(this.highScoreBadge, btnScale.clone());
            var highScoreBadgeShow = cc.targetedAction(this.highScoreBadge, fadeOut.clone());
            this.scoreCardText.runAction(cc.sequence([scoreCardAction, scaleScoreCard, cc.spawn([scoreCardScale, finalScoreText, finalScoreNumber]), cc.spawn([shareBtnAnim, continueAnim, replayAnim]), cc.spawn([highScoreBadgeAnim, highScoreBadgeShow])]));
        } else {
            this.scoreCardText.runAction(cc.sequence([scoreCardAction, scaleScoreCard, cc.spawn([scoreCardScale, finalScoreText, finalScoreNumber]), cc.spawn([shareBtnAnim, continueAnim, replayAnim])]));
        }
    }

    onExit() {
        super.onExit();
    }
}
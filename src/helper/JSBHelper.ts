import EventHelper from './EventHelper';
import * as moment from 'moment';
import {each} from 'lodash';
declare var platform: any;
declare var currencyMap: any;
declare var AppConstants: any;

export default class JSBHelper {
    public static NAME = "HELPER_JSB_HELPER";
    public static ASSET_DOWNLOADED = "HELPER_ASSET_DOWNLOADED";
    public static ZIP_DOWNLOADED = "HELPER_ZIP_DOWNLOADED";
    public static BOOK_BACK_PRESSED = "HELPER_BOOK_BACK_PRESSED";
    public static MUSIC_BACK_PRESSED = "HELPER_MUSIC_BACK_PRESSED";
    public static GAME_BACK_PRESSED = "HELPER_GAME_BACK_PRESSED";
    public static WEB_ACTIVITY_BACK_PRESSED = "HELPER_WEB_ACTIVITY_BACK_PRESSED";

    public static startAssetDownload(assetURL, folderName, assetName) {
        //call the jsb function for downloading image
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downloadAsset", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", assetURL, folderName, assetName);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "downloadAssetWithURL:folderName:assetName:", assetURL, folderName, assetName);
        }
    };

    public static assetDownloaded(message, assetURL) {
        //send callback when image is downloaded
        var object = {
            message: message,
            url: assetURL
        };
        //dispatch notification for receiving asset
        platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).sendNotification(JSBHelper.ASSET_DOWNLOADED, object);
    };

    public static extractOfflineBundle(cb) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "extractOfflineBundle", "()V");
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "extractOfflineBundle");
        } else if (!cc.sys.isNative) {
            cc.log('In JSBHelper: extractOfflineBundle');
        }
    };

    public static extractOfflineBundleCB(message) {
        cc.log('extractOfflineBundleCB', message);
        EventHelper.dispatchCustomEvent(platform.mediator.scene.LoaderView.EXTRACTCOMPLETED, message);
    };

    public static playVideo(stringData) {
        //starting the youtube video
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startYouTubeVideo", "(Ljava/lang/String;)V", stringData);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "LoadWebViewWithData:", stringData);
        } else if (!cc.sys.isNative) {
            var data = JSON.parse(stringData);
            window.open('https://www.youtube.com/embed/' + data.videoID + '?autoplay=1&controls=1&rel=0&showinfo=0&enablejsapi=1', '_blank');
        }
    };

    public static playMusic(stringData) {
        //starting the music
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startMusicPlayer", "(Ljava/lang/String;)V", stringData);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "Log:", "playMusic");
        }
    };

    public static musicBackPressed(stringData) {
        var object = JSON.parse(stringData);

        //dispatch notification for receiving music
        platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).sendNotification(JSBHelper.MUSIC_BACK_PRESSED, object);
    };

    public static videoBackPressed(stringData) {
        cc.log("Video Back Pressed");

        var object = JSON.parse(decodeURIComponent(stringData));

        //dispatch notification for receiving image
        platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).sendNotification(JSBHelper.WEB_ACTIVITY_BACK_PRESSED, object);
    };

    public static bookBackPressed(stringData) {
        cc.log("Book back pressed");
        var object = JSON.parse(stringData);
        //dispatch notification for receiving image
        platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).sendNotification(JSBHelper.WEB_ACTIVITY_BACK_PRESSED, object);
    };

    public static gameBackPressed(stringData) {
        cc.log("Game back pressed");
        var object = JSON.parse(stringData);
        //dispatch notification for receiving image
        platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).sendNotification(JSBHelper.WEB_ACTIVITY_BACK_PRESSED, object);
    };

    public static startDownloadingAndExtractingZip(zipURL, folderName, zipName) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downloadZipAndExtract", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", zipURL, folderName, zipName);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "downloadZipWithURL:folderName:assetName:", zipURL, folderName, zipName);
        }
    };

    public static zipDownloadingAndExtractingComplete(message, zipURL) {
        var object = {
            message: message,
            url: zipURL
        };

        cc.log("Zip Download and Extract Complete");

        //dispatch notification for receiving image
        platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).sendNotification(JSBHelper.ZIP_DOWNLOADED, object);
    };

    public static playWebGame(stringObject) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "playGame", "(Ljava/lang/String;)V", stringObject);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "LoadWebViewWithData:", stringObject);
        } else if (!cc.sys.isNative) {
            var data = JSON.parse(stringObject);
            window.open('http://www.playpowerlabs.org/lwactivities/' + data.zipName, '_blank');
        }

    };

    public static playVideoOffline(stringData) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "videoPlayer", "(Ljava/lang/String;)V", stringData);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "Log:", "playVideo");
        } else if (!cc.sys.isNative) {
            var data = JSON.parse(decodeURIComponent(stringData));
            if (data.videoID)
                window.open('https://www.youtube.com/embed/' + data.videoID + '?autoplay=1&controls=1&rel=0&showinfo=0&enablejsapi=1', '_blank');
            else
                window.open(data.serverPrefix + data.filepath);
        }
    };

    public static startBook(stringObject) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openBook", "(Ljava/lang/String;)V", stringObject);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "LoadWebViewWithData:", stringObject);
        } else if (!cc.sys.isNative) {
            var data = JSON.parse(stringObject);
            window.open(data.URL, '_blank');
        }
    };

    public static viewSource(sourceUrl) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openUrl", "(Ljava/lang/String;)V", sourceUrl);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "LoadSourceWithURL:", sourceUrl);
        }
    };

    public static TTS(sentence) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "TTS", "(Ljava/lang/String;)V", sentence);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "TTSWithString:", sentence);
        }
    };

    public static analyticsSetUserDetail() {
        //retriving the levelVO data
        var _progressProxy = platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).retrieveProxy(platform.model.ProgressProxy.NAME);
        var _progressVO = _progressProxy.getData();

        var userVO = _progressVO.userVOObject;
        var commonUserVO = _progressVO.commonUserData;

        var analyticUserID = _progressVO.currentUser;
        var analyticUserDetail: any = {};
        analyticUserDetail.name = userVO[analyticUserID][platform.LocalStorageConstants.CHILD_NAME];
        analyticUserDetail.age = userVO[analyticUserID][platform.LocalStorageConstants.CHILD_AGE];
        analyticUserDetail.gender = userVO[analyticUserID][platform.LocalStorageConstants.CHILD_GENDER];
        analyticUserDetail.avatar = userVO[analyticUserID][platform.LocalStorageConstants.CHILD_PROFILE_PIC];

        if (commonUserVO[platform.LocalStorageConstants.PARENT_EMAIL])
            analyticUserDetail.email = commonUserVO[platform.LocalStorageConstants.PARENT_EMAIL];

        if (AppConstants.FINGERPRINT_VERSION)
            analyticUserDetail.FINGERPRINT_VERSION = AppConstants.FINGERPRINT_VERSION;
        if (AppConstants.PREMIUM_USER)
            analyticUserDetail.PREMIUM_USER = AppConstants.PREMIUM_USER;

        analyticUserDetail.subscriptionType = commonUserVO[platform.LocalStorageConstants.PURCHASE_TYPE];
        analyticUserDetail.autoRenew = commonUserVO[platform.LocalStorageConstants.PURCHASE_AUTO_RENEW];
        analyticUserDetail.trialUsed = commonUserVO[platform.LocalStorageConstants.TRIAL_USED] || false;
        var premiumValidTill = commonUserVO[platform.LocalStorageConstants.PREMIUM_USER_EXPIRES_IN];
        if (premiumValidTill) {
            premiumValidTill = moment(premiumValidTill);
            analyticUserDetail.premiumValidTill = premiumValidTill ? premiumValidTill.calendar() : undefined;
        }

        var platformStatistics = platform.LocalStorageConstants.PLATFORM_STATISTICS;
        //Adding Platform Details
        if (userVO[analyticUserID][platformStatistics]) {
            each(userVO[analyticUserID][platformStatistics], function (value, key) {
                if (key === 'totalTime' || key === 'avgTime') {
                    value /= (60 * 1000);
                    value = Math.round(value) + ' mins';
                }
                analyticUserDetail['platform_' + key] = value;
            });
        }

        // cc.warn('analyticUserDetail', analyticUserDetail);
        //convert analyticUserDetail to string
        var analyticStringUserDetail = JSON.stringify(analyticUserDetail);

        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppAnalytics", "setUserDetail", "(Ljava/lang/String;Ljava/lang/String;)V", analyticUserID, analyticStringUserDetail);
        } else if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "trackUserWithId:eventProperties:", analyticUserID, analyticStringUserDetail);
        }

    };

    public static analyticsSetScreen(screenCategory, screenName, properties) {
        if (screenName == undefined)
            screenName = screenCategory;
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppAnalytics", "trackScreen", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", screenCategory, screenName, properties);
        } else if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "trackScreenWithCategory:screenName:eventProperties:", screenCategory, screenName, properties);
        }
    };

    public static analyticsLogEvent(eventName, eventProperties) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppAnalytics", "trackAction", "(Ljava/lang/String;Ljava/lang/String;)V", eventName, eventProperties);
        } else if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "trackEventWithName:eventProperties:", eventName, eventProperties);
        }
    };

    public static analyticsTrackRevenue(item, price, sku) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppAnalytics", "trackRevenue", "(Ljava/lang/String;D;Ljava/lang/String;)V", item, price, sku);
        } else if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "trackRevenueWithItem:price:sku:", item, price, sku);
        }
    };

    public static getExternalStoragePath() {
        var storagePath = "";
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            storagePath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getExternalPath", "()Ljava/lang/String;");
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            storagePath = jsb.reflection.callStaticMethod("JSBHelper", "getExternalPath");
        }

        return storagePath;
    };
    //For TV Version;
    public static getServerPath() {
        var serverPath = "https://s3-us-west-2.amazonaws.com/brainbuilerapk/";
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            serverPath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getServerPath", "()Ljava/lang/String;");
        }
        return serverPath;
    };

    public static checkDirectoryExists(directoryPath) {
        if (cc.sys.isNative) {
            if (jsb.fileUtils.isDirectoryExist(directoryPath) == true) {
                return true;
            } else {
                return false;
            }
        }
    };
    public static openWebLink(url) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openWebLink", "(Ljava/lang/String;)V", url);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "openWebLink:", url);
        }
    };

    public static shareMessage(message) {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareMessage", "(Ljava/lang/String;)V", message);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "shareMessage");
        }
    };
    public static exitApp() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exitApp", "()V");
        }
    };
    public static saveLoaderUserData() {
        var currentScene = cc.director.getRunningScene();
        if (currentScene && currentScene['NAME'] == 'LoaderView') {
            var progressProxy = platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).retrieveProxy(platform.model.ProgressProxy.NAME);
            progressProxy.saveUserVOData();
        }
    };
    public static checkFileExists(filePath) {
        if (cc.sys.isNative) {
            if (jsb.fileUtils.isFileExist(filePath) == true) {
                return true;
            } else {
                return false;
            }
        }
    };

    public static startInAppPurchase() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showPurchaseBox", "()V");
        }
    };

    public static startInAppTrial() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showTrialBox", "()V");
        } else {
            EventHelper.dispatchCustomEvent(platform.mediator.scene.OnBoardingView.InAppPurchaseCompleted, "trial");
        }
    };

    public static initializeIAP() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initializeIAP", "()V");
        }
    };

    public static isExpired() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.log("Calling isExpired Function");
            var trialStatus = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isExpired", "()Z");
            cc.log("Getting return value");
            var storageString = "trial";
            if (!trialStatus)
                storageString = "purchased";

            EventHelper.dispatchCustomEvent(platform.mediator.scene.SplashScreen.EXPIRE_STATUS, storageString);
        } else {
            EventHelper.dispatchCustomEvent(platform.mediator.scene.SplashScreen.EXPIRE_STATUS, "purchased");
        }
    };
    public static makeBBPurchase(type) {
        if (AppConstants.FINGERPRINT_VERSION)
            return;
        //Type = "monthly" or "yearly"
        if (type === platform.LocalStorageConstants.PURCHASE_TYPE_YEARLY) {
            type = 'yearly';
        } else {
            type = 'monthly';
        }

        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "purchase", "(Ljava/lang/String;)V", type);
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "purchaseWithType:", type);
        } else {
            cc.log('Calling makeBBPurchase from cocos');
        }
    };
    public static ReactTest() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ReactTest", "()V");
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            cc.log('Calling React Test from cocos');
            jsb.reflection.callStaticMethod("JSBHelper", "ReactTest");
        }
    };

    public static setConnected(isConnected) {
        AppConstants.NETWORK_AVAILABLE = isConnected == "true" ? true : false;
    };

    public static isConnected() {
        return AppConstants.NETWORK_AVAILABLE;
    };

    public static requestIAPProduct() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            // jsb.reflection.callStaticMethod("com/playpower/bb/Connectivity", "isConnected", "()Z");
        } else if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "requestIAPProduct");
        }
    };
    public static setPrice(type, price, currency) {
        var progressProxy = platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).retrieveProxy(platform.model.ProgressProxy.NAME);
        var progressVO = progressProxy.getData();
        var commonUserVO = progressVO.commonUserData;
        if (type === 'monthly')
            commonUserVO[platform.LocalStorageConstants.MONTHLY_PRICE] = +price;
        else if (type === 'yearly')
            commonUserVO[platform.LocalStorageConstants.YEARLY_PRICE] = +price;
        if (currency)
            commonUserVO[platform.LocalStorageConstants.CURRENCY] = currencyMap[currency] || currency;
        progressProxy.saveUserVOData();
    };
    public static purchaseComplete(param) {
        //storing the data inside the local storage
        var localStorage = cc.sys.localStorage;
        if (AppConstants.DEVICE_TYPE === AppConstants.TV_VERSION) {
            var jsonDataKey = platform.LocalStorageConstants.TV_PURCHASED;
            localStorage.setItem(jsonDataKey, param);

            //changing the purchased constant
            EventHelper.dispatchCustomEvent(platform.mediator.scene.OnBoardingView.InAppPurchaseCompleted, param);
        } else if (AppConstants.DEVICE_TYPE === AppConstants.MOBILE_VERSION) {
            var progressProxy = platform.ApplicationFacade.getInstance(platform.ApplicationFacade.NAME).retrieveProxy(platform.model.ProgressProxy.NAME);
            var progressVO = progressProxy.getData();
            var commonUserVO = progressVO.commonUserData;
            cc.log('IAP purchaseComplete: ' + param);
            commonUserVO[platform.LocalStorageConstants.PURCHASE_AUTO_RENEW] = false;
            commonUserVO[platform.LocalStorageConstants.PURCHASE_TYPE] = undefined;
            if (param) {
                var purchaseObj = JSON.parse(param);
                commonUserVO[platform.LocalStorageConstants.PURCHASE_AUTO_RENEW] = false;
                if (purchaseObj) {
                    if (purchaseObj.autoRenewing) {
                        commonUserVO[platform.LocalStorageConstants.PURCHASE_AUTO_RENEW] = true;
                    }
                    var purchaseTime = purchaseObj.purchaseTime;
                    cc.log("PurchaseTime: " + purchaseTime);
                    cc.log("Purchase autoRenewing: " + purchaseObj.autoRenewing);
                    var type = "";
                    type = !purchaseObj.productId.search('month') ? platform.LocalStorageConstants.PURCHASE_TYPE_MONTHLY : type;
                    type = !purchaseObj.productId.search('year') ? platform.LocalStorageConstants.PURCHASE_TYPE_YEARLY : type;
                    commonUserVO[platform.LocalStorageConstants.PURCHASE_TYPE] = type;
                    if (type == platform.LocalStorageConstants.PURCHASE_TYPE_MONTHLY) {
                        AppConstants.PREMIUM_USER = true;
                        commonUserVO[platform.LocalStorageConstants.PREMIUM_USER_EXPIRES_IN] = moment(purchaseTime).add(30, 'day').unix() * 1000;
                    } else if (type == platform.LocalStorageConstants.PURCHASE_TYPE_YEARLY) {
                        AppConstants.PREMIUM_USER = true;
                        commonUserVO[platform.LocalStorageConstants.PREMIUM_USER_EXPIRES_IN] = moment(purchaseTime).add(365, 'day').unix() * 1000;
                    }
                    if (AppConstants.PREMIUM_USER) {
                        commonUserVO[platform.LocalStorageConstants.TRIAL_USED] = true;
                    }
                }
            }

            progressProxy.saveUserVOData();
            EventHelper.dispatchCustomEvent(platform.mediator.scene.OnBoardingView.InAppPurchaseCompleted);
        }
    };

    public static downloadInformation(jsonString) {
        EventHelper.dispatchCustomEvent(platform.mediator.scene.LoaderView.GET_PROGRESS, jsonString);
    };

    public static stopSendingDownloadedInformation() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopTimer", "()V");
        } else if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("JSBHelper", "stopTimer");
        }
    }
}
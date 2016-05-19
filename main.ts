
global['customPolyfill'] = global['customPolyfill'] || {};

import GameScene from './src/app';
import {g_resources} from './src/resource';
import AppConstants, {clearAppConstants} from './src/AppConstants';

if (process.env.NODE_ENV === 'production') {
    require('./src/overrider');
}
cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    clearAppConstants();
    var frameSize = cc.view.getFrameSize();
    AppConstants.SCREEN_WIDTH = frameSize.width;
    AppConstants.SCREEN_HEIGHT = frameSize.height;

    //Debugging
    //cc.SPRITE_DEBUG_DRAW = 2;
    //cc.SPRITEBATCHNODE_DEBUG_DRAW = 2;
    //cc.LABELBMFONT_DEBUG_DRAW = 2;
    //cc.LABELATLAS_DEBUG_DRAW = 2;

    //set the content scale factor
    if (AppConstants.SCREEN_WIDTH <= 1024) {
        AppConstants.CONTENT_SCALE_FACTOR = 1;
        AppConstants.RESOURCE_FOLDER = "ldpi";
    } else {
        AppConstants.CONTENT_SCALE_FACTOR = 2;
        AppConstants.RESOURCE_FOLDER = "mdpi";
    }

    //set hardcoded content scale factor
    //AppConstants.CONTENT_SCALE_FACTOR = 2;
    //AppConstants.RESOURCE_FOLDER = "mdpi";

    //AppConstants.APP_LANGUAGE = "zh";
    AppConstants.APP_LANGUAGE = "en";

    //code for changing the content scale factor according to the frame width
    cc.director.setContentScaleFactor(AppConstants.CONTENT_SCALE_FACTOR);

    //ratio for setting the design resolution
    var screenRatio = AppConstants.SCREEN_WIDTH / AppConstants.SCREEN_HEIGHT;
    var originalDesignRatio = AppConstants.ORIGINAL_DEVICE_HEIGHT / AppConstants.ORIGINAL_DEVICE_HEIGHT;

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    var resolutionPolicy;
    if (screenRatio > originalDesignRatio) {
        resolutionPolicy = cc.ResolutionPolicy.FIXED_HEIGHT;
        cc.view.setDesignResolutionSize(AppConstants.ORIGINAL_DEVICE_WIDTH, AppConstants.ORIGINAL_DEVICE_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);
    } else {
        resolutionPolicy = cc.ResolutionPolicy.FIXED_WIDTH;
        cc.view.setDesignResolutionSize(AppConstants.ORIGINAL_DEVICE_WIDTH, AppConstants.ORIGINAL_DEVICE_HEIGHT, cc.ResolutionPolicy.FIXED_WIDTH);
    }
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);

    var windowSize = cc.director.getWinSize();

    //storing the window size
    AppConstants.DEVICE_WIDTH = windowSize.width;
    AppConstants.DEVICE_HEIGHT = windowSize.height;

    //Init Flax
    flax.init(resolutionPolicy);


    // //Load Global Resource
    // res.shared = {
    //     mainFont: "res/shared/" + AppConstants.RESOURCE_FOLDER + "/Calibri.fnt",
    //     mainFont_png: "res/shared/" + AppConstants.RESOURCE_FOLDER + "/Calibri.png",
    //     score_png: "res/shared/" + AppConstants.RESOURCE_FOLDER + "/score.png",
    //     score_plist: "res/shared/" + AppConstants.RESOURCE_FOLDER + "/score.plist"
    // };

    // res.g_sharedResource = [];
    // for (var i in res.shared) {
    //     res.g_sharedResource.push(res.shared[i]);
    // }

    // res.shared.locale = {
    //     en: "res/shared/locale/en.json",
    //     zh: "res/shared/locale/zh.json"
    // };

    // //AppConstants.DEVICE_TYPE = AppConstants.TV_VERSION;
    // AppConstants.DEVICE_TYPE = AppConstants.MOBILE_VERSION;

    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new GameScene());
    }, this);
};
cc.game.run();
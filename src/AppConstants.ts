export default class AppConstants {
    public static GAME_NAME;
    public static ORIGINAL_DEVICE_WIDTH;
    public static ORIGINAL_DEVICE_HEIGHT;
    public static DEVICE_WIDTH;
    public static DEVICE_HEIGHT;
    public static SCREEN_WIDTH;
    public static SCREEN_HEIGHT;
    public static FRAME_RATE;
    public static APP_LANGUAGE;
    public static CONTENT_SCALE_FACTOR;
    public static RESOURCE_FOLDER;
    public static DEVICE_TYPE;
    public static TV_VERSION;
    public static MAIN_FONT;
    public static FONT_SMALL;
    public static FONT_NORMAL;
    public static FONT_LARGE;
}

export function clearAppConstants(): void {
    AppConstants.GAME_NAME = "tankWatch";
    AppConstants.ORIGINAL_DEVICE_WIDTH = 1024;
    AppConstants.ORIGINAL_DEVICE_HEIGHT = 768;
    AppConstants.DEVICE_WIDTH = null;
    AppConstants.DEVICE_HEIGHT = null;
    AppConstants.SCREEN_WIDTH = null;
    AppConstants.SCREEN_HEIGHT = null;
    AppConstants.FRAME_RATE = 60;
    AppConstants.APP_LANGUAGE = null;
    AppConstants.CONTENT_SCALE_FACTOR = null;
    AppConstants.RESOURCE_FOLDER = null;
    AppConstants.DEVICE_TYPE = null;
    AppConstants.TV_VERSION = "tv";
    AppConstants.MAIN_FONT = "Avenir Next";
    AppConstants.FONT_SMALL = 20;
    AppConstants.FONT_NORMAL = 24;
    AppConstants.FONT_LARGE = 30;
}

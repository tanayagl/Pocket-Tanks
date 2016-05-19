import EventHelper from './EventHelper';

export default class PlatformBridge {
    public static NAME = "PlatformBridge";
    public static LOADED_EVENT = 'loaded';
    public static BACK_EVENT = 'back';
    public static COMPLETED_EVENT = 'completed';
    public static RESTART_EVENT = 'restart';
    public static STORE_DATA = 'storeData';
    public static CALLBACK_DISPATCHER_NAME = 'callbackEventName';

    public static checkBrigde(data) {
        if (data === undefined) {
            cc.log('ERROR: data is not assigned');
            return false;
        }
        if (data[PlatformBridge.CALLBACK_DISPATCHER_NAME] === undefined) {
            cc.log('ERROR: custom callback dispatcher is undefined');
            return false;
        }
        return true;
    }
    public static back(data) {
        if (PlatformBridge.checkBrigde(data)) {
            data.name = PlatformBridge.BACK_EVENT;
            EventHelper.dispatchCustomEvent(data[PlatformBridge.CALLBACK_DISPATCHER_NAME], data);
        }
    }
    public static loaded(data) {
        if (PlatformBridge.checkBrigde(data)) {
            data.name = PlatformBridge.LOADED_EVENT;
            EventHelper.dispatchCustomEvent(data[PlatformBridge.CALLBACK_DISPATCHER_NAME], data);
        }
    }

    public static restart(data) {
        if (PlatformBridge.checkBrigde(data)) {
            //cc.director.popScene();
            data.name = PlatformBridge.RESTART_EVENT;
            EventHelper.dispatchCustomEvent(data[PlatformBridge.CALLBACK_DISPATCHER_NAME], data);
        }
    }

    public static completed(data) {
        if (PlatformBridge.checkBrigde(data)) {
            data.name = PlatformBridge.COMPLETED_EVENT;
            if (data['star'] === undefined) {
                cc.log('ERROR: set star before sending completed');
                return;
            }
            if (data['type'] === 'Games' && data['score'] === undefined) {
                cc.log('ERROR: set score for games before sending completed');
                return;
            }
            EventHelper.dispatchCustomEvent(data[PlatformBridge.CALLBACK_DISPATCHER_NAME], data);
        }
    }

    public static storeData(data) {
        if (PlatformBridge.checkBrigde(data)) {
            data.name = PlatformBridge.STORE_DATA;
            if (data['star'] === undefined) {
                cc.log('ERROR: set star before sending completed');
                return;
            }
            if (data['type'] === 'Games' && data['score'] === undefined) {
                cc.log('ERROR: set score for games before sending completed');
                return;
            }
            EventHelper.dispatchCustomEvent(data[PlatformBridge.CALLBACK_DISPATCHER_NAME], data);
        }
    }
}
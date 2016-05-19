export default class EventHelper {
    public static NAME = "EventHelper"
    public static ON_BEGAN = "onBegan"
    public static ON_MOVE = "onMove"
    public static ON_END = "onEnd"
    public static ON_CANCEL = "onCancel"
    public static ON_OUT = "onOut"
    public static ON_SCROLL = "onScroll"
    public static ON_CLICK = "onClick"
    public static ON_SWIPE_LEFT = "onSwipeLeft"
    public static ON_SWIPE_RIGHT = "onSwipeRight"
    public static ON_SWIPE_UP = "onSwipeUp"
    public static ON_SWIPE_DOWN = "onSwipeDown"
    public static CLICK_OFFSET = 20
    public static TIME_OFFSET = 250
    public static SWIPE_OFFSET = 10

    //different events that can be called
    public static addMouseTouchEvent(callBack, target, noCheck?, customRect?, noSound?) {
        noCheck = noCheck == null ? false : noCheck;
        if (parseInt(customRect, 10)) {
            //Custom rect is just area multiplier
            customRect = cc.rect(-customRect / 2 * target.width, -customRect / 2 * target.height, customRect * target.width, customRect * target.height);
        } else if (customRect == null) {
            customRect = false;
        }

        var listener;
        listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect;
                if (customRect != false)
                    rect = customRect;
                else
                    rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.startX = touch.getLocation().x;
                    target.startY = touch.getLocation().y;
                    target.startTime = Date.now();
                    callBack && callBack(event, touch, EventHelper.ON_BEGAN);
                    return true;
                }

                return false;
            },
            onTouchMoved(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect;
                if (customRect != false)
                    rect = customRect;
                else
                    rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode) || noCheck) {
                    if (target.startX == null && target.startY == null)
                        return false;

                    callBack && callBack(event, touch, EventHelper.ON_MOVE);
                    return true;
                }

                if (!cc.rectContainsPoint(rect, locationInNode)) {
                    callBack && callBack(event, touch, EventHelper.ON_OUT);
                    return true;
                }

                return false;
            },
            onTouchEnded(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect;
                if (customRect != false)
                    rect = customRect;
                else
                    rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode) || noCheck) {
                    //sending callback for touch end
                    var timeTaken = Date.now() - target.startTime;
                    if (Math.abs(target.startX - touch.getLocation().x) < EventHelper.CLICK_OFFSET
                        && Math.abs(target.startY - touch.getLocation().y) < EventHelper.CLICK_OFFSET
                        && timeTaken < EventHelper.TIME_OFFSET) {
                        //TODO Perform Check
                        // typeof platform !== "undefined" && !noSound && AudioHelper.playEffect(platform.res.click_wav, false);
                        callBack && callBack(event, touch, EventHelper.ON_CLICK);
                    }

                    var currentSwipe = null;
                    ////check the
                    var leftSwipeDifference = target.startX - touch.getLocation().x;
                    var rightSwipeDifference = touch.getLocation().x - target.startX;
                    var upSwipeDifference = touch.getLocation().y - target.startY;
                    var downSwipeDifference = target.startY - touch.getLocation().y;

                    if (leftSwipeDifference > rightSwipeDifference &&
                        leftSwipeDifference > upSwipeDifference &&
                        leftSwipeDifference > downSwipeDifference &&
                        leftSwipeDifference > EventHelper.SWIPE_OFFSET)
                        currentSwipe = EventHelper.ON_SWIPE_LEFT;
                    else if (rightSwipeDifference > leftSwipeDifference &&
                        rightSwipeDifference > upSwipeDifference &&
                        rightSwipeDifference > downSwipeDifference &&
                        rightSwipeDifference > EventHelper.SWIPE_OFFSET)
                        currentSwipe = EventHelper.ON_SWIPE_RIGHT;
                    else if (upSwipeDifference > leftSwipeDifference &&
                        upSwipeDifference > rightSwipeDifference &&
                        upSwipeDifference > downSwipeDifference &&
                        upSwipeDifference > EventHelper.SWIPE_OFFSET)
                        currentSwipe = EventHelper.ON_SWIPE_UP;
                    else if (downSwipeDifference > leftSwipeDifference &&
                        downSwipeDifference > rightSwipeDifference &&
                        downSwipeDifference > upSwipeDifference &&
                        downSwipeDifference > EventHelper.SWIPE_OFFSET)
                        currentSwipe = EventHelper.ON_SWIPE_DOWN;

                    if (currentSwipe == EventHelper.ON_SWIPE_LEFT)
                        callBack && callBack(event, touch, EventHelper.ON_SWIPE_LEFT);
                    else if (currentSwipe == EventHelper.ON_SWIPE_RIGHT)
                        callBack && callBack(event, touch, EventHelper.ON_SWIPE_RIGHT);
                    else if (currentSwipe == EventHelper.ON_SWIPE_UP)
                        callBack && callBack(event, touch, EventHelper.ON_SWIPE_UP);
                    else if (currentSwipe == EventHelper.ON_SWIPE_DOWN)
                        callBack && callBack(event, touch, EventHelper.ON_SWIPE_DOWN);

                    callBack && callBack(event, touch, EventHelper.ON_END);
                    return true;
                }

                if (!cc.rectContainsPoint(rect, locationInNode)) {
                    callBack && callBack(event, touch, EventHelper.ON_OUT);
                    return true;
                }

                return false;
            },
            onTouchCancelled(touch, event) {
                callBack(event, touch, EventHelper.ON_CANCEL);
                return true;
            }
        });
        cc.eventManager.addListener(listener, target);
        return listener;
    }

    public static addAllTouchEvent(callBack, target, noCheck) {
        noCheck == noCheck == null ? false : noCheck;
        var listener;
        listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan(touches, event) {
                var touchBounded = [];

                var target = event.getCurrentTarget();
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        touchBounded.push(touch);
                    }
                }
                if (touchBounded.length > 0) {
                    return callBack(event, touchBounded, EventHelper.ON_BEGAN);
                } else {

                    return callBack(event, touch, EventHelper.ON_OUT);
                }
            },
            onTouchesMoved(touches, event) {
                var touchBounded = [];

                var target = event.getCurrentTarget();
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        touchBounded.push(touch);
                    }
                }
                if (touchBounded.length > 0 || noCheck) {
                    return callBack(event, touches, EventHelper.ON_MOVE);
                }

                if (touchBounded.length == 0) {
                    return callBack(event, touch, EventHelper.ON_OUT);
                }

                return false;
            },
            onTouchesEnded(touches, event) {
                var touchBounded = [];

                var target = event.getCurrentTarget();
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        touchBounded.push(touch);
                    }
                }

                if (touchBounded.length > 0 || noCheck) {
                    return callBack(event, touches, EventHelper.ON_END);
                }

                if (touchBounded.length == 0) {
                    return callBack(event, touch, EventHelper.ON_OUT);
                }

                return false;
            },
            onTouchesCancelled(touches, event) {
                var touchBounded = [];

                var target = event.getCurrentTarget();
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i];
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        touchBounded.push(touch);
                    }
                }
                if (touchBounded.length > 0) {
                    return callBack(event, touches, EventHelper.ON_CANCEL);
                }
                return false;
            }
        });
        cc.eventManager.addListener(listener, target);
        return listener;
    }

    public static addKeyBoardEvent(callBack, nodeOrPriority) {
        nodeOrPriority = nodeOrPriority || 1;
        var listener;
        listener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.dpadLeft:
                        keyCode = cc.KEY.left;
                        break;
                    case cc.KEY.dpadRight:
                        keyCode = cc.KEY.right;
                        break;
                    case cc.KEY.dpadUp:
                        keyCode = cc.KEY.up;
                        break;
                    case cc.KEY.dpadDown:
                        keyCode = cc.KEY.down;
                        break;
                    case cc.KEY.dpadCenter:
                        keyCode = cc.KEY.enter;
                        break;
                }
                return callBack(event, keyCode, EventHelper.ON_BEGAN);
            },
            onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.dpadLeft:
                        keyCode = cc.KEY.left;
                        break;
                    case cc.KEY.dpadRight:
                        keyCode = cc.KEY.right;
                        break;
                    case cc.KEY.dpadUp:
                        keyCode = cc.KEY.up;
                        break;
                    case cc.KEY.dpadDown:
                        keyCode = cc.KEY.down;
                        break;
                    case cc.KEY.dpadCenter:
                        keyCode = cc.KEY.enter;
                        break;
                }
                return callBack(event, keyCode, EventHelper.ON_END);
            }
        });
        cc.eventManager.addListener(listener, nodeOrPriority);
        return listener;
    }

    //add custom event
    public static addCustomEvent(callBack, eventName) {
        var listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: eventName,
            callback(event) {
                callBack(event);
            }
        });
        cc.eventManager.addListener(listener, 1);
        return listener;
    }
    public static removeCustomListeners(customEventName) {
        customEventName && cc.eventManager.removeCustomListeners(customEventName);
    }

    //dispatch custom event
    public static dispatchCustomEvent(eventName, eventData?) {
        cc.log(eventName);
        var event = new cc.EventCustom(eventName);
        event.setUserData(eventData);
        cc.eventManager.dispatchEvent(event);
    }

    //removing a particular listener
    public static removeEventListener(listener) {
        listener && listener.checkAvailable() && cc.eventManager.removeListener(listener);
    }

    //removing listener by type
    public static removeEventListenerByType(listener) {
        cc.eventManager.removeListeners(listener);
    }

    //removing listener from node
    public static removeEventListenerFromNode(node, recursive) {
        recursive = recursive || false;
        cc.eventManager.removeListeners(node, recursive);
    }
}
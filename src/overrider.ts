if (cc.sys.isNative) {
    let customPolyfill = global['customPolyfill'];
    function getString(array) {
        let string;
        if (array && array.length) {
            string = array[0] + '';
            let length = array.length;
            for (let i = 1; i < length; i++) {
                string += (", " + array[i]);
            }
        }
        return string;
    }

    customPolyfill.log = function () {
        let string = getString(arguments);
        return cc.log.apply(cc, [string]);
    };

    customPolyfill.warn = function () {
        let string = getString(arguments);
        return cc.warn.apply(cc, [string]);
    };
}

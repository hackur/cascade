var jsdom = require('jsdom');

module.exports = (function () {
    function DomIntegration() {

    }

    DomIntegration.init = function () {
        if (typeof window === 'undefined') {
            DomIntegration.initDom();
        }
    };

    DomIntegration.initDom = function () {
        // setup the simplest document possible
        var doc = jsdom.jsdom('<!doctype html><html><body></body></html>')

        // get the window object out of the document
        var win = doc.defaultView

        // set globals for mocha that make access to document and window feel
        // natural in the test environment
        global.document = doc
        global.window = win

        // take all properties of the window object and also attach it to the
        // mocha global object
        propagateToGlobal(win)

        // from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
        function propagateToGlobal(window) {
            for (let key in window) {
                if (!window.hasOwnProperty(key)) continue
                if (key in global) continue

                global[key] = window[key]
            }
            global.Node = window.Node;
            global.Comment = window.Comment;
        }
    };

    return DomIntegration;
})();

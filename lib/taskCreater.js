var webpage = require('webpage')
var _ = require('lodash')
var util = require('./util');
var waitFor = util.waitFor;

module.exports = createTask;

function createTask(data, options) {
    options = options || {};
    var pending = data.length;

    data.forEach(function(v) {
        var page = webpage.create();

        var defaultViewportSize = { width: 1280, height: 682 };
        var defaultClipRect = { top: 0, left: 0};
        var defaultSettings = {
            javascriptEnabled: true,
            loadImages: true,
            encoding: "utf8",
            userAgent: 'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36'
        };

        var graphType = options.graphType || 1;
        var name = v[0];
        var pageAlias = v[1];
        var pageTitle = v[2];
        var series = v[3];

        page.viewportSize = _.assign({}, defaultViewportSize, options.viewportSize);
        page.clipRect = _.assign({}, defaultClipRect, options.clipRect);
        page.settings = _.assign({}, defaultSettings, options.settings);

        startCapture('http://10.16.28.75:3000/?{"dataUrl":"' + decodeURIComponent(pageAlias) + '","charts":[{"type":"line","rounding":"off","title":"' + pageTitle + '","note":""}'
            + (graphType == 2 ? ',{"type":"line","rounding":"off","title":"' + pageTitle + '","note":"Timing Marks","series":[' + (series ? series: 2) + ']}' : '' ) +
            ']}');

        function startCapture(url) {
            console.log(new Date(), 'opening:', url);
            page.open(encodeURI(url), function (status) {
                var data;
                if (status === 'fail') {
                    console.log('open page fail!');
                } else {
                waitFor(function() {
                        var rt = page.evaluate(function(selector) {
                            return document.querySelector(selector);
                        }, '.charts');
                        return rt;
                    }, function() {
                        capture();
                    }, 1000 * 60 * 10, function () {
                        capture();
                    });
                }
                function capture() {
                    page.render('./shots/' + name + '.png');
                    page.close();
                    pending--;
                    if (pending <= 0) {
                        phantom.exit();
                    }
                }
            });
        }
        page.onError = function(msg, trace) {

            var msgStack = ['ERROR: ' + msg];

            if (trace && trace.length) {
                msgStack.push('TRACE:');
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
                });
            }
            console.error(msgStack.join('\n'));
        }
    });
}

var webpage = require('webpage')
var Q = require('q');
var _ = require('lodash')
var util = require('./util');
var waitFor = util.waitFor;

function taskCreater(data, options, cb) {
    if (!data) return;
    options = options || {};
    var pending = data.length;
    var deferred = Q.defer();

    data.forEach(function(v) {
        var page = initPage(options);
        var url = getTargetUrl(v);

        page.onError = function(msg, trace) {
            var msgStack = ['ERROR: ' + msg];
            if (trace && trace.length) {
                msgStack.push('TRACE:');
                trace.forEach(function(t) {
                    msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
                });
            }
            deferred.reject(new Error(msgStack.join('\n')));
        };

        page.open(encodeURI(url), function (status) {
            var data;
            var imgName = v[0];
            if (status === 'fail') {
                deferred.reject(new Error("open page fail!"));
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
                page.render('./shots/' + imgName + '.png');
                page.close();
                pending--;
                if (pending <= 0) {
                     deferred.resolve();
                }
            }
        });
        console.log(new Date(), 'opening:', url);
    });
    return deferred.promise;
}

function initPage(options) {
    var page = webpage.create();
    var defaultViewportSize = { width: 1280, height: 682 };
    var defaultClipRect = { top: 0, left: 0};
    var defaultSettings = {
        javascriptEnabled: true,
        loadImages: true,
        encoding: "utf8",
        userAgent: 'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36'
    };
    page.viewportSize = _.assign({}, defaultViewportSize, options.viewportSize);
    page.clipRect = _.assign({}, defaultClipRect, options.clipRect);
    page.settings = _.assign({}, defaultSettings, options.settings);
    return page;
}
function getTargetUrl(config) {
    var name = config[0];
    var pageAlias = config[1];
    var pageTitle = config[2];
    var series = config[3];
    //截图的图表类型
    var graphType = config[4] || 1;
    var note = config[5] || '';
    var rounding = config[6] || 'off';

    return 'http://10.16.28.75:3000/?{"dataUrl":"' + decodeURIComponent(pageAlias) + '","charts":[{"type":"line","rounding":"' + rounding + '","title":"' + pageTitle + '","note":"' + note + '"}'
        + (graphType == 2 ? ',{"type":"line","rounding":"' + rounding + '","title":"' + pageTitle + '","note":"' + note + '","series":[' + (series ? series: 2) + ']}' : '' )
        + ']}'
}
module.exports = taskCreater;

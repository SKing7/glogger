var webpage = require('webpage')
var _ = require('lodash')

startTasks();

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
                    }, 1000 * 60 * 5, function () {
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

function waitFor(testFx, onReady, timeOutMillis, onTimeout) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    console.log("'waitFor()' timeout");
                    if (onTimeout){
                        onTimeout();
                    }
                } else {
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 200);
};
function startTasks() {
    var dataM = [
        ['index_index', '/index/index/', '首页', 2], 
        ['search_view', '/search/view/', '搜索列表页', 1], 
        ['search_mapview', '/search/mapview/', '搜索图面页', 2], 
        ['detail_index', '/detail/index/', 'POI详情页', 1], 
        ['navigation_index', '/navigation/index/', '路线首页', 2], 
        ['navigation_buslist', '/navigation/buslist/', '公交导航结果页', 2], 
    ];

    createTask(dataM, {
        clipRect: { top: 341, left: 0, width: 1265, height: 341 },
        graphType: 2
    });

    var dataCapture = [];
    var originalData = {
        "放过流量": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DallowedRequestCount",
        "封禁次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DblockEventSummary",
        "封禁IP数量（去重）": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DblockIPSummary",
        "封禁后继续访问流量": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DrequestCountAfterBlockedSummary",
        "验证失败次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DverifyFailedCountSummary",
        "未封禁IP验证失败次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DverifyFailedWithoutBlockedSummary",
        "验证成功次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DverifySuccessCountSummary",
        "未封禁IP验证成功次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D60%26dt%3DverifySuccessWithoutBlockedSummary"
    }; 
    for (var i in originalData) {
        dataCapture.push([i, originalData[i], i, 1]);
    } 
    createTask(dataCapture);
}

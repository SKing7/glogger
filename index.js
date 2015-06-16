var webpage = require('webpage')
var data = [
    ['index_index', '/index/index/', '首页'], 
    ['search_view', '/search/view/', '搜索列表页'], 
    ['search_mapview', '/search/mapview/', '搜索图面页'], 
    ['detail_index', '/detail/index/', 'POI详情页'], 
    ['navigation_index', '/navigation/index/', '路线首页'], 
    ['navigation_buslist', '/navigation/buslist/', '公交导航结果页'], 
];

createTasks();

function createTasks() {

    var pending = data.length;
    data.forEach(function(v) {
        var page = webpage.create();
        var name = v[0];
        var pageAlias = v[1];
        var pageTitle = v[2];
        page.viewportSize = { width: 1280, height: 682 };
        page.clipRect = { top: 341, left: 0, width: 1280, height: 682 };
        page.settings = {
            javascriptEnabled: true,
            loadImages: true,
            encoding: "utf8",
            userAgent: 'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36'
        };
        //"{"dataUrl":"/search/view/","charts":[{"type":"line","rounding":"off","title":""},{"type":"line","rounding":"off","title":"搜索结果列表页","note":"Timing Marks(with SSR)","series":[1]}]}"
        startCapture('http://10.16.28.75:3000/?{"dataUrl":"' + pageAlias + '","charts":[{"type":"line","rounding":"off","title":"","note":""}, {"type":"line","rounding":"off","title":"' + pageTitle + '","note":"Timing Marks(with SSR)","series":[1]}]}');

        function startCapture(url) {
            console.log('opening:', url);
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

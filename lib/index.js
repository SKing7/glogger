var Q = require('q');

Q.fcall(function () {
    var taskCreater = require('./taskCreater');
    var dataM = [
        ['index_index', '/index/index/', '首页', 2],
        ['search_view', '/search/view/', '搜索列表页', 1],
        ['search_mapview', '/search/mapview/', '搜索图面页', 2],
        ['detail_index', '/detail/index/', 'POI详情页', 1],
        ['navigation_index', '/navigation/index/', '路线首页', 2],
        ['navigation_buslist', '/navigation/buslist/', '公交导航结果页', 2],
    ];
    for (var i in dataM) {
        dataM[i].push(2);
        dataM[i].push('Timing Marks');
    }
    return taskCreater(dataM, {
        clipRect: { top: 341, left: 0, width: 1265, height: 341 },
    });
})
.then(function () {
    var taskCreater = require('./taskCreater');
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
        dataCapture.push([i, originalData[i], i, 1, 1, '60天内统计数据']);
    }
    return taskCreater(dataCapture);
})
.then(function () {
    Q.fcall(function () {
        phantom.exit();
    })
})
.done();

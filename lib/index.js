var Q = require('q');
var moment = require('moment');
var taskCreater = require('./taskCreater');

Q.fcall(function () {
    var dataM = [
        ['index_index', '/index/index/', '首页', 2],
        ['search_view', '/search/view/', '搜索列表页', 1],
        ['search_mapview', '/search/mapview/', '搜索图面页', 2],
        ['detail_index', '/detail/index/', 'POI详情页', 1],
        ['navigation_index', '/navigation/index/', '路线首页', 2],
        ['navigation_buslist', '/navigation/buslist/', '公交导航结果页', 2],
    ];
    //var dataM = [
    //    {
    //        name: '',
    //        dataSrc: '',
    //        title: '',
    //        graphType: '',
    //        series: '', //依赖graphType
    //        note: '',
    //        rounding: '',
    //    },
    //];
    for (var i in dataM) {
        //options[2]
        dataM[i][0] = dataM[i][0] + '_30d_' + getDateMarker();
        dataM[i][1] = dataM[i][1] + '30d';
        //option[4]
        dataM[i].push(2);
        //option[5]
        dataM[i].push('Timing Marks');
        //option[6]
        dataM[i].push('off');
    }
    return taskCreater(dataM, {
        clipRect: { top: 341, left: 0, width: 1024, height: 341 },
        viewportSize: {width: 1024, height: 682},
        shotDir: './shots',
    });
})
.then(function () {
    //?%7B%22dataUrl%22%3A%22%2Findex%2Findex%2F%22%2C%22charts%22%3A%5B%7B%22type%22%3A%22line%22%2C%22rounding%22%3A%22off%22%2C%22title%22%3A%22%E9%A6%96%E9%A1%B5%22%7D%5D%7D
    var dataM = [
        //['pc_marker_key', '2_rt_markerKey', 'markerKey', 1],
        ['pc_rt_mapshow', 'pc_rt_mapshow', 'mapshow', 2],
        ['pc_rt_mapload', 'pc_rt_mapLoad', 'mapload', 2],
        ['pc_rt_mapfileload', 'pc_rt_mapfileLoad', 'mapfileLoad', 2],
    ];
    //var dataM = [
    //    {
    //        name: '',
    //        dataSrc: '',
    //        title: '',
    //        graphType: '',
    //        series: '', //依赖graphType
    //        note: '',
    //        rounding: '',
    //    },
    //];
    for (var i in dataM) {
        //options[2]
        dataM[i][0] = dataM[i][0] + '_30d_' + getDateMarker();
        dataM[i][1] = dataM[i][1] + '30d';
        //option[4]
        dataM[i].push(1); //graphType
        //option[5]
        dataM[i].push('Timing Marks');
        //option[6]
        dataM[i].push('off');
    }
    return taskCreater(dataM, {
        clipRect: { top: 0, left: 0, width: 1024, height: 682 },
        viewportSize: {width: 1024, height: 682},
        shotDir: './shots',
    });
})
//.then(function () {
//    var dataCapture = [];
//    var originalData = {
//        "放过流量": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DallowedRequestCount",
//        "封禁次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DblockEventSummary",
//        "封禁IP数量（去重）": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DblockIPSummary",
//        "封禁后继续访问流量": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DrequestCountAfterBlockedSummary",
//        "验证失败次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DverifyFailedCountSummary",
//        "未封禁IP验证失败次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DverifyFailedWithoutBlockedSummary",
//        "验证成功次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DverifySuccessCountSummary",
//        "未封禁IP验证成功次数": "http%3A%2F%2F10.17.128.63%3A3000%2Fstat%3Fdays%3D30%26dt%3DverifySuccessWithoutBlockedSummary"
//    };
//    for (var i in originalData) {
//        dataCapture.push([i, originalData[i], i, 1, 1, '30天内统计数据', 'on']);
//    }
//    return taskCreater(dataCapture, {
//        shotDir: './shots',
//    });
//})
.then(function () {
    Q.fcall(function () {
        phantom.exit();
    })
})
.done();
function getDateMarker(d) {
    d = d || new Date;
    return moment(d).subtract(1, 'days').format('YYYYMMDD');
}

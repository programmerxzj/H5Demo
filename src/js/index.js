// 获取路由参数
function getUrlParam(name) {
    var r = window.location.search && window.location.search.substr(1) && window.location.search.substr(1)
        .split(
            '&') || ''; //匹配目标参数
    if (r != null) {
        if (name === 'customizedKey') {
            return r[0] && r[0].split('=')[1] || ''
        } else {
            return r[1] && r[1].split('=')[1] || ''
        }
    } else {
        return null

    }
}

var customerkeyQuery = getUrlParam('customizedKey') || '';
var apiEnv = getUrlParam('apiEnv') || ''; // 环境
// 返回数组类型
var typeMap = {
    iOS: 'iosDown',
    Windows: 'pcDown',
    Android: 'androidDown',
    Microsoft_NET: 'frameworkDown',
    // arm64: 'desktop_arm64',
    // arm64_hw: 'desktop_arm64_hw',
    // amd64: 'desktop_amd64',
    // loongarch64: 'desktop_loongarch64',
    // mips: 'desktop_mips',
    // DESKTOP_ARM(120, "信创(Arm)","desktop_arm64"),
    // DESKTOP_ARM_HW(121, "信创(Arm华为)","desktop_arm64_hw"),
    // DESKTOP_X86_64(122, "信创(X86)","desktop_amd64"),
    // DESKTOP_LOONGARCH(123, "信创(龙芯)","desktop_loongarch64"),
    // DESKTOP_MIPS64EL(124, "信创(mips)","desktop_mips"),
}

var apiEnvMap = {
    localurl: 'http://localhost:5000',
    // localurl: 'http://localhost:8080',
    testqa: 'https://testqaoms.xylink.com', // http://172.20.34.225:30006"   https://testqaoms.xylink.com
    k8s: 'https://txdev-oms.xylink.com',
    txdev: 'https://txdev-oms.xylink.com',
    pre: 'https://pre-oms.xylink.com',
    prd: 'https://oms.xylink.com',
};
// console.log(apiEnvMap, '-=>-', apiEnv, '160', apiEnvMap[apiEnv || 'txdev']);

var htmlTemplate = function (i) {
    return `
    <div class="container content">
        <div class="row dynamical${i} ">
           
        </div>
    </div>`
}

var itemTemplate = {
    loongarch64: ` <div class="col-sm-6  col-xs-12 item">
    <div class="downloads-sprite download_xin3 down-pc"></div>
    <a id="loongarch64" href="javascript:;"
        class="btn btn-primary">信创龙芯（3A5000）)</a>
</div>`,
    arm64: ` <div class="col-sm-6  col-xs-12 item">
<div class="downloads-sprite download_xin1 down-pc"></div>
<a id="arm64" href="javascript:;"
    class="btn btn-primary">信创ARM(飞腾/鲲鹏)</a>
</div>`,
    amd64: ` <div class="col-sm-6  col-xs-12 item">
<div class="downloads-sprite download_xin2 down-pc"></div>
<a id="amd64" href="javascript:;"
    class="btn btn-primary">信创X86（海光/兆芯/Intel/AMD）</a>
</div>`,
    mips: ` <div class="col-sm-6  col-xs-12 item">
<div class="downloads-sprite download_xin4 down-pc"></div>
<a id="mips" href="javascript:;"
    class="btn btn-primary">信创龙芯（3A3000/3A4000）</a>
</div>`,
    mac: ` <div class="col-sm-6  col-xs-12 item">
<div class="downloads-sprite download_xin5 down-pc"></div>
<a id="mac" href="javascript:;"
    class="btn btn-primary">MAC</a>
</div>`,
    arm64_hw: ` <div class="col-sm-6  col-xs-12 item">
<div class="downloads-sprite download_xin1 down-pc"></div>
<a id="arm64_hw" href="javascript:;"
    class="btn btn-primary">信创ARM（麒麟990）</a>
</div>`,
}

var actionApi = apiEnvMap[apiEnv || 'txdev'] +
    '/api/rest/oms/v1/open/device/customizedSoftClient/list?customizedKey=' + customerkeyQuery;
window.onload = function () {
    $.get(actionApi, function (data, status) {
        if (status === 'success' && data && Array.isArray(data)) {
            var newObj = {};
            var dynamicalObj = {}
            var dynamicalArr = []
            data.forEach(function (item, index) {
                if (item && item.link && item.type) {
                    // newObj[item.type] = item;
                    var type = item.type
                    if (type === 'arm64' || type === 'arm64_hw' || type === 'amd64' || type === 'loongarch64' || type === 'mips' || type === 'mac') {
                        // $('.isXinChuang').css({ 'display': 'block' })
                        $('#iosDown').css({ 'margin-bottom': '0px' })
                        dynamicalObj[item.type] = item
                        dynamicalArr.push(item.type)
                    } else {
                        newObj[item.type] = item;
                        $('#iosDown').css({ 'margin-bottom': '90px' })
                    }
                }
            });
            // console.log(newObj, 'new');
            if (newObj.Android && newObj.Android.link) {
                // console.log('------177--------', newObj.Android, newObj.Android.link)
                document.getElementById("androidImgBoxOrigin").style.cssText = "display: none"
                document.getElementById("androidImgBox").style.cssText = "display: inherit"
                $('#androidImgBox').qrcode({
                    text: newObj.Android.link,
                    width: "160",
                    height: "160"
                });
            }
            Object.keys(typeMap).forEach(function (item, index) {
                if (newObj[item]) {
                    document.getElementById(typeMap[item]).removeAttribute('disabled');
                    document.getElementById(typeMap[item]).setAttribute('href', newObj[item]
                        .link);
                } else {
                    document.getElementById(typeMap[item]).innerText = '此版本暂不支持';
                }
            })
            if (Array.isArray(dynamicalArr) && dynamicalArr.length) {
                var container = document.getElementsByClassName('download-content')[0]

                // 需要添加的行数  框架
                var num = Math.ceil(dynamicalArr.length / 2)
                for (let i = 1; i <= num; i++) {
                    var div = document.createElement('div')
                    div.setAttribute('class', `container-fluid`)
                    div.innerHTML = htmlTemplate(i)
                    container.appendChild(div)
                    var dynamicalEle = document.getElementsByClassName(`dynamical${i}`)[0]
                    // 拿到一行两个元素数据的结构
                    var item = ''
                    var itemArr = dynamicalArr.splice(0, 2)
                    itemArr.forEach(i => {
                        item += itemTemplate[i]
                    })

                    dynamicalEle.innerHTML = item
                    // 添加链接
                    for (let i = 0; i < itemArr.length; i++) {
                        document.getElementById(itemArr[i]).setAttribute('href', dynamicalObj[itemArr[i]]?.['link'])
                    }
                }

            }
        }
    }).catch(function (err) {
        // const data = [
        //     { "type": "Windows", "version": " ", "link": "https://cdn.xylink.com/as/150130/new/framework.exe", "customizedKey": " " },
        //     { "type": "iOS", "version": " ", "link": "https://cdn.xylink.com/as/150130/new/framework.exe", "customizedKey": " " },
        //     { "type": "Microsoft_NET", "version": " ", "link": "https://cdn.xylink.com/as/150130/new/framework.exe", "customizedKey": " " },
        //     { "type": "Android", "version": "3.2.1-11906", "link": "https://testdevcdn.xylink.com/vcs/appdownload/custom_wukuang_release-3.2.1-11906.apk?t=1637663876869", "customizedKey": "wukuang" },
        //     { "type": "arm64", "version": "5.0.1", "link": "https://testdevcdn.xylink.com/vcs/appdownload/com.xylink.linuxclient.ecosystem_1.0.0-20220113_arm64.deb?t=1647664700959", "customizedKey": "wukuang" },
        //     { "type": "loongarch64", "version": "6.0.1", "link": "https://testdevcdn.xylink.com/vcs/appdownload/com.xylink.linuxclient.ecosystem_1.0.0.3102-20220120_1139_loongarch64.deb?t=1647664800589", "customizedKey": "wukuang" },
        //     { "type": "amd64", "version": "6.0.1", "link": "https://testdevcdn.xylink.com/vcs/appdownload/com.xylink.linuxclient.ecosystem_3.0.0.3150-20220111_amd64.deb?t=1647598973079", "customizedKey": "wukuang" },
        //     { "type": "mips", "version": "6.0.1", "link": "https://testdevcdn.xylink.com/vcs/appdownload/com.xylink.linuxclient.ecosystem_3.0.0.3150-20220111_amd64.deb?t=1647598973079", "customizedKey": "wukuang" },
        //     { "type": "mac", "version": "6.0.1", "link": "https://testdevcdn.xylink.com/vcs/appdownload/com.xylink.linuxclient.ecosystem_3.0.0.3150-20220111_amd64.deb?t=1247598973079", "customizedKey": "wukuang" },
        //     { "type": "arm64_hw", "version": "6.0.1", "link": "https://testdevcdn.xylink.com/vcs/appdownload/com.xylink.linuxclient.ecosystem_3.0.0.3150-20220111_amd64.deb?t=1647598973079", "customizedKey": "wukuang" }
        // ]
        // var newObj = {};
        // var dynamicalObj = {}
        // var dynamicalArr = []
        // data.forEach(function (item, index) {
        //     if (item && item.link && item.type) {
        //         // newObj[item.type] = item;
        //         var type = item.type
        //         if (type === 'arm64' || type === 'arm64_hw' || type === 'amd64' || type === 'loongarch64' || type === 'mips' || type === 'mac') {
        //             // $('.isXinChuang').css({ 'display': 'block' })
        //             $('#iosDown').css({ 'margin-bottom': '0px' })
        //             dynamicalObj[item.type] = item
        //             dynamicalArr.push(item.type)
        //         } else {
        //             newObj[item.type] = item;
        //             $('#iosDown').css({ 'margin-bottom': '90px' })
        //         }
        //     }
        // });
        // // console.log(newObj, 'new');
        // if (newObj.Android && newObj.Android.link) {
        //     // console.log('------177--------', newObj.Android, newObj.Android.link)
        //     document.getElementById("androidImgBoxOrigin").style.cssText = "display: none"
        //     document.getElementById("androidImgBox").style.cssText = "display: inherit"
        //     $('#androidImgBox').qrcode({
        //         text: newObj.Android.link,
        //         width: "160",
        //         height: "160"
        //     });
        // }
        // Object.keys(typeMap).forEach(function (item, index) {
        //     if (newObj[item]) {
        //         document.getElementById(typeMap[item]).removeAttribute('disabled');
        //         document.getElementById(typeMap[item]).setAttribute('href', newObj[item]
        //             .link);
        //     } else {
        //         document.getElementById(typeMap[item]).innerText = '此版本暂不支持';
        //     }
        // })
        // if (Array.isArray(dynamicalArr) && dynamicalArr.length) {
        //     var container = document.getElementsByClassName('download-content')[0]

        //     // 需要添加的行数  框架
        //     var num = Math.ceil(dynamicalArr.length / 2)
        //     for (let i = 1; i <= num; i++) {
        //         var div = document.createElement('div')
        //         div.setAttribute('class', `container-fluid`)
        //         div.innerHTML = htmlTemplate(i)
        //         container.appendChild(div)
        //         var dynamicalEle = document.getElementsByClassName(`dynamical${i}`)[0]
        //         // 拿到一行两个元素数据的结构
        //         var item = ''
        //         var itemArr = dynamicalArr.splice(0, 2)
        //         itemArr.forEach(i => {
        //             item += itemTemplate[i]
        //         })

        //         dynamicalEle.innerHTML = item
        //         // 添加链接
        //         for (let i = 0; i < itemArr.length; i++) {
        //             document.getElementById(itemArr[i]).setAttribute('href', dynamicalObj[itemArr[i]]?.['link'])
        //         }
        //     }

        // }
        console.log('------201---err-----', err.responseJSON)
    });

    // 内核判断
    var browserInfo = {
        versions: (function () {
            var u = navigator.userAgent;
            return {
                // 移动终端浏览器版本信息
                trident: u.indexOf("Trident") > -1, // IE内核
                presto: u.indexOf("Presto") > -1, // opera内核
                webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
                gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, // 火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -
                    1, // android终端或uc浏览器
                iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
                iPad: u.indexOf("iPad") > -1 ||
                    (navigator.platform === "MacIntel" && navigator.maxTouchPoints >
                        1), // 是否iPad
                webApp: u.indexOf("Safari") === -1, // 是否web应该程序，没有头部与底部
                weixin: u.indexOf("MicroMessenger") > -1, // 判断是否为微信打开，
                mac: u.indexOf("Mac OS X") > -1,
                windows: u.indexOf("Window") > -1,
                chrome: u.indexOf("Chrome") > -1,
                dingding: u.indexOf("DingTalk") > -1, // 判断是否为钉钉打开
                xiaomi: u.match(/mi\s/i)
            };
        })(),
        language: navigator.language.toLowerCase()
    };

    var getOpenMaskTipStatus = function () {
        return browserInfo.versions.weixin && browserInfo.versions.ios;
    };

    var isOpenMaskTip = getOpenMaskTipStatus()

    var mask = document.getElementById('mask')

    if (isOpenMaskTip) {
        mask.style.display = "block"
    }
}

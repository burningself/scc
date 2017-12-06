Vue.prototype.wxscanQRCode = function() { //扫描二维码
    var that = this;
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            that.wxscanData = result;
        }
    });
};
Vue.prototype.getlocation = function(flag) {
    var that = this;
    wx.getLocation({
        type: 'gcj02',
        success: function(res) {
            that.presentPoint.push(res.longitude, res.latitude);
            if (flag) {
                that.dhStart();
            } else { //提交坐标或者获取位置
                that.post_point();
            }
        },
        cancel: function(res) {
            that.showInfo();
        },
    })
};
Vue.prototype.wxpreviewImage = function(c, imgs) { //预览图片
    // console.log(imgs);
    wx.previewImage({
        current: c, // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
    });
};
Vue.prototype.wxChooseImage = function(imgtype, relateid, relatetype) { //选择图片或者拍照
    var that = this;
    wx.chooseImage({
        count: 3,
        success: function(res) {
            that.wximages.localId = res.localIds;
            that.wxuploadImage(imgtype, relateid, relatetype);
        }
    });
};
Vue.prototype.wxuploadImage = function(imgtype, relateid, relatetype) { //上传图片
    var that = this;
    if (that.wximages.localId.length == 0) {
        alert('请先使用 chooseImage 接口选择图片');
        return;
    }
    var i = 0,
        length = that.wximages.localId.length;

    function upload() {
        wx.uploadImage({
            localId: that.wximages.localId[i],
            isShowProgressTips: 1,
            success: function(res) {
                that.wximages.serverId.push(res.serverId);

                that.$store.commit('commonModules/getCookie', 'csrftoken')
                var csrftoken = that.$store.state.commonModules.cs_cookie;


                const useName = localStorage.getItem('login_name');
                let id = '';
                axios.get('/user/rest/user/?username=' + useName)
                    .then(data => {
                        // commit('userData', res.data[0].id);
                        id = data.data[0].id;
                        $.ajax({
                            url: "/file/uploadWXfile/",
                            type: 'POST',
                            dataType: 'json',
                            headers: {
                                'X-CSRFTOKEN': csrftoken,
                            },
                            // 把token塞入头部
                            data: {
                                userid: id,
                                imgtype: imgtype,
                                mediaStr: res.serverId,
                                relatetype: relatetype,
                                relateid: relateid,
                                media_id: res.serverId
                            },
                            success: function(callback) {

                                that.wximages.showId.push({
                                    src: '/' + callback.docList[0],
                                    id: callback.docidList[0]
                                });
                                that.$store.commit('commonModules/changeFlag');
                                i++;
                                if (i < length) {
                                    upload();
                                }
                            },
                            error: function(callback) {}
                        })


                    })


            },
            fail: function(res) {}
        });
    }
    upload();
};

// Vue.prototype.downloadImage = function() { //下载图片
//     const that = this;
//     wx.downloadImage({
//         serverId: that.wximages.serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
//         isShowProgressTips: 1, // 默认为1，显示进度提示
//         success: function(res) {
//             var localId = res.localId; // 返回图片下载后的本地ID
//             console.log(localId);
//         }
//     });
// }
Vue.prototype.wxinit = function() {
    var that = this;
    wx.config({
        debug: false,
        appId: that.wxconfig.appid,
        timestamp: that.wxconfig.timestamp,
        nonceStr: that.wxconfig.nonceStr,
        signature: that.wxconfig.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
        ]
    });

    wx.ready(function() {
        wx.checkJsApi({
            jsApiList: [
                'getNetworkType',
                'getLocation',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'scanQRCode',
            ],
            success: function(res) {

            }
        });

    });
    wx.error(function(res) {
        alert("授权失败！");
    });
};
Vue.prototype.wxstartRecord = function() { //微信录音
    var that = this;
    wx.startRecord({
        success: function(res) {
            that.showuploadvoice = 1;
            // alert(res);
        },
        cancel: function() {
            that.showuploadvoice = 0;
        },
        fail: function(res) {
            console.log(res);
        }
    });
};

Vue.prototype.wxstopRecord = function() { //微信录音停止
    var that = this;
    // console.log(this);
    wx.stopRecord({
        success: function(resu) {
            that.wxvoices.localId = resu.localId;
            var content = "";
            wx.translateVoice({
                localId: that.wxvoices.localId,
                complete: function(res) {
                    if (res.hasOwnProperty('translateResult')) {
                        content = res.translateResult || "";
                        that.text_all[that.showvoiceIndex].value = res.translateResult || "";
                    }
                    that.showvoiceIndex = "";
                }
            });
        },
        fail: function(res) {
            // alert(JSON.stringify(res));
            that.wxsuccess = 1;
        }
    });
    that.showuploadvoice = 0;
    that.wxsuccess = 1;
};
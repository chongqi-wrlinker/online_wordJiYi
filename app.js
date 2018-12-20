var url=require("common/url.js");
App({
    onLaunch: function () {
        //获取系统的设置参数
        wx.request({
            url: "https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getSystemParam",
            success:function(e){
                console.log(e);
                wx.setStorageSync("systemConfig", e.data);
            }
        })


        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.setStorageSync("userInfo", true);
                }else{
                    wx.setStorageSync("userInfo", false);
                }
            }
        })
    },
    onShow: function () {
       
    },
    onHide: function () {
        
    },
    globalData: {
        hasLogin: false
    }
});
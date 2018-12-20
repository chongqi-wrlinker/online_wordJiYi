// pages/wo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfoState: false,
      userInfo: {
          touxiang: "/images/index/noLogin.png",//用户头像
          name: "点击头像授权",//用户的名字
          tel: "点击头像授权"//用户的电话
      },
  },
    //绑定获取用户信息的方法
    bindGetUserInfo: function (e) {
        if (e.detail.errMsg == "getUserInfo:ok") {
            wx.setStorageSync("userInfo", true);
            this.onShow();
        }
    },

    //跳转到折线图
    jumpToMap:function(e){
        var checkState = wx.getStorageSync("userInfo");
        if(checkState){
            var flag=e.currentTarget.dataset.flag;
            if(flag==1){
                //进入挑战折线图
                var url= "/pages/tiaozhanzhexian/index";
            }else if(flag==2){
                //进入词汇检测折线图
                var url = "/pages/cihuizhexian/index";
            }else if(flag==3){
                //进入排行榜
                var url = "/pages/paihangbang/index";
            }
            wx.navigateTo({
                url: url,
            })
        }else{
            wx.showToast({
                title: '点击头像进行授权',
                icon:'none'
            })
        }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
    onShow: function () {
        var checkState = wx.getStorageSync("userInfo");
        if (checkState) {
            var that = this;
            wx.getUserInfo({
                success: function (res) {
                    var userInfo = res.userInfo;
                    var userInfoState = true;
                    var finalUserInfo = {
                        touxiang: userInfo.avatarUrl,
                        name: userInfo.nickName,
                       
                    };
                    that.setData({
                        userInfoState: userInfoState,
                        userInfo: finalUserInfo,
                    })
                    
                }
            })
        }
        this.setData({
            userInfoState: checkState
        });
    },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
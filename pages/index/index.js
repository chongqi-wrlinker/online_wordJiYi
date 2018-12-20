// pages/index/index.js
var url=require('../../common/url.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfoState:false,
      userInfo:{
          touxiang: "/images/index/noLogin.png",//用户头像
          name: "点击头像授权",//用户的名字
          tel:"点击头像授权"//用户的电话
      },
      studyData:{
          studyWord:0,//学习的单词数量
          studyTime:"00:00",//学习时间
          progress:0//进度条
      },
  },
    


    /**跳转到开始背诵页面*/
    jumpUrl:function(e){
        console.log("用户是否授权："+this.data.userInfoState);
        this.boWen3 = this.selectComponent("#boWen3");
        this.boWen3.show(e);
        if (this.data.userInfoState){
            //这里需要判断用户是否进行了单词检测，如果没有就提示用户去进行词汇量检测
            console.log("开始判断用户是否进行至少一次的词汇检测..." );
            var userID=wx.getStorageSync("userID");
            var that=this;
            wx.request({
                url: url.getUserCiHuiList(),
                data:{userID:userID},
                success:function(res){
                    console.log("获取到用户进行词汇检测的次数:"+res.data.length);
                    console.log("通过获取的词汇检测次数进行判断");
                    if (res.data.length>0){
                        console.log("用户完成了至少一次的词汇量检测");
                        wx.navigateTo({
                            url: '/pages/config/index',
                        })
                    }else{
                        console.log("用户一次的词汇量检测都没有进行");
                        wx.showModal({
                            title: '友情提示',
                            content: '你尚未进行词汇量检测，请先至少完成一次。',
                            showCancel:false,
                            success:function(res1){
                                if(res1.confirm){
                                    console.log("直接跳转到单词检测的页面");
                                    that.doWordCheck();
                                }
                            }
                        })
                    }
                }
            })



            /***/
        }else{
            wx.showToast({
                title: '对不起，您还未授权',
                icon:"none"
            })
        }
    },
    /**跳转到单词检测的页面*/
    jumpWordCheck:function(e){
        this.boWen1 = this.selectComponent("#boWen1");
        this.boWen1.show(e);
        if (this.data.userInfoState) {
            //获取系统设置的开始值参数(上一次检测结果的值)
            this.doWordCheck();
        }else{
            wx.showToast({
                title: '对不起，您还未授权',
                icon: "none"
            })
        }
       
    },

    //获取用户词汇量检测的，并且跳转的方法
    doWordCheck:function(){
        var userID = wx.getStorageSync("userID");
        wx.request({
            url: url.getUserCiHuiList(),
            data: { userID: userID },
            success: function (data) {
                var res = data.data;
                var state=1;
                if (res.length > 0) {
                    var beginCount = res[res.length - 1]['number'];
                    state=1;
                } else {
                    var systemConfig = wx.getStorageSync("systemConfig");
                    var beginCount = systemConfig['EnglishConfig']['wordCheck']['beginCount'];
                    state = 2;
                }
                var id = parseInt(beginCount) + (parseInt(Math.random() * 100) > 0 ? parseInt(Math.random() * 100) : 1);
                wx.setStorageSync("numberOfAnswers", 1);
                setTimeout(function () {
                    wx.navigateTo({
                        url: '/pages/wordCheck/index?id=' + id + "&wordAnswerCount=0&state=" + state,
                    })
                }, 600);
            }
        })
    },


    /**跳转到快速挑战的方法*/
    jumpTiaozhan:function(e){
        this.boWen2 = this.selectComponent("#boWen2");
        this.boWen2.show(e);
        if (this.data.userInfoState) {
            //这里需要判断用户是否进行了单词检测，如果没有就提示用户去进行词汇量检测
            console.log("开始判断用户是否进行至少一次的词汇检测...");
            var userID = wx.getStorageSync("userID");
            var that = this;
            wx.request({
                url: url.getUserCiHuiList(),
                data: { userID: userID },
                success: function (res) {
                    console.log("获取到用户进行词汇检测的次数:" + res.data.length);
                    console.log("通过获取的词汇检测次数进行判断");
                    if (res.data.length > 0) {
                        console.log("用户完成了至少一次的词汇量检测");

                        //判断生词本的容量是否大于零
                        wx.request({
                            url: url.getRestTiaoZhanCount(),
                            data:{userID:userID},
                            success:function(res1){
                                if (res1.data.count<100){
                                    //获取掌握区的单词列表
                                    wx.request({
                                        url: url.getTiaoZhanList1(),
                                        data: { userID: userID },
                                        success: function (res) {
                                            var fuxiList = res.data;
                                            wx.setStorageSync('fuxiList', res.data);
                                            wx.navigateTo({
                                                url: '/pages/tiaozhan/index',
                                            })
                                        }
                                    })
                                }else{
                                    wx.showModal({
                                        title: '友情提示',
                                        content: '您的生词记录过多，请先去《开始背单词》消灭生词吧',
                                        showCancel: false,
                                        success: function (res1) {
                                            
                                        }
                                    })
                                }
                            }
                        })
                    } else {
                        console.log("用户一次的词汇量检测都没有进行");
                        wx.showModal({
                            title: '友情提示',
                            content: '你尚未进行词汇量检测，请先至少完成一次。',
                            showCancel: false,
                            success: function (res1) {
                                if (res1.confirm) {
                                    console.log("直接跳转到单词检测的页面");
                                    that.doWordCheck();
                                }
                            }
                        })
                    }
                }
            })
            
            /**
             * setTimeout(function () {

                wx.navigateTo({
                    url: '/pages/tiaozhan/index?id=' + id + "&wordAnswerCount=0",
                })
            }, 1000);
             * 
            */
        }else{
            wx.showToast({
                title: '对不起，您还未授权',
                icon: "none"
            })
        }
        
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

    



  //绑定获取用户信息的方法
    bindGetUserInfo:function(e){
        if (e.detail.errMsg == "getUserInfo:ok"){
            wx.setStorageSync("userInfo", true);
            this.onShow();
        }
    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var userInfo = wx.getStorageSync("userInfo");
      console.log(userInfo);
      this.setData({
          userInfoState: userInfo
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var checkState = this.data.userInfo;
      if (checkState) {
          var that = this;
          wx.getUserInfo({
              success: function (res) {
                  var userInfo = res.userInfo;
                  var userInfoState = true;
                  var finalUserInfo = {
                      touxiang: userInfo.avatarUrl,
                      name: userInfo.nickName,
                      tel: "13290032026"
                  };
                  that.setData({
                      userInfoState: userInfoState,
                      userInfo: finalUserInfo,
                  })
                  //获取用户的openid
                  wx.showLoading({
                      title: '等待加载数据...',
                  })
                  wx.login({
                      success: function (res) {
                          wx.request({
                              url: url.getUserInfoUrl(),
                              data: { code: res.code, avatarUrl: userInfo.avatarUrl, name: userInfo.nickName },
                              success: function (e) {
                                  wx.setStorageSync("userID", e['data'][0]['id']);
                                  that.setData({
                                      studyData: {
                                          studyWord: e['data'][0]['studycount'],//学习的单词数量
                                          studyTime: e['data'][0]['studytime'],//学习时间
                                          progress: e['data'][0]['progress']//进度条
                                      },
                                  });
                                  wx.hideLoading();
                              }
                          })
                      }
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
// pages/oldWord/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtck:false,
    rule:""
  },
  showtck:function(e){
    var that=this;
    that.setData({
      showtck:true,
    });
  },
  guanbi: function (e) {
    var that = this;
    that.setData({
      showtck: false,
    });
  },
    //跳转到复习页面
    jumpUrl:function(e){
        wx.navigateTo({
            url: '/pages/fuxi/index',
        })
    },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取系统的参数设置
      
      
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
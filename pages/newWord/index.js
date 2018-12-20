// pages/newWord/index.js
var url=require("../../common/url.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showtck: false,
    rule:"",
    hide:false,
  },
  showtck: function (e) {
    var that = this;
    that.setData({
      showtck: true,
      hide:true,
    });
  },
  guanbi: function (e) {
    var that = this;
    that.setData({
      showtck: false,
      hide: false,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取系统的参数设置
      
  },
  
  //获取页面数据
  getPageParam:function(){
      var system = wx.getStorageSync("systemConfig");
      var rule = system['EnglishConfig']['newWord']['questionRule'];
      this.setData({
          rule: rule
      });

      //获取设备的宽度
      var systemWidth = wx.getSystemInfoSync().windowWidth;
      //获取canvas的对象
      var ctx = new wx.createCanvasContext('canvasid', this);//用来捕获页面中Canvas
      //画最外层的圆形
      ctx.beginPath();
      ctx.arc(systemWidth / 2, 0, systemWidth / 2, 0, 2 * Math.PI);
      ctx.setFillStyle('#2FDBC3');
      ctx.fill();
      ctx.save();
      //写字
      ctx.font = "15px 隶书";
      ctx.fillStyle = "white";
      ctx.fillText("总词汇88600个", systemWidth / 2 - 50, 130);
      //画内圆形
      var userID = wx.getStorageSync("userID");
      var that = this;
      wx.request({
          url: url.dealShengCiData(),
          data: { type: "getTotalCount", userID: userID },
          success: function (e) {
              that.drawSin(ctx, systemWidth / 2, 0, 80, e.data);
          }
      })
  },

  //画内圆形
    drawSin: function (ctx,x,y,r,num){
        
        ctx.beginPath()
        ctx.arc(x,y, r, 0, 2 * Math.PI)
        ctx.setFillStyle('#3C78DE')
        ctx.fill();
        ctx.font = "15px 隶书";
        ctx.fillStyle = "white";
        ctx.fillText("生词数" + num+"个",x - 50, 40); 
        ctx.draw()
  },

  //生词本训练
    goToDoTest:function(){
        var userID=wx.getStorageSync("userID");
        wx.request({
            url: url.dealShengCiData(),
            data:{type:"getList",userID:userID},
            success:function(e){
                if (e.data.length>0){
                    //跳转到生词训练营
                    console.log(e.data);
                    wx.setStorageSync("newWordList", e.data);
                    wx.navigateTo({
                        url: '/pages/newWordCheck/index',
                    })
                }else{
                    //提示没有生词，去学习页面添加生词
                    wx.showModal({
                        title: '消息提示',
                        content: '当前您尚未有生词，请在首页学习页面中，添加生词',
                    })
                }
            }
        })
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
      this.getPageParam();
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
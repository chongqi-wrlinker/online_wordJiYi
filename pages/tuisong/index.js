// pages/tuisong/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      articleList:[],
      index:0,
      articleInfo:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        //获取随机推送内容
      var that=this;
      var myDate = new Date();
      var month=myDate.getMonth();
      var day = myDate.getDate();
      var page = month*30+day;
      var index=this.data.index;
      wx.request({
          url: 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/Tuisong/index/getRandomTuiSongList',
          data:{page:page},
          success:function(res){
              console.log(res.data[index]);
              that.setData({
                  articleList:res.data,
                  articleInfo:res.data[index]
              });
          }
        })  
      
  },

  //下一篇文章
    nextArticle:function(){
        var index=this.data.index;
        var articleList = this.data.articleList;
        if(index<4){
            index=index+1;
            this.setData({
                index:index,
                articleInfo: articleList[index]
            });
        }else{
            wx.showToast({
                title: '每天最多推送5条，想看更多点击下面的桃心',
                icon:"none"
            })
        }
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
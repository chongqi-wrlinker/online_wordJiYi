// pages/jiexi/index.js
var context = new wx.createCanvasContext('canvasid1', this);
var strat_num = 1, end_num = 400;//20*10秒
var sAngle = 1.5 * Math.PI, eAngle = 0;
var common = require('../../common/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      fayinState:1,
      steadTime:"",//专注时长
  },
    //画圆环
    canvas: function () {
        var that = this;
        if (strat_num <= end_num) {
            eAngle = strat_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
            setTimeout(function () {
                context.setStrokeStyle("#4395ff")
                context.setLineWidth(4)
                context.fillText(strat_num * 1 <= 100 ? strat_num * 1 : 100, 95, 95)
                context.arc(15, 10, 8, sAngle, eAngle, false)
                context.stroke()
                context.draw()
                strat_num++
                that.canvas()
            }, 50)
        } else {
            this.showDiago();
        }
    },

    //显示警告弹出框
    showDiago: function () {
        this.warningDiago = this.selectComponent("#warningDiago");
        this.warningDiago.show();
        var that = this;
        setTimeout(function () {
            that.warningDiago.end();
        }, 3000);
    },

    //点击发音的方法
    playYinPing:function(e){
        var fayinState=this.data.fayinState;
        var changeState=(fayinState==1)?2:1;
        this.setData({
            fayinState: changeState
        });
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var totalSec = parseInt(options.totalSec)-1;
      var min = parseInt(totalSec / 60);
      if (min < 10) {
          var min = "0" + min;
      }
      var sec = totalSec - min * 60;
      if (sec < 10) {
          var sec = "0" + sec;
      }
      this.setData({
          steadTime: min+":"+sec
      });
      var time = totalSec;
      var that = this;
      var int = setInterval(function () {
          if (time < 1) {
              clearInterval(int);
          } else {
              var nextTime = common.timeOut(time);
              that.setData({
                  steadTime: nextTime
              });
              time--;
          }
      }, 1000);
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
      strat_num = 1;
      this.canvas();
      
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
        wx.reLaunch({
            url: '/pages/success/index'
        })
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
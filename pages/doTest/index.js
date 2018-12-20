// pages/doTest/index.js
var strat_num = 1, end_num = 100,staticNumber=400;//画圆环的开始值和结束值(20*x秒)
var sAngle = 1.5 * Math.PI, eAngle = 0;
var common = require('../../common/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
      fayinState: 1,//用来判断是否点击发音图标的按钮1：未点击，2：点击
      clickAnswer:false,//用来判断是否点击了选项false:没有点击，true：点击了
      steadTime:5,//专注时间
      answerList:[
          {index:0, content: '暗杀卡时间发货是开发就爱看是否',flag:0,state:false},
          { index: 1, content: '按时发卡上了房间开爱上了', flag: 0, state: false},
          { index: 2, content: '暗示法开始放假后', flag: 1, state: false },
          { index: 3,content: '更多反馈的福利', flag: 0, state: false },
          { index: 4,content: '放寒假的路费回家地方来开会决定离开', flag: 0, state: false},
      ],//答案列表用来显示选项{content:选项内容，flag:是否为正确答案(0:错误，1：正确),state:判断是否显示}
  },
    
    //点击发音的方法
    playYinPing: function (e) {
        this.audioCtx.seek(0);
        this.audioCtx.play();
        this.setData({
            fayinState: 2
        });
    },

    //音频播放结束
    playEnd:function(){
        this.setData({
            fayinState: 1
        });
    },

    //画圆环
    canvas: function () {
        var context = new wx.createCanvasContext('canvasid', this);//用来捕获页面中Canvas
        var that = this;
        if (strat_num <= end_num) {
            eAngle = strat_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
            setTimeout(function () {
                context.setStrokeStyle("#4395ff")
                context.setLineWidth(4)
                context.fillText(strat_num * 1 <= 100 ? strat_num * 1 : 100, 95, 95)
                context.arc(15,10, 8, sAngle, eAngle, false)
                context.stroke()
                context.draw()
                strat_num++
                
                that.canvas()
            }, 50)
        } else {
            if (end_num>=100){
                var that = this;
                var answerList = that.data.answerList;
                for (var i = 0; i < answerList.length; i++) {
                    answerList[i]['state'] = true;
                }
                that.setData({
                    clickAnswer: true,
                    answerList: answerList
                });
            }
            
            var steadTimeStr = this.data.steadTime;
            var steadTimeTemp=steadTimeStr.split(":");
            var totalSec = parseInt(steadTimeTemp[0]*60)+parseInt(steadTimeTemp[1]);
            
            /**
             * setTimeout(function () {
                wx.redirectTo({
                    url: '/pages/jiexi/index?totalSec=' + totalSec,
                })
            }, 500);
            */
            
        }
    },

  

    //点击选项的方法
    answerQuestion:function(e){
        var clickAnswer = this.data.clickAnswer;
        if (!clickAnswer){
            //答题状态修改为已答题
            this.setData({
                clickAnswer: true
            });
            //修改点击选项的状态
            var index=e.currentTarget.dataset.index;
            var answerList=this.data.answerList;
            answerList[index]['state']=true;
            
            //显示正确答案
            if(answerList[index]['flag']!=1){
                for(var i=0;i<answerList.length;i++){
                    if(answerList[i]['flag']==1){
                        answerList[i]['state']=true;
                    }
                }
            }

            this.setData({
                answerList: answerList
            });
            
            end_num=strat_num;
        }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          steadTime: options.time+":00"
      });
      var time = parseInt(options.time)*60;
      var that=this;
      var int = setInterval(function(){
          if(time<1){
              clearInterval(int);
          }else{
              var nextTime = common.timeOut(time);
              that.setData({
                  steadTime: nextTime
              });
              time--;
          }
      },1000);
      strat_num=1;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      
      this.audioCtx = wx.createAudioContext('myAudio');
      this.canvas();
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
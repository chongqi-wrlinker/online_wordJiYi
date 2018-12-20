// pages/doTest/index.js
var strat_num = 1, end_num = 100, staticNumber = 80 * 5;//画圆环的开始值和结束值(80*x秒)
var sAngle = 1.5 * Math.PI, eAngle = 0;
var common = require('../../common/url.js');
var commonFun=require("../../common/common.js");
var timeOut;
var runTimeObj;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        actionSheetItems: ['拼写错误', '发音不准', '解析错误'],
        actionSheetHidden: true,
        canvasSheetHidden: false,
        wordId: "",
        numberOfAnswers: 1,//用户已经做了几道题了？
        wordAnswerCount: 0,//记录连对或者连错的次数
        fayinState: 1,//用来判断是否点击发音图标的按钮1：未点击，2：点击
        wordInfo: [],
        wordCount: "",//总检测数
        finishState: true,//判断是否已经答完题了
        clickState: 1,//判断用户是否已经打完该题，防止用户重复点击
        rightCount:0,//用户的正确率,
        rightScore:"0%",
        runTime:"00:00",//挑战耗时
        logAnswer:[],//记录用户回答错误或者正确数据
    },
    //点击报错出现的sheet
    actionSheetTap: function (e) {
        
        //停止画圈的方法
        end_num = strat_num;
        this.setData({
            canvasSheetHidden: !this.data.canvasSheetHidden,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    //点击取消的方法
    actionSheetChange: function (e) {
        end_num = 100;
        this.canvas();
        this.setData({
            canvasSheetHidden: !this.data.canvasSheetHidden,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    //点击sheet中的某个选项的方法
    bindItem: function (e) {
        var content = e.target.dataset.item;
        this.saveBaoCuoData(content);
        this.setData({
            canvasSheetHidden: !this.data.canvasSheetHidden,
            actionSheetHidden: !this.data.actionSheetHidden
        })
        end_num = 100;
        this.canvas();
    },

    //把报错的数据保存在数据库中
    saveBaoCuoData:function(content){
        
        var userID=wx.getStorageSync("userID");
        var wordID = this.data.wordId;
        wx.request({
            url: common.dealBaoCuo(),
            data:{type:"add",userID:userID,wordID:wordID,content:content},
            success:function(e){
                wx.showToast({
                    title: '处理成功',
                    icon: "none"
                })
            }
        })
    },

    //点击发音的方法
    playYinPing: function (e) {
        const innerAudioContext = wx.createInnerAudioContext('myAudio');
        innerAudioContext.autoplay = true
        innerAudioContext.mixWithOther = false
        innerAudioContext.src = this.data.wordInfo.wordMp3;
        var that = this;
        innerAudioContext.onPlay(() => {
            that.setData({
                fayinState: 2
            });
        });
        innerAudioContext.onEnded(() => {
            that.setData({
                fayinState: 1
            });
        });
    },
    //画圆环
    canvas: function () {
        var context = new wx.createCanvasContext('canvasid', this);//用来捕获页面中Canvas
        var that = this;
        if (strat_num <= end_num) {
            eAngle = strat_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
            timeOut = setTimeout(function () {
                context.setStrokeStyle("#4395ff")
                context.setLineWidth(4)
                context.fillText(strat_num * 1 <= 100 ? strat_num * 1 : 100, 95, 95)
                context.arc(15, 15, 12, sAngle, eAngle, false)
                context.stroke()
                context.draw()
                strat_num++
                that.canvas()
            }, 80)
        }else{
            console.log(1);
        }
    },
    //点击选项的方法
    answerQuestion: function (e) {
        if (this.data.clickState == 1) {
            end_num = strat_num;
            var flag = e.currentTarget.dataset.flag;
            var dom = "#boWen" + flag;
            this.boWen = this.selectComponent(dom);
            this.boWen.show(e);
            //处理显示正确或者错误答案的方法
            var index = parseInt(flag) - 1;
            var wordInfo = this.data.wordInfo;
            var optionList = wordInfo.optionList;
            var answerTheQuestion = 1;
            for (var i = 0; i < optionList.length; i++) {
                if (optionList[i]['optionFlag'] == 1) {
                    optionList[i]['optionState'] = "answerRight";
                } else if (i == index && optionList[i]['optionFlag'] != 1) {
                    answerTheQuestion = optionList[i]['optionFlag'];
                    optionList[i]['optionState'] = "answerWrong";
                } else {
                    optionList[i]['optionState'] = "answerDisable";
                }
            }
            wordInfo.optionList = optionList;
            this.setData({
                wordInfo: wordInfo,
                clickState: 2
            });
            //跳转到下一题的方法
            var that = this;
            this.jumpNextWord(answerTheQuestion);
        }
    },
    //点击选项后跳转到下一题的方法
    jumpNextWord: function (flag) {
        
        var wordAnswerCount = parseInt(this.data.wordAnswerCount);//连对或者连错的次数+对，-错
        var wordCount = this.data.wordCount;//总挑战数量
        
        
        if(flag==1){
            var rightCount = parseInt(this.data.rightCount) + 1;
            var rightScore = ((rightCount / wordCount) * 100).toFixed(2);
            this.setData({
                rightCount: rightCount,
                rightScore: rightScore + "%"
            });
        }
        //把用户答题数据记录下来
        var wordInfo=this.data.wordInfo;
        var logAnswer = this.data.logAnswer;
        logAnswer.push({ id: wordInfo['id'],flag:flag});
        this.setData({
            logAnswer: logAnswer
        });

        var numberOfAnswers = this.data.numberOfAnswers;
        numberOfAnswers = parseInt(numberOfAnswers) + 1;
        if (numberOfAnswers < parseInt(wordCount) + 1) {
            this.setData({
                numberOfAnswers: numberOfAnswers
            });
            this.getPageData();
            var jumpFlag = true;
        } else {
            //检测题目数量已达到
            var jumpFlag = false;
        }
        
        if (jumpFlag) {
            if (strat_num >= end_num) {
                strat_num = 1;
                end_num = 100;
                
            } else {
                strat_num = 1;
                end_num = 100;
            }
        } else {
            clearInterval(runTimeObj);
            //保存用户的词汇量具体数值
            var userID = wx.getStorageSync("userID");
            var runtime = this.data.runTime;
            var rightScore = this.data.rightScore;
            wx.request({
                url: common.dealUserTiaoZhan(),
                data: { type: "add", userID: userID, runtime: runtime, rightscore: rightScore, logAnswer: logAnswer },
                success: function (e) {
                    console.log(e);
                }
            })


            console.log("跳转到单词检测的结果页面");
        }
        this.setData({
            fayinState: 1,
            finishState: jumpFlag,
            canvasSheetHidden: !jumpFlag,
        });
    },
    //点击完成测试的按钮
    finishTest: function (e) {

        wx.navigateBack({

        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        strat_num = 1;
        end_num=100;
        this.getPageData();
        var that=this;
        runTimeObj=setInterval(function(){
            that.doRunTime();
        },1000);
    },
    //获取页面的参数
    getPageData: function () {
        var fuxiList=wx.getStorageSync("fuxiList");
        var numberOfAnswers = this.data.numberOfAnswers;
        var wordInfo = fuxiList[parseInt(numberOfAnswers)-1];
        wordInfo['optionList']=commonFun.getOptionListByTiaoZhan(wordInfo['id'], fuxiList);
        var that=this;
        wx.downloadFile({
            url: "https://dict.youdao.com/dictvoice?audio=" + wordInfo['word'] + "&type=1",
            success: function (res1) {

                
                wordInfo['wordMp3'] = res1.tempFilePath;
                that.setData({
                    wordInfo: wordInfo,
                    wordCount: fuxiList.length,
                    clickState: 1
                });
                that.playYinPing();
            }
        })
        
    },

    //处理运行时间的计数器
    doRunTime:function(){
        var runTime = this.data.runTime;
        var temp = runTime.split(":");
        var min = parseInt(temp[0]) * 60;
        var sec = min + parseInt(temp[1]) + 1;

        //转换成分钟和秒的格式ii:ss
        var finalMin = parseInt(sec / 60) < 10 ? "0" + parseInt(sec / 60) : parseInt(sec / 60);
        var finalSec = parseInt(sec % 60) < 10 ? "0" + parseInt(sec % 60) : parseInt(sec % 60);
        this.setData({
            runTime: finalMin + ":" + finalSec
        });
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
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
        clearTimeout(timeOut);
        if (this.data.finishState) {
            wx.showModal({
                title: '挑战异常提示',
                content: '您尚未完成该次挑战，这次挑战将不会保存',
                showCancel: false
            })
        } else {
            console.log("完成");
        }
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
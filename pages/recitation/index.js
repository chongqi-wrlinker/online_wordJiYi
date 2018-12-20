// pages/jiexi/index.js
var context = new wx.createCanvasContext('canvasid1', this);
const innerAudioContext1 = wx.createInnerAudioContext();
const innerAudioContext2= wx.createInnerAudioContext();
const innerAudioContext3 = wx.createInnerAudioContext();
var strat_num = 1, end_num = 100;//80*x秒
var sAngle = 1.5 * Math.PI, eAngle = 0;
var common = require('../../common/common.js');
var url = require('../../common/url.js');
var int;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showJiexi: 1,//1:不显示解析，2：显示解析
        clickState: 1,//判断用户是否点击了，1：未点击，2：点击
        answerOfQuestion: 0,//用户已经学习了词的数量
        fayinState: 1,
        fayinState1: 1,
        useTime:"",//用户已经完成的
        steadTime: "",//专注时长（倒计时）
        firstTime: "",//标记用户的专注时间，不变
        wordInfo: [],
        shengCi: [],//用来记录生词的id的------------------可以不要
       
        answerTime: 80,//80为答题，200为查看解析（倒计时圆圈的快慢）
        userAnswerState: 1,//用户回答该词是否正确,1:回答正确，2:回答错误
        showZouShen: 1,//1：关闭提示用户走绳，2：显示提示用户走神
        logAnswer:[],//记录用户回答的正确或者错误的json数组
        zhangWo:[],//记录用户已经掌握的单词数组
    },
    //画圆环
    canvas: function (flag) {
        var that = this;
        if (strat_num <= end_num) {
            var time = this.data.answerTime;
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
            }, time)
        } else if (strat_num == 101) {
            var showJieXi = that.data.showJiexi;
            if (showJieXi == 1) {
                //进入解析页面
                this.jumpToJieXi(5);
            } else {
                this.audioPlay();
                console.log("出现提示音");
                /**clearInterval(int);
                //提示用户走神
                var totalTime = parseInt(this.data.firstTime) * 60;
                var currentTime = this.data.steadTime;
                var tempTime = currentTime.split(":");
                var finalTime = totalTime - (parseInt(tempTime[0]) * 60) - (parseInt(tempTime[1]));
                var useTime = common.timeOut(finalTime);
                this.setData({
                    showZouShen: 2,
                    useTime: useTime
                });*/
            }
        }
    },

    audioPlay:  function () {
        var that=this;
        innerAudioContext3.startTime = 0;
        innerAudioContext3.play();
        innerAudioContext3.src = "/images/recitation/clock.mp3";
        

        

      },



    //点击发音的方法
    playYinPing: function (e) {
        if (this.data.fayinState == 1) {
            
            innerAudioContext1.startTime = 0;
            innerAudioContext1.play();
            innerAudioContext1.src = this.data.wordInfo.mp3;
            var that = this;
            innerAudioContext1.onPlay(() => {
                that.setData({
                    fayinState: 2
                });
            });
            innerAudioContext1.onEnded(() => {
                that.setData({
                    fayinState: 1
                });
            });
        } else {

        }

    },

    //点击例句的发音方法
    playLiJuVoice: function (e) {
        if (this.data.fayinState1 == 1) {
            innerAudioContext2.startTime = 0;
            innerAudioContext2.play();
            innerAudioContext2.src = "http://dict.youdao.com/dictvoice?audio=" + encodeURI(this.data.wordInfo.sentence[0]) + "&le=eng";
            var that = this;
            innerAudioContext2.onPlay(() => {
                that.setData({
                    fayinState1: 2
                });
            });
            innerAudioContext2.onEnded(() => {
                that.setData({
                    fayinState1: 1
                });
            });
        } else {
            wx.showToast({
                title: '正在播放，您的点击过于频繁',
                icon: "none"
            })
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
            //跳转到解析页面
            this.jumpToJieXi(index);
        }
    },

    //跳转到解析页面
    jumpToJieXi: function (index) {
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
        //跳转到详细信息页面的方法
        if (index == 5) {
            var finalUserAnswerState = 2;
        } else {
            var finalUserAnswerState = optionList[index]['optionFlag'];
        }

        //记录用户的回答单词正确或者错误情况
        this.writeLog(finalUserAnswerState);


        this.setData({
            wordInfo: wordInfo,
            clickState: 2,
            userAnswerState: finalUserAnswerState
        });
        var that = this;
        setTimeout(function () {
            that.setData({
                showJiexi: 2,
                answerTime: 200
            });
            strat_num = 1;
            end_num = 100;
            that.playYinPing();
            that.canvas();
        }, 500);
    },

    writeLog:function(flag){
        var logAnswer = this.data.logAnswer;
        var wordInfo=this.data.wordInfo;
        //去掉重复的数据
        var state=true;
        for(var i=0;i<logAnswer.length;i++){
            if(logAnswer[i]['id']==wordInfo['id']){
                logAnswer[i]['flag']=flag;
                if (flag==1){
                    logAnswer[i]['count'] = parseInt(logAnswer[i]['count'])+1;
                }else{
                    logAnswer[i]['count'] = (parseInt(logAnswer[i]['count']) - 3) > 0 ? parseInt(logAnswer[i]['count']) - 3:1;
                }
                state=false;
                break;
            }
        }
        if(state){
            if (flag == 1) {
                var count = parseInt(wordInfo['count']) + 1;
            } else {
                var count = (parseInt(wordInfo['count']) - 3) > 0 ? parseInt(wordInfo['count']) - 3 : 1;
            }
            logAnswer.push({ id: wordInfo['id'], flag: flag, count:count});
        }
        this.setData({
            logAnswer: logAnswer
        });
    },

    nextWord1:function(){},
    //点击继续背诵的方法
    nextWord: function (e) {
        end_num = strat_num;
        var showJiexi = 1;
        var clickState = 1;
        var answerTime = 80;
        var userAnswerState = this.data.userAnswerState;//回答正确获取错误
        if (userAnswerState == 1) {
            //回答正确（下一个单词）
            var count = parseInt(this.data.answerOfQuestion) + 1;
        } else {
            //回答错误（单词不变）
            var count = parseInt(this.data.answerOfQuestion);
        }
        
        this.setData({
            showJiexi: showJiexi,
            clickState: clickState,
            answerTime: answerTime,
            userAnswerState: 1,
            answerOfQuestion: count
        });
        //获取单词的随机选项列表(需要打乱)


        var wordList = wx.getStorageSync("wordList");
        wordList[count]['ukdes'] = wordList[count]['ukdes'].split("|");
        wordList[count]['sentence'] = wordList[count]['sentence'].split("|");

        //获取单词的随机选项列表
        var randomList = [].concat(wordList);

        var fianlOption = common.randomsort1(randomList, randomList[count]['id'], count);
        wordList[count]['optionList'] = fianlOption;
        this.setData({
            wordInfo: wordList[count],
        });
        var that = this;
        wx.downloadFile({
            url: "https://dict.youdao.com/dictvoice?audio=" + wordList[count]['word'] + "&type=1",
            success: function (res) {
                wordList[count]['mp3'] = res.tempFilePath;
                that.setData({
                    wordInfo: wordList[count],
                });
                that.playYinPing();
            }
        })
        strat_num = 1;
        end_num = 100;


    },
    //点击加入掌握的按钮
    enterZhangWo:function(e){
        var zhangWo = this.data.zhangWo;
        var wordInfo = this.data.wordInfo;

        //判断是否存在重复的数据
        var flag = true;
        for (var i = 0; i < zhangWo.length; i++) {
            if (zhangWo[i] == wordInfo['id']) {
                flag = false;
                break;
            }
        }
        if (flag) {
            zhangWo[zhangWo.length] = wordInfo['id'];
            console.log(zhangWo);
            wx.showToast({
                title: '成功加入掌握区',
                icon: "none"
            })
        } else {
            wx.showToast({
                title: '不能重复添加哟',
                icon: "none"
            })
        }
    },

    //点击加入生词的按钮
    enterShengCi: function (e) {
        var shengCi = this.data.shengCi;
        var wordInfo = this.data.wordInfo;

        //判断是否存在重复的数据
        var flag = true;
        for (var i = 0; i < shengCi.length; i++) {
            if (shengCi[i] == wordInfo['id']) {
                flag = false;
                break;
            }
        }
        if (flag) {
            shengCi[shengCi.length] = wordInfo['id'];
            wx.showToast({
                title: '成功加入生词本',
                icon: "none"
            })
        } else {
            wx.showToast({
                title: '不能重复添加哟',
                icon: "none"
            })
        }
    },

    //用户走神后继续背诵的方法
    continueWord: function (e) {
        var steadTime = this.data.steadTime;
        var temp = steadTime.split(":");
        var time = parseInt(temp[0]) * 60 + parseInt(temp[1]);
        var that=this;
        int = setInterval(function () {
            if (time < 0) {
                clearInterval(int);
                //跳转到专注时间完成的页面
                that.onUnload();
            } else {
                var nextTime = common.timeOut(time);
                that.setData({
                    steadTime: nextTime
                });
                time--;
            }
        }, 1000);


        this.setData({
            showZouShen: 1,
            answerTime: 80
        });
        this.nextWord(e);
        this.canvas();
    },

    //放弃专注背诵
    giveUp: function (e) {
        this.onUnload();
        wx.navigateBack({
            
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        innerAudioContext3.onEnded(() => {
            strat_num = 1;
            end_num = 100;
            that.setData({
                answerTime: 200
            });
            that.canvas();
        })
        strat_num=1;
        end_num=100;
        
        //设置倒计时
        if (parseInt(options.time) < 10) {
            var sec = "0" + options.time + ":00";
        } else {
            var sec = options.time + ":00";
        }
        this.setData({
            steadTime: sec,
            firstTime: options.time
        });
        var time = parseInt(options.time) * 60;
        var that = this;
        int = setInterval(function () {
            if (time < 0) {
                clearInterval(int);
                //跳转到专注时间完成的页面
                that.onUnload();
                wx.navigateBack({
                    
                })
            } else {
                var nextTime = common.timeOut(time);
                that.setData({
                    steadTime: nextTime
                });
                time--;
            }
        }, 1000);
        //获取未学习区的单词列表。
        var count = this.data.answerOfQuestion;
        var wordList = wx.getStorageSync("wordList");
        wx.downloadFile({
            url: "https://dict.youdao.com/dictvoice?audio=" + wordList[count]['word'] + "&type=1",
            success: function (res) {
                wordList[count]['ukdes'] = wordList[count]['ukdes'].split("|");
                wordList[count]['sentence'] = wordList[count]['sentence'].split("|");
                wordList[count]['mp3'] = res.tempFilePath;
                //获取单词的随机选项列表
                var randomList = [].concat(wordList);

                var fianlOption = common.randomsort1(randomList, randomList[count]['id'], count);
                wordList[count]['optionList'] = fianlOption;
                that.setData({
                    wordInfo: wordList[count],
                });
                that.playYinPing();
            }
        })
        this.canvas();

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
        clearInterval(int);
        var totalTime = parseInt(this.data.firstTime) * 60;
        var currentTime = this.data.steadTime;
        var tempTime = currentTime.split(":");
        var finalTime = totalTime - (parseInt(tempTime[0]) * 60) - (parseInt(tempTime[1]));
        //更新用户的学习单词数量和学习时间,把困难的单词加入生词本中
        var answerOfQuestion = this.data.answerOfQuestion;
        var zhangWo = this.data.zhangWo;
        var logAnswer = this.data.logAnswer;
        var userID = wx.getStorageSync("userID");
        var wordList = wx.getStorageSync("wordList");
        var maxID = wordList[wordList.length-1]['id'];
        
        strat_num=101;
        end_num=100;

        wx.request({
            url: url.updateUserInfo1(),
            data: { userID: userID, time: finalTime, count: answerOfQuestion, zhangWo: zhangWo.join("-"), logAnswer: logAnswer, maxID: maxID},
            success: function (e) {
                var showTime = common.timeOut(finalTime)
                wx.showToast({
                    title: '您的专注时间' + showTime+'，开始下一次专注吧',
                    icon:"none",
                    duration: 3000
                })
                
            }
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
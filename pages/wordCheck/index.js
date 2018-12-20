// pages/doTest/index.js
var strat_num = 1, end_num = 100, staticNumber =80*5;//画圆环的开始值和结束值(80*x秒)
var sAngle = 1.5 * Math.PI, eAngle = 0;
var common = require('../../common/url.js');
var commonFun=require("../../common/common.js");
var timeOut;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        actionSheetItems: ['拼写错误', '发音不准', '解析错误'],
        actionSheetHidden: true,
        canvasSheetHidden: false,
        wordId:"",
        numberOfAnswers:"",//用户已经做了几道题了？
        wordAnswerCount:0,//记录连对或者连错的次数
        fayinState: 1,//用来判断是否点击发音图标的按钮1：未点击，2：点击
        wordInfo:{
            word:"",//单词
            wordMp3:"",//mp3格式
            levelName: "",//单词的等级
            optionList:[],//选项列表
        },
        wordCount: "",//总检测数
        finishState:true,//判断是否已经答完题了
        clickState:1,//判断用户是否已经打完该题，防止用户重复点击
        fianlCount:0,//用户的检测结果
        waitTime:5,
        state:2,//用户是否为第一次检测，1：不是，2：是第一次词
        params:{},//用户回答正确或者错误的值
    },
    //点击报错出现的sheet
    actionSheetTap: function (e) {
        //停止画圈的方法
        end_num=strat_num;
        this.setData({
            canvasSheetHidden: !this.data.canvasSheetHidden,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    //点击取消的方法
    actionSheetChange:function(e){
        end_num=100;
        this.canvas();
        this.setData({
            canvasSheetHidden: !this.data.canvasSheetHidden,
            actionSheetHidden: !this.data.actionSheetHidden
        })
    },
    //点击sheet中的某个选项的方法
    bindItem:function(e){
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
    saveBaoCuoData: function (content) {
        var userID = wx.getStorageSync("userID");
        var wordID = this.data.wordId;
        wx.request({
            url: common.dealBaoCuo(),
            data: { type: "add", userID: userID, wordID: wordID, content: content },
            success: function (e) {
                wx.showToast({
                    title: '数据提交成功',
                    icon: "none"
                })
            }
        })
    },

    //点击发音的方法
    playYinPing: function (e) {
        const innerAudioContext = wx.createInnerAudioContext('myAudio');
        innerAudioContext.autoplay = true
        innerAudioContext.mixWithOther=false
        innerAudioContext.src = this.data.wordInfo.wordMp3;
        var that=this;
        innerAudioContext.onPlay(() => {
            that.setData({
                fayinState: 2
            });
        });
        innerAudioContext.onEnded(()=>{
            that.setData({
                fayinState: 1
            });
        });
    },
    //画圆环
    canvas: function () {
        var newTime = parseInt(this.data.waitTime)*16;
        var context = new wx.createCanvasContext('canvasid', this);//用来捕获页面中Canvas
        var that = this;
        if (strat_num <= end_num) {
            eAngle = strat_num * 2 * Math.PI / end_num + 1.5 * Math.PI;
            timeOut=setTimeout(function () {
                context.setStrokeStyle("#4395ff")
                context.setLineWidth(4)
                context.fillText(strat_num * 1 <= 100 ? strat_num * 1 : 100, 95, 95)
                context.arc(15, 15, 12, sAngle, eAngle, false)
                context.stroke()
                context.draw()
                strat_num++
                that.canvas()
            }, newTime)
        } else {
            //用户没有选择，自动判断为不会
            if (end_num==100){
                clearTimeout(timeOut);
                //一秒后跳转到下一题
                var wordInfo = this.data.wordInfo;
                var optionList = wordInfo.optionList;
               
                for (var i = 0; i < optionList.length; i++) {
                    if (optionList[i]['optionFlag'] == 1) {
                        optionList[i]['optionState'] = "answerRight";
                    } else {
                        optionList[i]['optionState'] = "answerDisable";
                    }
                }
                wordInfo.optionList = optionList;
                this.setData({
                    wordInfo: wordInfo,
                    clickState: 2
                });
                var that=this;
                that.jumpNextWord(2);
            }
        }
    },
    //点击选项的方法
    answerQuestion: function (e) {
        if (this.data.clickState==1){
            end_num=strat_num;
            var flag = e.currentTarget.dataset.flag;
            var dom = "#boWen" + flag;
            this.boWen = this.selectComponent(dom);
            this.boWen.show(e);
            //处理显示正确或者错误答案的方法
            var index = parseInt(flag) - 1;
            var wordInfo = this.data.wordInfo;
            var optionList = wordInfo.optionList;
            var answerTheQuestion=1;
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
            var that=this;
            that.jumpNextWord(answerTheQuestion);
        }
        
    },
    //点击选项后跳转到下一题的方法
    jumpNextWord: function (flag){
        var wordAnswerCount = parseInt(this.data.wordAnswerCount);//连对或者连错的次数+对，-错
        //单词的id
        var wordID = this.data.wordId;
        //获取系统设置的参数
        var systemConfig = wx.getStorageSync("systemConfig");
        var wordCheck = systemConfig['EnglishConfig']['wordCheck'];
        //计算新的单词id
        var config=this.data.params;
        var random = wordCheck['ramdomNumber']
        var finalWordId = commonFun.getStepNum(flag, wordID, config, random);
        var numberOfAnswers = wx.getStorageSync("numberOfAnswers");
        numberOfAnswers = parseInt(numberOfAnswers) + 1;
        var wordCount = this.data.wordCount;//总检测数量
        if (numberOfAnswers < parseInt(wordCount) + 1) {
            wx.setStorageSync("numberOfAnswers", numberOfAnswers);
            this.getPageData(finalWordId, wordAnswerCount);
            var jumpFlag = true;
        } else {
            //检测题目数量已达到
            var jumpFlag = false;
        }
        if (jumpFlag) {
            if (strat_num > end_num) {
                strat_num = 1;
                end_num = 100;
                this.canvas();
            } else {
                strat_num = 1;
                end_num = 100;
            }

        } else {
            //保存用户的词汇量具体数值
            var userID = wx.getStorageSync("userID");
            wx.request({
                url: common.dealUserCiHui(),
                data: { type: "add", userID: userID, number1: finalWordId },
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
            finalCount: finalWordId
        });
        

    },
    //点击完成测试的按钮
    finishTest:function(e){

        wx.navigateBack({
            
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        strat_num=1;
        end_num=100;
        //通过传过来的数值查询单词
        var id = options.id;//options.id
        var wordAnswerCount = options.wordAnswerCount;//options.wordAnswerCount
        var state = options.state;
        this.setData({
            state:state
        });
        this.getPageData(id, wordAnswerCount);
    },
    //获取页面的参数
    getPageData: function (id, wordAnswerCount){
        //获取系统的参数
        var systemConfig = wx.getStorageSync("systemConfig");
        var wordCheck = systemConfig['EnglishConfig']['wordCheck'];
        var numberOfAnswers = wx.getStorageSync("numberOfAnswers");//用户已经答题的数量
        //根据不同的阶段获取不同的参数值
        var state = this.data.state;
        var params = commonFun.getConfigParam(numberOfAnswers, wordCheck, state);
        this.setData({
            params: params
        });
        var that = this;
        wx.request({
            url: common.getWordInfo(),
            data: { id: id, answerCount: numberOfAnswers},
            success: function (res) {
                var wordInfo=res.data.wordInfo;
                wx.downloadFile({
                    url: "https://dict.youdao.com/dictvoice?audio=" + wordInfo[0]['word'] + "&type=1",
                    success:function(res1){
                        that.setData({
                            wordId: id,
                            wordInfo: {
                                word: wordInfo[0]['word'],
                                wordMp3: res1.tempFilePath,
                                levelName: wordInfo[0]['levelInfo']['levelname'],
                                optionList: optionList
                            },
                            wordAnswerCount: wordAnswerCount,
                            wordCount: wordCheck.questionCount,
                            numberOfAnswers: numberOfAnswers,
                            clickState: 1
                        });
                        that.playYinPing();
                    }
                })

                //处理选项答案列表

                var optionList = res.data.answerOptionList;
                for(var i=0;i<optionList.length;i++){
                    if(i==optionList.length-1){
                        optionList[i]['optionState'] = "answerDontKnow";
                    }else{
                        optionList[i]['optionState'] = "answerDefault";
                    }
                }
                optionList = commonFun.getOptionList(numberOfAnswers, state, optionList, wordCheck);
                console.log(optionList);
            }
        })
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
        console.log(1);
        if (this.data.finishState){
            wx.showModal({
                title: '检测异常提示',
                content: '您尚未完成该次检测，这次检测将不会保存',
                showCancel:false
            })
        }else{
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
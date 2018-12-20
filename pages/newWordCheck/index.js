// pages/doTest/index.js
var strat_num = 1, end_num = 100, staticNumber = 80 * 5;//画圆环的开始值和结束值(80*x秒)
var sAngle = 1.5 * Math.PI, eAngle = 0;
var common = require('../../common/url.js');
var timeOut;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        actionSheetItems: ['拼写错误', '发音不准', '解析错误'],
        actionSheetHidden: true,
        canvasSheetHidden: false,
        numberOfAnswers: 0,//用户已经做了几道题了？
        fayinState: 1,//用来判断是否点击发音图标的按钮1：未点击，2：点击
        wordInfo: {
            wordID:"",
            word: "",//单词
            wordMp3: "",//mp3格式
            optionList: [
                { optionState: "answerDefault", optionFlag: 1, optionContent:"1241"},
                { optionState: "answerDefault", optionFlag: 2, optionContent: "1241" },
                { optionState: "answerDefault", optionFlag: 2, optionContent: "1241" },
                { optionState: "answerDefault", optionFlag: 2, optionContent: "1241" },
                { optionState: "answerDefault", optionFlag: 2, optionContent: "1241" },
            ],//选项列表
        },
        clickState: 1,//判断用户是否已经打完该题，防止用户重复点击
        answerOfQuestionList:[]
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
    saveBaoCuoData: function (content) {
        var userID = wx.getStorageSync("userID");
        var wordID = this.data.wordInfo.wordID;
        wx.request({
            url: common.dealBaoCuo(),
            data: { type: "add", userID: userID, wordID: wordID, content: content },
            success: function (e) {
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
        } else {
            
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
            if(flag>optionList.length){
                var answerFlag=3;
            }else{
                var answerFlag = optionList[index]['optionFlag'];
            }
            
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
            var numberOfAnswers1 = parseInt(this.data.numberOfAnswers)+1;
            var answerOfQuestionList = this.data.answerOfQuestionList;
            answerOfQuestionList.push({ id: wordInfo.wordID, flag: answerFlag});
            this.setData({
                wordInfo: wordInfo,
                clickState: 2,
                numberOfAnswers: numberOfAnswers1,
                answerOfQuestionList: answerOfQuestionList,//flag:1,正确，2,错误
            });
            
            

            //跳转到下一题的方法
            var that = this;
            setTimeout(function () {
                that.jumpNextWord(answerTheQuestion);
            }, 500);
        }
    },
    //点击选项后跳转到下一题的方法
    jumpNextWord: function (flag) {
        var numberOfAnswers = this.data.numberOfAnswers;
        this.getPageData(numberOfAnswers);
        strat_num = 1;
        end_num = 100;
        this.canvas();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        strat_num = 1;
        
        //通过传过来的数值查询单词
        var numberOfAnswers = this.data.numberOfAnswers;
        this.getPageData(numberOfAnswers);
    },
    //获取页面的参数
    getPageData: function (num) {
        var wordList = wx.getStorageSync("newWordList");
        
        if (wordList.length>num){
            var wordInfo = wordList[num];
            //处理答案
            var optionList = this.dealAnswer(wordInfo.optionList);
            this.setData({
                wordInfo: {
                    wordID:wordInfo.id,
                    word: wordInfo.word,//单词
                    wordMp3: "http://dict.youdao.com/dictvoice?audio=" + wordInfo.word + "&type=1",//mp3格式
                    optionList: optionList,//选项列表
                },
                clickState: 1,
            });
            //填充页面数据
            this.playYinPing();
        }else{
            wx.showLoading({
                title: '正在加载单词...',
            })
            //把数据保存到数据库中，然后在取。
            var answerOfQuestionList = this.data.answerOfQuestionList;
            var userID=wx.getStorageSync("userID");
            var that=this;
            wx.request({
                url: common.dealShengCiData(),
                data: { type: "updateData", answerOfQuestionList: JSON.stringify(answerOfQuestionList), userID: userID},
                success:function(e){
                    wx.request({
                        url: common.dealShengCiData(),
                        data: { type: "getList", userID: userID },
                        success: function (e1) {
                            
                            if (e1.data.length > 0) {
                                //跳转到生词训练营
                                console.log(e1.data);
                                wx.setStorageSync("newWordList", e1.data);
                                that.setData({
                                    numberOfAnswers: 0,
                                    answerOfQuestionList: [],//flag:1,正确，2,错误
                                });
                                that.getPageData(0);
                            }
                            wx.hideLoading();
                        }
                    })
                }
            })
        }
    },

    //处理答案格式
    dealAnswer:function(list){
        var optionList=[];
        for(var i=0;i<list.length;i++){
            optionList.push({ optionState: "answerDefault", optionFlag: list[i]['optionFlag'], optionContent: list[i]['optionContent'] },);
        }
        return optionList;
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
        //把用户已经训练的词更新到数据库中去
        //把数据保存到数据库中，然后在取。
        var answerOfQuestionList = this.data.answerOfQuestionList;
        if(answerOfQuestionList.length>0){
            var userID = wx.getStorageSync("userID");
            wx.request({
                url: common.dealShengCiData(),
                data: { type: "updateData", answerOfQuestionList: JSON.stringify(answerOfQuestionList), userID: userID },
                success: function (e) {
                    console.log(e);
                }
            })
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
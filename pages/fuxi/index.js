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
        wordId: "",
        numberOfAnswers: 0,//用户已经做了几道题了？
        totalCount:1,//总数
        fayinState: 1,//用来判断是否点击发音图标的按钮1：未点击，2：点击
        wordInfo: {
            id:"",
            word: "boyd",//单词
            wordMp3: "",//mp3格式
            optionList: [],//选项列表
        },
        wordCount: "",//总检测数
        finishState: true,//判断是否已经答完题了
        clickState: 1,//判断用户是否已经打完该题，防止用户重复点击
        showState:1,
        wordList:[],//用户复习了的单词
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
        var wordID = this.data.wordInfo.id;
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
            //用户没有选择，自动判断为不会
            if (end_num == 100) {
                clearTimeout(timeOut);
               
            }
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
            //当用户回答错误的时候，把该单词放入生词本中（生词本中如果有，就等同于在生词本回答答错）
            var answerState = optionList[index]['optionFlag'];
            if (answerState==2){
                var userID=wx.getStorageSync("userID");
                var wordID=wordInfo.id;
                wx.request({
                    url: common.dealShengCiData(),
                    data: { type: "addOneRow", userID: userID, wordID: wordID },
                    success:function(e){
                    }
                })
            }
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
            //把该题放入到复习表中去
            this.putInFuXi(wordInfo.id);

            //跳转到下一题的方法
            var that = this;
            this.jumpNextWord(answerTheQuestion);
        }

    },
    //点击选项后跳转到下一题的方法
    jumpNextWord: function (flag) {
        strat_num=1;
        end_num=100;
        var userID = wx.getStorageSync("userID");
        var index = this.data.numberOfAnswers
        this.getPageData(userID, index);
    },
    //点击完成测试的按钮
    finishTest: function (e) {

        wx.navigateBack({

        })
    },

    //当没有单词的时候，跳转到背诵页面
    jumpToBeiSong:function(e){
        wx.switchTab({
            url: '/pages/index/index',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        strat_num = 1;
        //通过传过来的数值查询单词
        var userID = wx.getStorageSync("userID");
        var index = this.data.numberOfAnswers;
        this.getPageData(userID, index);
        this.canvas();
    },
    //获取页面的参数
    getPageData: function (userID, index) {
        if(parseInt(index)<parseInt(this.data.totalCount)){
            //获取系统的参数
            strat_num = 1;
            end_num = 100;
            var that = this;
            wx.request({
                url: common.getFuXiWordList(),
                data: { userID: userID, index: index },
                success: function (res) {
                    console.log(res);
                    if (res.data.totalCount > 0) {
                        var showState = 1;
                        var wordInfo = res.data.wordInfo;
                        var optionList = res.data.answerOptionList;
                        for (var i = 0; i < optionList.length; i++) {
                            optionList[i]['optionState'] = "answerDefault";
                        }
                        var wordList = that.data.wordList;//记录用户复习了的单词
                        wordList.push({ wordID: wordInfo[0]['id'] });
                        that.setData({
                            wordInfo: {
                                id: wordInfo[0]['id'],
                                word: wordInfo[0]['word'],
                                wordMp3: "http://dict.youdao.com/dictvoice?audio=" + wordInfo[0]['word'] + "&type=1",
                                optionList: optionList
                            },
                            totalCount: res.data.totalCount,
                            numberOfAnswers: parseInt(index) + 1,
                            clickState: 1,
                            wordList: wordList
                        });
                        that.playYinPing();
                    } else {
                        var showState = 2;
                    }
                    that.setData({
                        showState: showState
                    });
                }
            })
            
        }else{
            wx.showModal({
                title: '复习提示框',
                content: '你的词库告急，去学习新的单词吧',
                showCancel:false,
            })
        }
       
    },

    //把单词放入复习表中去
    putInFuXi: function (wordID){
        //把用户复习过的单词保存到数据库中去
        var userID = wx.getStorageSync("userID");
        wx.request({
            url: common.dealFuXiData(),
            data: { type: "add", wordID: wordID, userID: userID },
            success: function (res) {
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
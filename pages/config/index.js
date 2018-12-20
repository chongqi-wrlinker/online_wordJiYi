// pages/config/index.js
var url = require("../../common/url.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        timeNumber: [],
        questionRule: "",
        changeNum: 5,
        showtck: false,
    },
    showtck: function (e) {
        var that = this;
        that.setData({
            showtck: true,
        });
    },
    guanbi: function (e) {
        var that = this;
        that.setData({
            showtck: false,
        });
    },
    //选中某个时间的点击方法
    selectTime: function (e) {
        var index = e.currentTarget.dataset.index;
        var timeNumber = this.data.timeNumber;
        for (var i = 0; i < timeNumber.length; i++) {
            timeNumber[i]['flag'] = false;
        }
        timeNumber[index]['flag'] = true;
        this.setData({
            timeNumber: timeNumber
        });
    },

    /**跳转到背诵页面*/
    goToDoTest: function (e) {
        var timeNumber = this.data.timeNumber;
        var selectTime = 0;
        for (var i = 0; i < timeNumber.length; i++) {
            if (timeNumber[i]['flag'] == true) {
                selectTime = timeNumber[i]['number'];
            }
        }
        //获取所有的需要学习的生词记录
        var userID = wx.getStorageSync("userID");

        wx.request({
            url: url.newToShengCi(),
            data: {  userID: userID },
            success: function (e) {
                var wordList = e.data;
                for (var i = 0; i < wordList.length; i++) {
                    var tempdes = wordList[i]['ukdes'].replace(/\.(.*?)[\u4e00-\u9fa5](.*?)*[\u4e00-\u9fa5]?/, " ");
                    wordList[i]['ukdes'] = tempdes;
                }
                wx.setStorageSync("wordList", wordList);
                wx.navigateTo({
                    url: '/pages/recitation/index?time=' + selectTime,
                })
            }
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var systemConfig = wx.getStorageSync("systemConfig");
        var focusTime = systemConfig['EnglishConfig']['focusTime'];
        var timeNumber = [];
        var begin = focusTime.begin;
        var temp = focusTime.temp;
        for (var i = 0; i < focusTime.count; i++) {
            var numberTemp = parseInt(begin) + i * parseInt(temp);
            if (i ==2) {
                timeNumber.push({ number: numberTemp, flag: true });
            } else {
                timeNumber.push({ number: numberTemp, flag: false });
            }

        }
        var questionRule = systemConfig['EnglishConfig']['answerQuest']['questionRule'];
        this.setData({
            timeNumber: timeNumber,
            questionRule: questionRule
        });
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
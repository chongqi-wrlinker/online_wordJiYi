// pages/paihangbang/index.js
var sliderWidth = 96; 
var url=require("../../common/url.js");
Page({

  /**
   * 页面的初始数据
   */
    data: {
        tabs: ["学习词汇排行", "学习时间排行", "挑战排行榜"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        timeList: [], 
        countList:[],
        tiaoZhanList:[],
        wo:{
            countInfo:[],
            timeInfo:[],
            tiaozhanInfo:"",
        },//这是当前用户的排名详细信息
        showLoadIngIcon: false,//显示加载图标
        pageData:{
            countPage:{
                currentPage:1,
                totalPage:""
            },
            timePage: {
                currentPage: 1,
                totalPage: ""
            },
            tiaozhanPage: {
                currentPage: 1,
                totalPage: ""
            },
        }
    },
    onLoad: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });

        //获取学习词汇排行榜
        var userID=wx.getStorageSync("userID");
        //var userID=30;
        var that=this;
        wx.request({
            url: url.getFirstPageData(),
            data:{page:1,userID:userID},
            success:function(res){
                console.log(res);
                var paiXuList=res.data.paiXuList;
                var woSortInfo = res.data.woSortInfo;
                var pageData=res.data.pageData;
               that.setData({
                   timeList: paiXuList.timeList,
                   countList: paiXuList.countList,
                   tiaoZhanList: paiXuList.tiaoZhan,
                   wo: {
                       countInfo: woSortInfo.countInfo,
                       timeInfo: woSortInfo.timeInfo,
                       tiaozhanInfo: woSortInfo.tiaozhanInfo.score ? woSortInfo.tiaozhanInfo:false,
                   },
                   pageData: {
                       countPage: {
                           currentPage: 1,
                           totalPage: pageData.countTotalPage
                       },
                       timePage: {
                           currentPage: 1,
                           totalPage: pageData.timeTotalPage
                       },
                       tiaozhanPage: {
                           currentPage: 1,
                           totalPage: pageData.tiaozhanTotalPage
                       },
                   }
               });
               
            }
        })
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
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
      
      //获取下一页的数据
      if (this.data.activeIndex<1){
          var type="count";
          var page = parseInt(this.data.pageData.countPage.currentPage)+1;
          //判断是否为最后一页。
          if (page > this.data.pageData.countPage.totalPage){
              var flag=false;
          }else{
              var flag=true;
          }
          var oldData = this.data.countList;
      } else if (this.data.activeIndex == 1){
          var type="time";
          var page = parseInt(this.data.pageData.timePage.currentPage) + 1;
          if (page > this.data.pageData.timePage.totalPage) {
              var flag = false;
          } else {
              var flag = true;
          }
          var oldData = this.data.timeList;
      } else if (this.data.activeIndex ==2){
          var type = "tiaozhan";
          var page = parseInt(this.data.pageData.tiaozhanPage.currentPage) + 1;
          if (page > this.data.pageData.tiaozhanPage.totalPage) {
              var flag = false;
          } else {
              var flag = true;
          }
          var oldData = this.data.tiaoZhanList;
      }
      if(flag){
          console.log(1);
          //显示等待图标
          this.setData({
              showLoadIngIcon: true,
          });
          var that = this;
          setTimeout(function(){
              
              wx.request({
                  url: url.getPaiHangBangList(),
                  data: { type: type, page: page },
                  success: function (res) {
                      var finalData = oldData.concat(res.data);
                      if (that.data.activeIndex < 1) {
                          that.setData({
                              showLoadIngIcon: false,
                              countList: finalData,
                              pageData: {
                                  countPage: {
                                      currentPage: page,
                                      totalPage: that.data.pageData.countPage.totalPage
                                  },
                                  timePage: {
                                      currentPage: that.data.pageData.timePage.currentPage,
                                      totalPage: that.data.pageData.timePage.totalPage
                                  },
                                  tiaozhanPage: {
                                      currentPage: that.data.pageData.tiaozhanPage.currentPage,
                                      totalPage: that.data.pageData.tiaozhanPage.totalPage
                                  },
                              }
                          });
                      } else if (that.data.activeIndex == 1) {
                          that.setData({
                              showLoadIngIcon: false,
                              timeList: finalData,
                              pageData: {
                                  countPage: {
                                      currentPage: that.data.pageData.countPage.currentPage,
                                      totalPage: that.data.pageData.countPage.totalPage
                                  },
                                  timePage: {
                                      currentPage: page,
                                      totalPage: that.data.pageData.timePage.totalPage
                                  },
                                  tiaozhanPage: {
                                      currentPage: that.data.pageData.tiaozhanPage.currentPage,
                                      totalPage: that.data.pageData.tiaozhanPage.totalPage
                                  },
                              }
                          });
                      } else if (that.data.activeIndex == 2) {
                          that.setData({
                              showLoadIngIcon: false,
                              tiaoZhanList: finalData,
                              pageData: {
                                  countPage: {
                                      currentPage: that.data.pageData.countPage.currentPage,
                                      totalPage: that.data.pageData.countPage.totalPage
                                  },
                                  timePage: {
                                      currentPage: that.data.pageData.timePage.currentPage,
                                      totalPage: that.data.pageData.timePage.totalPage
                                  },
                                  tiaozhanPage: {
                                      currentPage: page,
                                      totalPage: that.data.pageData.tiaozhanPage.totalPage
                                  },
                              }
                          });
                      }
                  }
              })
          },1000);
      }else{
          wx.showToast({
              title: '已经到底了',
              icon:"none"
          })
      }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
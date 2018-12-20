// components/boWen/boWen.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
        'dom': {
            type: String, //必填，目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: ""     //可选，默认值，如果页面没传值过来就会使用默认值
        },
  },

  /**
   * 组件的初始数据
   */
  data: {
      
      btnInfo: {
          showState: false,
          width: "",
          height: "",
          top: "",
          left: ""
      },
  },

  /**
   * 组件的方法列表
   */
  methods: {
      show:function(e){
          var query = wx.createSelectorQuery();
          //选择id
          var that = this;
          var pageData = e.detail;
          var pageOffset = e.currentTarget;
          var dom = "#" + this.data.dom;
          
          query.select(dom).boundingClientRect(function (rect) {
              
              var viewWidth = rect.width;
              var viewHeight = rect.height;
              var r = Math.max(viewWidth, viewHeight);
              var rippleX = parseInt(pageData.x - pageOffset.offsetLeft) - (r / 2);
              var rippleY = parseInt(pageData.y - pageOffset.offsetTop) - (r / 2);
              
              that.setData({
                  btnInfo: {
                      showState: true,
                      width: r + "px",
                      height: r + "px",
                      left: rippleX + "px",
                      top: rippleY + "px",
                  },
              });
              
          }).exec();
          
          setTimeout(function () {
              that.setData({
                  btnInfo: {
                      showState: false,
                  },
              })
          }, 600);
      }
  }
})

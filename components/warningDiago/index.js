// components/warningDiago/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      show:false,
      flag:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
      show:function(e){
          this.setData({
              show:true
          });
      },
      end:function(e){
          this.setData({
              flag: true
          });
      },
      close:function(e){
          this.setData({
              show: false
          });
      }
  }
})

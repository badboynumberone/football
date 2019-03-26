import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true,
      bannerId:null,
      bannerDetail:{}
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      this.setData({
        bannerId:options.bannerId
      })
      this.getData();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    
    getData(){
      let that = this;
      requestTest("/banner/getInfo",{method:"POST",data:{
        id:this.data.bannerId
      }}).then(function(res){
        if(res){
          that.setData({
            bannerDetail:res
          })
        }
      }).catch(function(err){
        console.log("数据获取失败")
        wx.showToast({
          title: '页面加载失败请稍后重试',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      })
    }
  })
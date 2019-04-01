import {requestTest} from '../../../utils/request';
//index.js


Page({
  data: {
    isLoading:false,//是否正在加载
    isrefresh:false,//是否正在刷新
    bannerInfo:[],//导航栏信息
    navIndex:0,//导航地址
    isrefresh:false,//刷新控制
    pageInfo:[{dynaicInfo:[],nowPageIndex:1,totalPage:1,totalSize:0,bottomFont:'Loading'},
              {dynaicInfo:[],nowPageIndex:1,totalPage:1,totalSize:0,bottomFont:'Loading'},
              {dynaicInfo:[],nowPageIndex:1,totalPage:1,totalSize:0,bottomFont:'Loading'},
              {dynaicInfo:[],nowPageIndex:1,totalPage:1,totalSize:0,bottomFont:'Loading'}]//分页信息
  },
  onLoad(){
    this.initData();
  },
  //搜索栏跳转
  toSearch(){
    wx.navigateTo({
      url: "/pages/index/search/search"
    });
  },
  //banner页面跳转
  navigateTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.item+"?bannerId="+e.currentTarget.dataset.type
    });
  },
  //点击导航栏
  onChange(e){
    this.setData({
      navIndex:e.detail.index
    })
    this.getDynaicList(this.data.navIndex,1);
  },
  getDynaicList(index,pageNo,pageSize=6){
    let that = this;
    requestTest("/appIndex/pageList",{method:"POST",data:{
      type:index+1,
      pageNo:pageNo,
      pageSize
    }}).then(function(res){
      that.setData({
        ["pageInfo["+that.data.navIndex+"].dynaicInfo"]:that.data.pageInfo[that.data.navIndex].dynaicInfo.concat(res.dataList),
        ["pageInfo["+index+"].totalPage"]:res.totalPage,
        ["pageInfo["+index+"].totalSize"]:res.totalSize
      })
      if(!that.data.pageInfo[that.data.navIndex].dynaicInfo.length){
        that.setData({
          ['pageInfo['+that.data.navIndex+"].bottomFont"]:'~NOTHING~'
        })
      }
      console.log(that.data.pageInfo[that.data.navIndex].nowPageIndex)
      if(that.data.pageInfo[that.data.navIndex].nowPageIndex >=that.data.pageInfo[that.data.navIndex].totalPage){
        that.setData({
          ['pageInfo['+that.data.navIndex+"].bottomFont"]:'~THE ENDING~'
        })
      }
    }).catch(function(err){
      wx.showToast({
        title: '加载失败请稍后重试！',icon: 'none',duration: 1500,mask: false,
      });
      return;
    }) 
  },
  //初始化数据
  initData(){
    //获取首页轮播图
    this.getBanner();
    //获取列表
    this.getDynaicList(0,1);
  },
  getBanner(){
    //获取首页轮播图
    let that =this;
    requestTest("/banner/getList",{method:"POST"}).then(function(res){
      if(res){
         let result = res;
         that.setData({bannerInfo:result});
      }
    }).catch(function(err){
    })
  },
  //下拉刷新
  onPullDownRefresh(){
    if(this.data.isrefresh || this.data.isLoading){
      return;
    }
    this.getBanner();
    this.setData({
      ['pageInfo['+this.data.navIndex+"]"]:{dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0,bottomFont:'Loading'}
    })
    this.getDynaicList(this.data.navIndex,1);
    wx.stopPullDownRefresh();
  },
  //发布作品
  navigateToPublic(){
    wx.navigateTo({
      url: '/pages/index/public_works/public_works'
    });
  },
  //触底加载
  onReachBottom(){
    if(this.data.pageInfo[this.data.navIndex].bottomFont=="~THE ENDING~" || this.data.pageInfo[this.data.navIndex].bottomFont=="~NOTHING~"){
      return;
    }
    try{
      this.getDynaicList(this.data.navIndex+1,this.data.pageInfo[this.data.navIndex].nowPageIndex+1,6)
    }catch(e){
      return;
    }
    this.setData({
      ["pageInfo["+this.data.navIndex+"].nowPageIndex"]:this.data.pageInfo[this.data.navIndex].nowPageIndex+1
    })
  }
})

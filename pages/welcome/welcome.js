const config = require('../../utils/config.js');
const app = getApp();
Page({
  data: {
    icoPath: config.ICON_PATH,
    imgPath: config.IMAGE_PATH,

    imgs: [
      `${config.IMAGE_PATH}/welcome/1.jpg`,
      `${config.IMAGE_PATH}/welcome/2.jpg`,
      `${config.IMAGE_PATH}/welcome/3.jpg`,
    ],
    currentIndex: 0
  },

  onLoad: function (options) {
    this.loadFromCache();
    this.fetchAllConfigs();
  },

  processBusinessData(data) {
    if (data && data.segments) {
      data.segments.forEach(item => {
        if (item.en && item.en.length > 0) {
          item.scale = (13 / item.en.length).toFixed(2);
        } else {
          item.scale = 1;
        }
      });
    }
    return data;
  },

  loadFromCache() {
    const tasks = {
      intro: 'intro.json',
      business: 'business.json',
      caseList: 'casestudy.json',
      contact: 'contact.json'
    };
    
    let cacheCount = 0;
    Object.keys(tasks).forEach(key => {
      // 这里的 key 对应 globalData 的字段名，存储时加个 cache_ 前缀区分
      const cachedData = wx.getStorageSync('cache_' + key);
      if (cachedData) {
        let finalData = cachedData;
        // 如果是 business 数据，需要重新计算 scale（因为我们存的是 raw json）
        if (key === 'business') {
          finalData = this.processBusinessData(cachedData);
        }
        app.globalData[key] = finalData;
        cacheCount++;
      }
    });

    if (cacheCount > 0) {
      console.log(`>>> [缓存] 成功加载了 ${cacheCount} 个本地配置`);
      // 如果首页已经加载（极端情况），通知它更新
      if (app.configReadyCallback) {
        app.configReadyCallback();
      }
    }
  },
  fetchAllConfigs() {
    console.log('>>> [网络] 开始获取最新配置...');
    
    const tasks = {
      intro: 'intro.json',
      business: 'business.json',
      caseList: 'casestudy.json',
      contact: 'contact.json'
    };

    const promises = Object.keys(tasks).map(key => {
      return new Promise((resolve) => {
        wx.request({
          url: `${config.CONFIG_PATH}/${tasks[key]}`,
          method: 'GET',
          success: (res) => {
            if (res.statusCode === 200) {
              wx.setStorageSync('cache_' + key, res.data);
              resolve({ key, data: res.data });
            } else {
              console.warn(`>>> [网络] 加载 ${tasks[key]} 异常: ${res.statusCode}`);
              resolve({ key, data: null });
            }
          },
          fail: (err) => {
            console.error(`>>> [网络] 加载 ${tasks[key]} 失败:`, err);
            resolve({ key, data: null });
          }
        });
      });
    });

    Promise.all(promises).then(results => {
      let hasUpdate = false;
      results.forEach(res => {
        if (res.data) {
          let finalData = res.data;
          if (res.key === 'business') {
             finalData = this.processBusinessData(finalData);
          }
          
          app.globalData[res.key] = finalData;
          hasUpdate = true;
        }
      });
      
      console.log('>>> [完成] 网络配置加载结束');
      
      if (hasUpdate && app.configReadyCallback) {
        console.log('>>> [通知] 触发首页数据刷新');
        app.configReadyCallback();
      }
    });
  },

  touchStartX: 0,
  touchStartIndex: 0,

  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },

  touchStart(e) {
    this.touchStartX = e.changedTouches[0].clientX;
    this.touchStartIndex = this.data.currentIndex;
  },

  touchEnd(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;
    if (this.touchStartIndex === this.data.imgs.length - 1 && diff > 50) {
      this.onSkip();
    }
  },

  onSkip() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
})
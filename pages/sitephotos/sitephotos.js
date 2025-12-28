const config = require('../../utils/config.js');
const app = getApp();
Page({
  data: {
    icoPath: config.ICON_PATH,
    imgPath: config.IMAGE_PATH,
    cfgPath: config.CONFIG_PATH,

    photos: []
  },

  onLoad(options) {
    const caseId = parseInt(options.id);
    const caseList = app.globalData.caseList;
    if (caseList && caseList.length > 0) {
      const currentCase = caseList.find(item => item.id === caseId);
      if (currentCase) {
        const bgImage = `${config.IMAGE_PATH}/casestudy/${currentCase.title}/overview.jpg`;
        let photos = [];
        if (currentCase.sitePhotos) {
          photos = currentCase.sitePhotos.map(path => {
            return `${config.IMAGE_PATH}/casestudy/${currentCase.title}/${path}`;
          });
        }
        this.setData({
          photos: photos,
          bgImage: bgImage
        });
      }
    }
  },

  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
})
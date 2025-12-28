const config = require('../../utils/config.js');
const app = getApp();
Page({
  data: {
    icoPath: config.ICON_PATH,
    imgPath: config.IMAGE_PATH,
    cfgPath: config.CONFIG_PATH,

    currentPageIndex: 0,
    isSwiping: false,
    currentCaseIndex: 0,
    isGoTopPressed: false,
    bgImageA: `${config.IMAGE_PATH}/bg.jpg`,
    bgImageB: '',
    bgModeA: 'aspectFill', 
    bgModeB: 'aspectFill',
    
    isCaseA: false,
    isCaseB: false,
    
    activeBg: 'A',
    
    intro: {},
    business: {},
    caseList: [],
    contactInfo: {},

    isPreviewing: false,
  },
  previewTimer: null,

  onLoad(options) {
    this.loadDataFromGlobal();
    app.configReadyCallback = () => {
      this.loadDataFromGlobal();
    };
  },

  loadDataFromGlobal() {
    const g = app.globalData;
    if (g.intro || g.business || g.caseList || g.contact) {
      this.setData({
        intro: g.intro || {},
        business: g.business || {},
        caseList: g.caseList || [],
        contactInfo: g.contact || {}
      });
      return true;
    }
    return false;
  },

  onSwiperChange(e) {
    if (e.detail.source === 'touch' || e.detail.source === 'autoplay') {
      const current = e.detail.current;
      this.updateBackground(current, this.data.currentCaseIndex);
      this.setData({
        currentPageIndex: current
      });

      if (current === 2) {
        this.restartPreviewTimer();
      } else {
        this.clearPreviewTimer();
      }
    }
  },

  onCaseChange(e) {
    if (e.detail.source === 'touch' || e.detail.source === 'autoplay') {
      const caseIndex = e.detail.current;
      this.setData({
        currentCaseIndex: caseIndex
      });
      if (this.data.currentPageIndex === 2) {
        this.updateBackground(2, caseIndex);
        this.restartPreviewTimer();
      }
    }
  },

  restartPreviewTimer() {
    this.clearPreviewTimer();
    this.setData({ isPreviewing: false });
    this.previewTimer = setTimeout(() => {
      this.setData({ isPreviewing: true });
    }, 6000);
  },
  clearPreviewTimer() {
    if (this.previewTimer) {
      clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    this.setData({ isPreviewing: false });
  },

  updateBackground(pageIndex, caseIndex) {
    let defaultBg = `${config.IMAGE_PATH}/bg.jpg`;
    let targetBg = defaultBg;
    let targetMode = 'aspectFill';
    
    const isCasePage = (pageIndex === 2);

    if (isCasePage) {
      if (this.data.caseList && this.data.caseList[caseIndex]) {
        const item = this.data.caseList[caseIndex];
        let imgPath = `${config.IMAGE_PATH}/casestudy/${item.title}/overview.jpg`; 
        if (!imgPath) {
          if (item.sitePhotos && item.sitePhotos.length > 0) {
            imgPath = `${config.IMAGE_PATH}/casestudy/${item.sitePhotos[0]}`;
          } else {
            imgPath = defaultBg;
          }
        }
        targetBg = imgPath;
        targetMode = 'aspectFit';
      }
      console.info(`targetBg = ${targetBg}`);
    } 
    const isActiveA = this.data.activeBg === 'A';
    const currentSrc = isActiveA ? this.data.bgImageA : this.data.bgImageB;
    if (currentSrc === targetBg) return;
    if (isActiveA) {
      this.setData({
        bgImageB: targetBg,
        bgModeB: targetMode,
        isCaseB: isCasePage,
        activeBg: 'B'
      });
    } else {
      this.setData({
        bgImageA: targetBg,
        bgModeA: targetMode,
        isCaseA: isCasePage,
        activeBg: 'A'
      });
    }
  },

  onSwiperTransition(e) {
    if (!this.data.isSwiping) {
      this.setData({ isSwiping: true });
    }
  },
  onSwiperAnimationFinish(e) {
    if (this.data.isSwiping) {
      this.setData({ isSwiping: false });
    }
  },
  goTop() {
    this.setData({
      currentPageIndex: 0
    });
  },
  onGoTopStart() {
    this.setData({ isGoTopPressed: true });
  },
  onGoTopEnd() {
    this.setData({ isGoTopPressed: false });
  },
  goToContact() {
    wx.reLaunch({
      url: '/pages/contact/contact'
    })
  },
  goToSitePhotos() {
    if (this.data.caseList && this.data.caseList.length > 0) {
        const currentCaseId = this.data.caseList[this.data.currentCaseIndex].id;
        wx.navigateTo({
          url: `/pages/sitephotos/sitephotos?id=${currentCaseId}`
        });
    }
  }
})
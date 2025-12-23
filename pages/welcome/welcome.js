// pages/welcome/welcome.js
Page({
  data: {
    imgs: [
      'https://img.pixos.dpdns.org/welcome/1.jpg',
      'https://img.pixos.dpdns.org/welcome/2.jpg',
      'https://img.pixos.dpdns.org/welcome/3.jpg',
    ],
    currentIndex: 0
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
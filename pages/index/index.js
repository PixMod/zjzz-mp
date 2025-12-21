Page({
  data: {
    currentIndex: 0,
    bgImage: '/images/bg1.png'
  },

  onSwiperChange(e) {
    const current = e.detail.current;
    let bg = '/images/bg1.png';
    
    // 根据Web逻辑，第三页(index=2)用bg2，其他用bg1
    if (current === 2) {
      bg = '/images/bg2.png';
    }

    this.setData({
      currentIndex: current,
      bgImage: bg
    });
  },

  goToContact() {
    wx.reLaunch({
      url: '/pages/contact/contact',
      fail: (err) => {
        console.error("跳转失败，请检查路径:", err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    })
  }
})
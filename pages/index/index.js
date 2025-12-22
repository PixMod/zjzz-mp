Page({
  data: {
    currentPageIndex: 0,
    isSwiping: false,
    currentCaseIndex: 0,
    isGoTopPressed: false,
    bgImageA: '/images/bg.png',
    bgImageB: '',
    activeBg: 'A',
    caseList: [
      {
        id: 0,
        title: '白马湖实验室项目',
        bg: '/images/casestudy-1.jpg',
        items: [
          '进场设备：地面整平机器人',
          '应用场景：混凝土地面工程；混凝土整平',
          '机器人施工：地面整平机器人施工面积 70955.53m²'
        ]
      },
      {
        id: 1,
        title: '浙江中医药大学',
        bg: '/images/casestudy-2.jpg', 
        items: [
          '进场设备：地坪研磨机器人',
          '应用场景：地面混凝土工程；金刚砂地坪研磨',
          '机器人施工：地坪研磨机器人施工面积 24431.15m²'
        ]
      },
      {
        id: 2,
        title: '浙能集团综合能源生产调度研发中心',
        bg: '/images/casestudy-3.jpg',
        items: [
          '进进场设备：地坪涂覆机器人、地坪研磨机器人',
          '应用场景：混凝土地面工程；地坪漆通刷及破损地坪研磨',
          '机器人施工：地坪涂敷机器人施工面积 4490.00m²'
        ]
      },
      {
        id: 3,
        title: '中国建设银行浙江省分行档案数据中心',
        bg: '/images/casestudy-4.jpg',
        items: [
          '进场设备：抹灰机器人、室内喷涂机器人',
          '应用场景：墙面工程；内墙粉刷、内墙及天花板腻子喷涂',
          '机器人施工：粉刷施工面积 355640.7²'
        ]
      }
    ]
  },

  onSwiperChange(e) {
    if (e.detail.source === 'touch' || e.detail.source === 'autoplay') {
      const current = e.detail.current;
      this.updateBackground(current, this.data.currentCaseIndex);
      this.setData({
        currentPageIndex: current
      });
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
      }
    }
  },

  updateBackground(pageIndex, caseIndex) {
    let targetBg = '/images/bg.png';
    if (pageIndex === 2) {
      targetBg = this.data.caseList[caseIndex].bg;
    } 
    const currentSrc = this.data.activeBg === 'A' ? this.data.bgImageA : this.data.bgImageB;
    if (currentSrc === targetBg) return;
    if (this.data.activeBg === 'A') {
      this.setData({
        bgImageB: targetBg,
        activeBg: 'B'
      });
    } else {
      this.setData({
        bgImageA: targetBg,
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
      url: '/pages/contact/contact',
      fail: (err) => {
        console.error("跳转失败，请检查路径:", err);
        wx.showToast({ title: '跳转失败', icon: 'none' });
      }
    })
  }
})
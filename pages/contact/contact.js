Page({
  data: {
    isHeaderHidden: false,
    name: '',
    phone: '',
    company: '',
    job: '',
    isSubmitting: false,
    coopOptions: [
      { title: '数字设计', desc: 'DIGITAL DESIGN', value: '数字设计', icon: '/images/digital-design.png', selected: false },
      { title: '智能生产', desc: 'INTELLIGENT PRODUCTION', value: '智能生产', icon: '/images/intelligent-production.png', selected: false },
      { title: '智能施工', desc: 'SMART CONSTRUCTION', value: '智能施工', icon: '/images/smart-construction.png', selected: false },
      { title: '智能运维', desc: 'INTELLIGENT O&M', value: '智能运维', icon: '/images/intelligent-o&m.png', selected: false }
    ]
  },

  onScroll(e) {
    // 只有scrollTop > 10才隐藏
    if (e.detail.scrollTop > 10) {
      if (!this.data.isHeaderHidden) this.setData({ isHeaderHidden: true });
    } else {
      if (this.data.isHeaderHidden) this.setData({ isHeaderHidden: false });
    }
  },

  toggleCoop(e) {
    const index = e.currentTarget.dataset.index;
    const key = `coopOptions[${index}].selected`;
    this.setData({
      [key]: !this.data.coopOptions[index].selected
    });
  },

  goToIndex() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  submitForm() {
    if (!this.data.name || !this.data.phone) {
      wx.showToast({ title: '请填写姓名和电话', icon: 'none' });
      return;
    }

    this.setData({ isSubmitting: true });

    const selectedCoops = this.data.coopOptions
        .filter(i => i.selected)
        .map(i => i.title);

    const content = `【小程序用户留言】\n姓名：${this.data.name}\n电话：${this.data.phone}\n公司：${this.data.company}\n职位：${this.data.job}\n意向：${selectedCoops.join(', ') || '无'}`;

    // 发送到你的 Cloudflare Worker 地址
    // 请确保该域名已在小程序后台配置了 request 合法域名
    wx.request({
      url: 'https://pixos.dpdns.org/api/submit', // 假设你将 Worker 部署在这个路径，根据你的实际 Worker URL 替换
      method: 'POST',
      data: { content: content },
      success: (res) => {
        wx.showModal({
          title: '提交成功',
          content: '我们会尽快与您联系！',
          showCancel: false,
          success: () => {
             // 重置表单
             this.setData({
                 name: '', phone: '', company: '', job: '',
                 coopOptions: this.data.coopOptions.map(i => ({...i, selected: false}))
             })
          }
        });
      },
      fail: (err) => {
        wx.showToast({ title: '提交失败，请重试', icon: 'none' });
        console.error(err);
      },
      complete: () => {
        this.setData({ isSubmitting: false });
      }
    });
  }
})
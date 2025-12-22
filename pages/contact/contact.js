Page({
  data: {
    isHeaderHidden: false,
    isSubmitting: false,
    name: '',
    phone: '',
    company: '',
    job: '',
    
    coopOptions: [
      { title: '数字设计', desc: 'DIGITAL DESIGN', value: '数字设计', icon: '/images/digital-design.png', selected: false, scale: 0.85 },
      { title: '智能生产', desc: 'INTELLIGENT PRODUCTION', value: '智能生产', icon: '/images/intelligent-production.png', selected: false, scale: 0.6 },
      { title: '智能施工', desc: 'SMART CONSTRUCTION', value: '智能施工', icon: '/images/smart-construction.png', selected: false, scale: 0.7 },
      { title: '智能运维', desc: 'INTELLIGENT O&M', value: '智能运维', icon: '/images/intelligent-o&m.png', selected: false, scale: 0.85 }
    ]
  },

  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    if (scrollTop > 10 && !this.data.isHeaderHidden) {
      this.setData({ isHeaderHidden: false });
    } else if (scrollTop <= 10 && this.data.isHeaderHidden) {
      this.setData({ isHeaderHidden: false });
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
    if (!this.data.name.trim()) {
      wx.showToast({ title: '请输入您的姓名', icon: 'none' });
      return;
    }
    if (!this.data.phone.trim()) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return;
    }
    const hasSelectedCoop = this.data.coopOptions.some(item => item.selected);
    if (!hasSelectedCoop) {
      wx.showToast({ title: '请选择合作方向', icon: 'none' });
      return;
    }

    this.setData({ isSubmitting: true });

    wx.showLoading({
      title: '正在提交...',
      mask: true
    });

    const selectedCoops = this.data.coopOptions
        .filter(item => item.selected)
        .map(item => item.title);
    const company = this.data.company.trim();
    const job = this.data.job.trim();
    const name = this.data.name.trim();
    let identity = '';
    if (company && job) {
      identity = `${company} 的 ${job} ${name}`;
    } else if (!company && job) {
        identity = `${job} ${name}`;
    } else if (company && !job) {
        identity = `${company} 的 ${name}`;
    } else {
        identity = `${name}`;
    }
    const content = `【浙建智造用户留言】\n许经理你好，我是 ${identity}，想与贵司就“${selectedCoops.join(', ')}”方向开展合作，有空请联系我：${this.data.phone} 🤝`;

    wx.request({
      url: 'https://pixos.dpdns.org/api/submit', 
      method: 'POST',
      data: { content: content },
      success: (res) => {
        wx.hideLoading();
        if (res.statusCode === 200) {
            wx.showModal({
                title: '提交成功',
                content: '我们会尽快与您联系！',
                showCancel: false,
                success: () => {
                    this.resetForm();
                }
            });
        } else {
             wx.showToast({ title: '服务异常，请重试', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error("提交失败", err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        this.setData({ isSubmitting: false });
      }
    });
  },

  resetForm() {
      this.setData({
          name: '', phone: '', company: '', job: '',
          coopOptions: this.data.coopOptions.map(i => ({...i, selected: false}))
      });
  }
})
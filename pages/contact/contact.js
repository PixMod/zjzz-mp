Page({
  data: {
    isHeaderHidden: false, // 控制顶部标题显隐
    isSubmitting: false,   // 提交防抖锁
    
    // 表单数据
    name: '',
    phone: '',
    company: '',
    job: '',
    
    // 合作选项配置
    coopOptions: [
      { title: '数字设计', desc: 'DIGITAL DESIGN', value: '数字设计', icon: '/images/digital-design.png', selected: false, scale: 0.85 },
      { title: '智能生产', desc: 'INTELLIGENT PRODUCTION', value: '智能生产', icon: '/images/intelligent-production.png', selected: false, scale: 0.5 },
      { title: '智能施工', desc: 'SMART CONSTRUCTION', value: '智能施工', icon: '/images/smart-construction.png', selected: false, scale: 0.7 },
      { title: '智能运维', desc: 'INTELLIGENT O&M', value: '智能运维', icon: '/images/intelligent-o&m.png', selected: false, scale: 0.85 }
    ]
  },

  // 1. 监听滚动，自动隐藏顶部 Header
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    // 阈值设为 10px (20rpx)
    if (scrollTop > 10 && !this.data.isHeaderHidden) {
      this.setData({ isHeaderHidden: true });
    } else if (scrollTop <= 10 && this.data.isHeaderHidden) {
      this.setData({ isHeaderHidden: false });
    }
  },

  // 2. 切换合作意向 (多选)
  toggleCoop(e) {
    const index = e.currentTarget.dataset.index;
    const key = `coopOptions[${index}].selected`;
    this.setData({
      [key]: !this.data.coopOptions[index].selected
    });
  },

  // 3. 跳转回首页
  goToIndex() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  // 4. 提交表单
  submitForm() {
    // 基础校验
    if (!this.data.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!this.data.phone.trim()) {
      wx.showToast({ title: '请输入电话', icon: 'none' });
      return;
    }

    this.setData({ isSubmitting: true });

    // 收集选中的意向
    const selectedCoops = this.data.coopOptions
        .filter(item => item.selected)
        .map(item => item.title);

    // 构造发送给 Cloudflare Worker 的消息内容
    const content = `【小程序用户留言】\n姓名：${this.data.name}\n电话：${this.data.phone}\n公司：${this.data.company}\n职位：${this.data.job}\n意向：${selectedCoops.join(', ') || '无'}`;

    // 发起网络请求
    wx.request({
      // 请替换为你真实的 Cloudflare Worker 地址
      url: 'https://pixos.dpdns.org/api/submit', 
      method: 'POST',
      data: { content: content },
      success: (res) => {
        if (res.statusCode === 200) {
            wx.showModal({
                title: '提交成功',
                content: '我们会尽快与您联系！',
                showCancel: false,
                success: () => {
                    // 清空表单
                    this.resetForm();
                }
            });
        } else {
             wx.showToast({ title: '服务异常，请重试', icon: 'none' });
        }
      },
      fail: (err) => {
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
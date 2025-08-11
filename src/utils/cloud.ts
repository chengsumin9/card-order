class CloudService {
  // 初始化方法（阿里云无需特殊初始化）
  init() {
    console.log('阿里云环境已自动初始化');
  }

  // 微信登录（适配阿里云）
  async loginByWechat(): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: async (loginRes) => {
          try {
            const res = await uniCloud.callFunction({
              name: 'login',
              data: { code: loginRes.code }
            });
            
            if (res.result.code === 200) {
              resolve(res.result.data);
            } else {
              reject(new Error(res.result.message || '登录失败'));
            }
          } catch (error) {
            reject(error);
          }
        },
        fail: reject
      });
    });
  }

  // 获取用户信息
  async getUserInfo(): Promise<any> {
    const res = await uniCloud.callFunction({
      name: 'getUserInfo'
    });
    if (res.result.code !== 200) {
      throw new Error(res.result.message);
    }
    return res.result.data;
  }

  // 更新用户信息
  async updateUserInfo(userInfo: any): Promise<any> {
    const res = await uniCloud.callFunction({
      name: 'updateUserInfo',
      data: { userInfo }
    });
    return res.result;
  }
}

export default new CloudService();
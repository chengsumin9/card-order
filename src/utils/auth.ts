// utils/auth.ts
import cloudService from './cloud'

// 用户信息接口
export interface UserInfo {
  _id?: string
  openid: string
  nickName: string
  avatarUrl: string
  gender: number
  province: string
  city: string
  country: string
  createTime: string
  lastLoginTime: string
  [key: string]: any
}

// 登录返回数据接口
export interface LoginData {
  token: string
  openid: string
  sessionKey: string
  userInfo: UserInfo
}

class AuthService {
  private readonly TOKEN_KEY = 'token'
  private readonly USER_INFO_KEY = 'userInfo'
  private readonly OPENID_KEY = 'openid'

  // 静默登录
  async silentLogin(): Promise<LoginData | null> {
    try {
      // 检查本地是否有有效的登录状态
      const token = this.getToken()
      if (token) {
        const userInfo = this.getUserInfo()
        if (userInfo) {
          console.log('使用本地存储的登录信息')
          return {
            token,
            openid: this.getOpenId(),
            sessionKey: '',
            userInfo
          }
        }
      }
      
      // 执行微信登录
      console.log('执行微信登录')
      const loginResult = await cloudService.loginByWechat()
      
      if (loginResult) {
        // 保存登录信息
        this.setToken(loginResult.token)
        this.setUserInfo(loginResult.userInfo)
        this.setOpenId(loginResult.openid)
        
        console.log('无感登录成功')
        return loginResult
      }
      
      return null
    } catch (error) {
      console.error('静默登录失败:', error)
      throw error
    }
  }
  
  // 设置token
  setToken(token: string): void {
    uni.setStorageSync(this.TOKEN_KEY, token)
  }
  
  // 获取token
  getToken(): string {
    return uni.getStorageSync(this.TOKEN_KEY)
  }
  
  // 设置用户信息
  setUserInfo(userInfo: UserInfo): void {
    uni.setStorageSync(this.USER_INFO_KEY, userInfo)
  }
  
  // 获取用户信息
  getUserInfo(): UserInfo | null {
    return uni.getStorageSync(this.USER_INFO_KEY)
  }
  
  // 设置openid
  setOpenId(openid: string): void {
    uni.setStorageSync(this.OPENID_KEY, openid)
  }
  
  // 获取openid
  getOpenId(): string {
    return uni.getStorageSync(this.OPENID_KEY)
  }
  
  // 检查是否已登录
  isLoggedIn(): boolean {
    return !!this.getToken()
  }
  
  // 清除登录信息
  clearAuthInfo(): void {
    uni.removeStorageSync(this.TOKEN_KEY)
    uni.removeStorageSync(this.USER_INFO_KEY)
    uni.removeStorageSync(this.OPENID_KEY)
  }
}

export default new AuthService()
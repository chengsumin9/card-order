// api/user.ts
import request from '@/utils/request'

// 微信登录请求参数
export interface WechatLoginParams {
  code: string
}

// 登录响应数据
export interface LoginResponse {
  code: number
  message: string
  data: {
    token: string
    openid: string
    sessionKey: string
    userInfo: {
      nickName: string
      avatarUrl: string
      gender: number
      city: string
      province: string
      country: string
    }
  }
}

// 微信登录接口
export function loginByWechat(data: WechatLoginParams) {
  return request<LoginResponse>({
    url: '/user/login',
    method: 'POST',
    data
  })
}

// 获取用户信息接口
export function getUserInfo() {
  return request<any>({
    url: '/user/info',
    method: 'GET'
  })
}
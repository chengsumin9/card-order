// stores/user.ts
import { defineStore } from 'pinia'
import authService, { UserInfo } from '@/utils/auth'

interface UserState {
  userInfo: UserInfo | null
  isLoggedIn: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    isLoggedIn: false
  }),
  
  getters: {
    getUserInfo: (state) => state.userInfo,
    isLogin: (state) => state.isLoggedIn
  },
  
  actions: {
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
      this.isLoggedIn = true
    },
    
    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null
      this.isLoggedIn = false
    },
    
    // 初始化用户信息
    async initUser() {
      try {
        if (authService.isLoggedIn()) {
          const userInfo = authService.getUserInfo()
          if (userInfo) {
            this.setUserInfo(userInfo)
            return userInfo
          }
        }
        return null
      } catch (error) {
        console.error('初始化用户信息失败:', error)
        this.clearUserInfo()
        return null
      }
    }
  }
})
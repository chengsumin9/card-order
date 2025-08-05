// src/store/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentUser } from '@/utils/cloud'

interface UserInfo {
  _id: string
  _openid?: string
  nickName: string
  avatarUrl: string
  inviteCode: string
  coupleId?: string
  partnerId?: string
}

interface PartnerInfo {
  nickName?: string
  avatarUrl?: string
}

interface CartItem {
  foodId: string
  name: string
  price: number
  quantity: number
  selected: boolean
}

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  // 伴侣信息
  const partnerInfo = ref<PartnerInfo | null>(null)
  // 购物车商品
  const cartItems = ref<CartItem[]>([])
  // 情侣关系ID
  const coupleId = ref<string | null>(null)
  // 加载状态
  const loading = ref(false)

  // 初始化用户信息
  const initUser = async () => {
    loading.value = true
    try {
      // 获取微信用户信息
      const { userInfo: wxUser } = await wx.getUserProfile({
        desc: '用于完善会员资料'
      })
      
      // 检查云数据库是否已有该用户
      const db = wx.cloud.database()
      const users = await db.collection('users')
        .where({ _openid: '{openid}' }) // 云开发会自动替换{openid}
        .get()
      
      if (users.data.length > 0) {
        // 已有用户，更新本地状态
        userInfo.value = users.data[0]
        coupleId.value = users.data[0].coupleId
      } else {
        // 新用户，创建记录
        const newUser = {
          ...wxUser,
          inviteCode: generateInviteCode(),
          createdAt: db.serverDate()
        }
        
        const res = await db.collection('users').add({
          data: newUser
        })
        
        userInfo.value = {
          ...newUser,
          _id: res._id
        }
      }
      
      // 如果有情侣关系，获取伴侣信息
      if (coupleId.value) {
        await fetchPartnerInfo()
      }
    } catch (error) {
      console.error('初始化用户失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 生成邀请码
  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  // 获取伴侣信息
  const fetchPartnerInfo = async () => {
    if (!coupleId.value || !userInfo.value?.partnerId) return
    
    try {
      const db = wx.cloud.database()
      const res = await db.collection('users')
        .doc(userInfo.value.partnerId)
        .get()
      
      partnerInfo.value = {
        nickName: res.data.nickName,
        avatarUrl: res.data.avatarUrl
      }
    } catch (error) {
      console.error('获取伴侣信息失败:', error)
    }
  }

  // 更新情侣信息
  const updateCoupleInfo = (data: {
    coupleId: string
    partnerInfo: PartnerInfo
  }) => {
    coupleId.value = data.coupleId
    partnerInfo.value = data.partnerInfo
    
    // 更新本地用户信息
    if (userInfo.value) {
      userInfo.value.coupleId = data.coupleId
      userInfo.value.partnerId = data.partnerInfo._openid
    }
  }

  // 更新购物车
  const updateCart = (items: CartItem[]) => {
    cartItems.value = items
  }

  // 清空用户信息
  const clearUser = () => {
    userInfo.value = null
    partnerInfo.value = null
    coupleId.value = null
    cartItems.value = []
  }

  return {
    userInfo,
    partnerInfo,
    cartItems,
    coupleId,
    loading,
    initUser,
    updateCoupleInfo,
    updateCart,
    clearUser
  }
})
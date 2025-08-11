<!-- pages/index/index.vue -->
<template>
  <view class="container">
    <view v-if="userInfo" class="user-info">
      <image :src="userInfo.avatarUrl || '/static/images/default-avatar.png'" class="avatar" mode="aspectFill"></image>
      <text class="nickname">{{ userInfo.nickName || '匿名用户' }}</text>
      <view class="user-details">
        <text class="detail-item">OpenID: {{ userInfo.openid }}</text>
        <text class="detail-item">最近登录: {{ formatTime(userInfo.lastLoginTime) }}</text>
      </view>
    </view>

    <view v-else class="loading">
      <text>正在获取用户信息...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import authService from '@/utils/auth'

// 使用用户状态
const userStore = useUserStore()
const userInfo = ref(userStore.getUserInfo)

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

// 监听登录成功事件
onMounted(() => {
  uni.$on('loginSuccess', (info: any) => {
    userInfo.value = info
  })

  // 如果还没有用户信息，尝试从本地获取
  if (!userInfo.value) {
    const localUserInfo = authService.getUserInfo()
    if (localUserInfo) {
      userInfo.value = localUserInfo
    }
  }
})
</script>

<style lang="scss">
.container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 2px solid #f0f0f0;
}

.nickname {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.user-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  font-size: 14px;
  color: #666;
  padding: 5px 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 16px;
  color: #999;
}
</style>
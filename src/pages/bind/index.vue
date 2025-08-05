<template>
  <view class="bind-container">
    <uni-card title="绑定情侣关系">
      <uni-section title="你的邀请码" type="line">
        <view class="code-box">{{ userCode }}</view>
        <button @click="copyCode">复制邀请码</button>
      </uni-section>

      <uni-section title="输入对方邀请码" type="line">
        <uni-easyinput v-model="partnerCode" placeholder="请输入对方的邀请码" />
        <button type="primary" @click="handleBind" :loading="loading">绑定</button>
      </uni-section>
    </uni-card>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const partnerCode = ref('')
const loading = ref(false)

// 生成用户邀请码
const userCode = computed(() => {
  return userStore.userInfo?.inviteCode || ''
})

const handleBind = async () => {
  if (!partnerCode.value) {
    uni.showToast({ title: '请输入邀请码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await wx.cloud.callFunction({
      name: 'bindCouple',
      data: {
        userId: userStore.userInfo._id,
        partnerCode: partnerCode.value
      }
    })

    userStore.updateCoupleInfo(res.result)
    uni.showToast({ title: '绑定成功' })
    uni.navigateBack()
  } catch (error: any) {
    if (error.errMsg.includes('INVALID_CODE')) {
      uni.showToast({ title: '无效的邀请码', icon: 'error' })
    } else {
      uni.showToast({ title: '绑定失败', icon: 'error' })
    }
  } finally {
    loading.value = false
  }
}

const copyCode = () => {
  uni.setClipboardData({
    data: userCode.value,
    success: () => uni.showToast({ title: '已复制' })
  })
}
</script>
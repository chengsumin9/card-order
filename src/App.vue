<!-- App.vue -->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import cloudService from '@/utils/cloud'
import authService from '@/utils/auth'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

onLaunch(async () => {
  console.log('App Launch')

  try {
    // 初始化云开发
    cloudService.init()

    // 显示加载提示
    uni.showLoading({
      title: '正在登录...'
    })

    // 执行静默登录
    const loginResult = await authService.silentLogin()

    if (loginResult) {
      // 更新全局状态
      userStore.setUserInfo(loginResult.userInfo)

      console.log('无感登录成功:', loginResult.userInfo)
      uni.$emit('loginSuccess', loginResult.userInfo)

      uni.hideLoading()
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1000
      })
    } else {
      uni.hideLoading()
      console.log('登录失败')
    }
  } catch (error) {
    uni.hideLoading()
    console.error('无感登录失败:', error)
    uni.showToast({
      title: '登录失败',
      icon: 'none',
      duration: 2000
    })
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss"></style>
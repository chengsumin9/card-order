// import { showToast } from '@/utils/util'

export const initCloud = () => {
  if (!wx.cloud) {
    // showToast('请使用微信基础库2.2.3或以上版本')
    console.log(
      '请使用微信基础库2.2.3或以上版本'
    );
    
    return false
  }
  
  wx.cloud.init({
    env: 'cloud1-0guu331062d6c87d', // 替换为你的环境ID
    traceUser: true
  })
  
  return wx.cloud
}

export const getCurrentUser = async () => {
  try {
    const res = await wx.cloud.callFunction({
      name: 'getUser', // 确保云函数存在
      data: { openid: '{openid}' }
    })
    return res.result
  } catch (err) {
    console.error('获取用户失败:', err)
    return null
  }
}
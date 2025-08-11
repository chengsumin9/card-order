// cloudfunctions/getUserInfo/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    if (wxContext.OPENID) {
      // 查询用户信息
      const userRes = await db.collection('users').where({
        openid: wxContext.OPENID
      }).get()
      
      if (userRes.data.length > 0) {
        return {
          code: 200,
          data: {
            userInfo: userRes.data[0]
          }
        }
      } else {
        return {
          code: 404,
          message: '用户不存在'
        }
      }
    } else {
      return {
        code: 401,
        message: '未授权'
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      code: 500,
      message: '服务器错误',
      error: error.message
    }
  }
}
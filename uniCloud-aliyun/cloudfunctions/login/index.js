// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 阿里云环境下使用 uniCloud 的 API
exports.main = async (event, context) => {
  try {
    if (!event.code) {
      return { code: 400, message: '缺少 code 参数' };
    }

    // 1. 获取微信 openid 和 session_key（阿里云专用方式）
    const { openid, session_key } = await uniCloud.getWXContext({
      code: event.code
    });

    // 2. 数据库操作（使用 uniCloud.database）
    const db = uniCloud.database();
    const userRes = await db.collection('users').where({ openid }).get();
    
    let userInfo;
    if (userRes.data.length > 0) {
      // 更新用户最后登录时间
      await db.collection('users').doc(userRes.data[0]._id).update({
        lastLoginTime: db.serverDate()
      });
      userInfo = userRes.data[0];
    } else {
      // 创建新用户
      const createRes = await db.collection('users').add({
        openid,
        sessionKey: session_key,
        createTime: db.serverDate(),
        lastLoginTime: db.serverDate()
      });
      userInfo = { _id: createRes.id, openid };
    }

    // 3. 返回登录结果
    return {
      code: 200,
      data: {
        token: require('crypto').createHash('md5').update(openid + session_key + Date.now()).digest('hex'),
        openid,
        session_key,
        userInfo
      }
    };
  } catch (error) {
    console.error('登录失败:', error);
    return { code: 500, message: error.message };
  }
};

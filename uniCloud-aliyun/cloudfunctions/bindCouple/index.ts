import cloud from 'wx-server-sdk'
cloud.init()

interface BindParams {
  userId: string
  partnerCode: string
}

export const main = async (event: BindParams) => {
  const db = cloud.database()
  const $ = db.command
  
  // 1. 验证邀请码有效性
  const userRes = await db.collection('users')
    .where({ inviteCode: event.partnerCode })
    .get()
  
  if (userRes.data.length === 0) {
    throw new Error('INVALID_CODE')
  }
  
  const partner = userRes.data[0]
  
  // 2. 创建情侣关系
  const coupleRes = await db.collection('couples').add({
    data: {
      users: [event.userId, partner._openid],
      createdAt: db.serverDate(),
      status: 'active'
    }
  })
  
  // 3. 更新双方用户信息
  await db.collection('users').doc(event.userId).update({
    data: {
      coupleId: coupleRes._id,
      partnerId: partner._openid
    }
  })
  
  return {
    coupleId: coupleRes._id,
    partnerInfo: {
      nickName: partner.nickName,
      avatarUrl: partner.avatarUrl
    }
  }
}
import cloud from 'wx-server-sdk'
cloud.init()

interface OrderItem {
  foodId: string
  name: string
  price: number
  quantity: number
}

export const main = async (event: {
  coupleId: string
  userId: string
  items: OrderItem[]
  address: string
  remark?: string
}) => {
  const db = cloud.database()
  const _ = db.command
  
  // 1. 创建订单
  const orderRes = await db.collection('orders').add({
    data: {
      coupleId: event.coupleId,
      userId: event.userId,
      items: event.items,
      address: event.address,
      remark: event.remark,
      status: 'pending',
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })
  
  // 2. 清空购物车
  await db.collection('carts').doc(event.coupleId).update({
    data: {
      items: [],
      updatedAt: db.serverDate()
    }
  })
  
  // 3. 发送订阅消息给伴侣
  const couple = await db.collection('couples').doc(event.coupleId).get()
  const partnerId = couple.data.users.find((id: string) => id !== event.userId)
  
  try {
    await cloud.openapi.subscribeMessage.send({
      touser: partnerId,
      templateId: '你的模板ID',
      data: {
        thing1: { value: '您的伴侣已下单' },
        amount2: { 
          value: event.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2) 
        },
        thing3: { value: event.address || '未填写地址' }
      }
    })
  } catch (err) {
    console.error('发送消息失败:', err)
  }
  
  return { orderId: orderRes._id }
}
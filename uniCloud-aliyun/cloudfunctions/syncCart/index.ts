import cloud from 'wx-server-sdk'
cloud.init()

interface CartItem {
  foodId: string
  name: string
  price: number
  quantity: number
  selected: boolean
}

export const main = async (event: {
  coupleId: string
  action: 'add' | 'update' | 'remove' | 'clear'
  item?: CartItem
  items?: CartItem[]
}) => {
  const db = cloud.database()
  const _ = db.command
  
  // 获取当前购物车
  const cartRes = await db.collection('carts').doc(event.coupleId).get()
  let currentItems: CartItem[] = cartRes.data?.items || []
  
  // 处理不同操作
  switch (event.action) {
    case 'add':
      currentItems.push(event.item!)
      break
      
    case 'update':
      currentItems = currentItems.map(i => 
        i.foodId === event.item!.foodId ? event.item! : i
      )
      break
      
    case 'remove':
      currentItems = currentItems.filter(i => i.foodId !== event.item!.foodId)
      break
      
    case 'clear':
      currentItems = []
      break
  }
  
  // 更新购物车
  await db.collection('carts').doc(event.coupleId).update({
    data: {
      items: currentItems,
      updatedAt: db.serverDate()
    }
  })
  
  return { updatedItems: currentItems }
}
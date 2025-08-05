<template>
  <view class="menu-page">
    <!-- 菜单分类 -->
    <scroll-view scroll-x class="category-scroll">
      <view v-for="cat in categories" :key="cat" :class="['category-item', { active: activeCat === cat }]"
        @click="activeCat = cat">
        {{ cat }}
      </view>
    </scroll-view>

    <!-- 菜品列表 -->
    <view class="food-list">
      <FoodItem v-for="food in filteredFoods" :key="food._id" :food="food" @add="handleAddFood" />
    </view>

    <!-- 实时购物车 -->
    <view class="cart-footer">
      <view class="cart-info">
        <text>共 {{ cartTotal }} 件</text>
        <text>¥{{ cartPrice.toFixed(2) }}</text>
      </view>
      <button @click="goToCheckout">去结算</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import FoodItem from '@/components/FoodItem.vue'

const userStore = useUserStore()
const activeCat = ref('全部')
const foodList = ref<FoodItem[]>([])
let cartWatcher: any = null

// 获取菜单数据
const fetchMenu = async () => {
  const db = wx.cloud.database()
  const res = await db.collection('foods').get()
  foodList.value = res.data
}

// 监听购物车变化
const watchCart = () => {
  if (!userStore.coupleId) return

  const db = wx.cloud.database()
  cartWatcher = db.collection('carts').doc(userStore.coupleId).watch({
    onChange: (snapshot) => {
      userStore.updateCart(snapshot.docs[0]?.items || [])
    },
    onError: (err) => {
      console.error('购物车监听错误:', err)
    }
  })
}

// 添加菜品到购物车
const handleAddFood = async (food: FoodItem) => {
  try {
    await wx.cloud.callFunction({
      name: 'syncCart',
      data: {
        coupleId: userStore.coupleId,
        action: 'add',
        item: {
          foodId: food._id,
          name: food.name,
          price: food.price,
          quantity: 1,
          selected: true
        }
      }
    })
    uni.showToast({ title: '已添加', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: '添加失败', icon: 'error' })
  }
}

// 计算属性
const categories = computed(() => {
  const cats = new Set(foodList.value.map(f => f.category))
  return ['全部', ...Array.from(cats)]
})

const filteredFoods = computed(() => {
  return activeCat.value === '全部'
    ? foodList.value
    : foodList.value.filter(f => f.category === activeCat.value)
})

const cartTotal = computed(() => {
  return userStore.cartItems.reduce((sum, item) => sum + item.quantity, 0)
})

const cartPrice = computed(() => {
  return userStore.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// 生命周期
onMounted(() => {
  fetchMenu()
  watchCart()
})

onUnmounted(() => {
  if (cartWatcher) {
    cartWatcher.close()
  }
})
</script>
<template>
  <view class="checkout-page">
    <uni-card title="订单确认">
      <uni-section title="配送信息" type="line">
        <uni-easyinput v-model="address" placeholder="请输入配送地址" />
      </uni-section>

      <uni-section title="订单详情" type="line">
        <view class="order-item" v-for="item in cartItems" :key="item.foodId">
          <text>{{ item.name }} × {{ item.quantity }}</text>
          <text>¥{{ (item.price * item.quantity).toFixed(2) }}</text>
        </view>
        <view class="order-total">
          <text>合计</text>
          <text>¥{{ totalPrice.toFixed(2) }}</text>
        </view>
      </uni-section>

      <uni-section title="备注" type="line">
        <uni-easyinput v-model="remark" placeholder="选填" />
      </uni-section>
    </uni-card>

    <button type="primary" class="submit-btn" @click="handleSubmit" :loading="loading">
      提交订单
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const address = ref('')
const remark = ref('')
const loading = ref(false)

const cartItems = computed(() => userStore.cartItems)
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const handleSubmit = async () => {
  if (!address.value) {
    uni.showToast({ title: '请填写配送地址', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await wx.cloud.callFunction({
      name: 'placeOrder',
      data: {
        coupleId: userStore.coupleId,
        userId: userStore.userInfo._id,
        items: cartItems.value.map(item => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        address: address.value,
        remark: remark.value
      }
    })

    uni.redirectTo({
      url: `/pages/order/detail?id=${res.result.orderId}`
    })
  } catch (error) {
    uni.showToast({ title: '下单失败', icon: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
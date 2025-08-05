<template>
  <view class="food-item">
    <image class="food-image" :src="food.image" mode="aspectFill" />

    <view class="food-info">
      <text class="food-name">{{ food.name }}</text>
      <text class="food-desc" v-if="food.description">{{ food.description }}</text>

      <view class="food-footer">
        <text class="food-price">¥{{ food.price.toFixed(2) }}</text>
        <button class="add-btn" size="mini" @click.stop="handleAdd">
          +
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FoodItem {
  _id: string
  name: string
  price: number
  image?: string
  description?: string
  category?: string
}

const props = defineProps<{
  food: FoodItem
}>()

const emits = defineEmits<{
  (e: 'add', food: FoodItem): void
}>()

const handleAdd = () => {
  emits('add', props.food)
}
</script>

<style scoped lang="scss">
.food-item {
  display: flex;
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  .food-image {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    margin-right: 12px;
  }

  .food-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .food-name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .food-desc {
    font-size: 12px;
    color: #999;
    margin: 4px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .food-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .food-price {
    font-size: 16px;
    color: #ff4d4f;
    font-weight: bold;
  }

  .add-btn {
    width: 28px;
    height: 28px;
    line-height: 28px;
    padding: 0;
    background-color: #ff4d4f;
    color: white;
    border-radius: 14px;

    &::after {
      border: none;
    }
  }
}
</style>
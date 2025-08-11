<template>
  <view class="container">
    <view class="top">
      <view class="user-info">
        <image src="" class="avatar" />
        <view class="info">
          <view class="name">请登录</view>
          <view class="user-id">id：84793</view>
        </view>
      </view>
    </view>
    <!-- 卡片 -->
    <view class="card">
      占位卡片
    </view>
    <!-- 功能列表 -->
    <view class="list">
      <view class="item" v-for="item in renderList" :key="item.id">
        <view>{{ item.name }}</view>
        <view> > </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);

userStore.initUser();
const renderList = ref([
  { id: 1, name: '联系客服' },
  { id: 2, name: '修改密码' },
  { id: 3, name: '修改绑定手机' },
  { id: 4, name: '退出登录' },
  { id: 5, name: '关于我们' },
  { id: 6, name: '意见反馈' },
])

</script>

<style lang="scss" scoped>
.container {
  width: 750rpx;
  min-height: 100vh;
  background-color: #F7F7F7;
  position: relative;

  .top {
    width: 750rpx;
    height: 400rpx;
    background: linear-gradient(90deg, #D1C9FF 16%, #EFC0FF 83%);

    .user-info {
      display: flex;
      align-items: center;
      padding: 180rpx 0 0 38rpx;

      .avatar {
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
        margin-right: 52rpx;
        border: 1rpx solid red;
      }

      .info {
        font-size: 36rpx;
        color: #333333;

        .user-id {
          font-size: 20rpx;
          margin-top: 8rpx;
        }
      }
    }
  }

  .card {
    width: 690rpx;
    height: 300rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    margin: -50rpx auto 36rpx;
  }

  .list {
    width: 690rpx;
    height: 700rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    margin: 0 auto;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 94rpx;
      margin: 0 24rpx;
      font-size: 24rpx;
      color: #333333;
      border-bottom: 2rpx solid rgba(230, 230, 230, 0.45);
    }
  }
}
</style>
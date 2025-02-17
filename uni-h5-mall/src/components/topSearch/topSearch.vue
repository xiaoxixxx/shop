<template>
  <view class="searchBox " @click="goSearch">
    <img src="@/static/index/search.png" class="ww24 hh24"></img>
    <view class="color999 ml14  f14">
      {{t('goods.sea_h1')}}
    </view>
  </view>
</template>

<script setup>

import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
const goSearch = () => {
  uni.navigateTo({
    url: '/pages/goods/search'
  })
}
</script>

<style>
.searchBox {
  padding: 6px 16rpx;
  border-radius: 50rpx;
  height: 48rpx;
  border: 1px solid #e9e9e9;
  display: flex;
  background: #fff;
  align-items: center;
}

.color999 {
  color: rgba(153, 153, 153, 0.6);
}
</style>
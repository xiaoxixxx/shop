<template>
  <van-card :num="1" :price="goodsData.price" :skuText="goodsData.introduction" :title="goodsData.spuName"
    :thumb="goodsData.picUrl" priceColor="#FF3000" style="width: 80%;" />
</template>

<script setup>

const props = defineProps({
  goodsData: {
    type: Object,
    default: {},
  },
});
</script>

<style>
</style>


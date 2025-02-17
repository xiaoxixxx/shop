

<script setup>
const props = defineProps({
  title: {
    type: String
  },
  backIcon: {
    default: '/static/icons/right.png'
  },
  isBig: {
    default: true
  },
  backUrl: {
    default: ""
  },
  isWhiteBg:{
	  default:false
  }
})
const isTopFixed = ref(false)
// 吸顶判断
const topChangeHandle = (e) => {
  isTopFixed.value = e
}
const goBack = () => {
	 uni.navigateBack()
	 return
  if (props.backUrl) {
    uni.navigateTo({
      url: props.backUrl
    })
  } else {
    uni.navigateBack()
  }
}
</script>

<template>

  <van-sticky :offset-top="0" @change="topChangeHandle">
    <view class="pdlr10 pdtb10  between  topNav" >
      <view class="left" @click="goBack">
        <image :src="backIcon" class="ww32 hh32"   />
      </view>
      <view class="text_center    f17   ">
        <van-text-ellipsis rows="1" :content="title" class="text_bold " style="width: 100%;" />
      </view>
      <view class="right" style="min-width: 24px;">
        <slot></slot>
      </view>
    </view>
  </van-sticky>

</template>


<style lang="scss">
.topFixedBg {
  background: #f8f8f8;
}
.topNav {
  .left,
  .right {
    width: 20%;
  }
  .center {
    width: 60%;
  }
  .left {
    text-align: left;
  }
  .right {
    text-align: right;
  }
}
</style>
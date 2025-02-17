

<script setup>
const props = defineProps({
  title: {
    type: String
  },
  backIcon: {
    default: '../../static/icons/right.png'
  },
  isBig: {
    default: true
  },
  backUrl: {
    default: ""
  },
  isWhiteBg:{
	  type:Boolean,
	  default:true
  }
})
const isTopFixed = ref(false)
// 吸顶判断
const topChangeHandle = (e) => {
  isTopFixed.value = e
}
const goBack = () => {
  if (props.backUrl) {
    uni.navigateTo({
      url: props.backUrl
    })
  } else {
    history.back()
  }
}
</script>

<template>

  <van-sticky :offset-top="0" @change="topChangeHandle">
    <view class="pdlr10 pdtb10  between  topNav" :class="isTopFixed  ?!isWhiteBg?'topFixedWhiteBg':'topFixedBg ':''">
      <view class="left">
        <img :src="backIcon" :class="isBig?['ww32', 'hh32']:['ww24','hh24']" @click="goBack">
      </view>
      <view class="text_center center   f17   ">
        <van-text-ellipsis rows="1" :content="title" class="semiBold flex1" />
      </view>
      <view class="right" :class="isBig?['ww32', 'hh32']:['ww24','hh24']" >
        <slot></slot>
      </view>
    </view>
  </van-sticky>

</template>


<style lang="scss">
.topFixedBg {
  background: #f8f8f8;
}
.topFixedWhiteBg{
	background: #fff;
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
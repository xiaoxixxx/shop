<template>
	
	<view>
		<view class="pdlr10 pdtb10  between  topNav" >
		  <view class="left">
		    <image src="/static/icons/right.png" class="ww32 hh32"  @click="goBack" />
		  </view>
		  <view class="text_center  f17 ">
		    <van-text-ellipsis rows="1" content="" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>
	</view>
</template>

<script setup>
	
	import {
	  onLoad
	} from '@dcloudio/uni-app';
	const goBack = ()=>{
		uni.navigateBack()
	}
</script>

<style>
</style>
<script setup>

const showMask = ref(false)
const isLoading = ref(0)
const openMask = ()=>{
	isLoading.value = 1
	showMask.value = true
}

const closeHandle = ()=>{
	isLoading.value = 2
	setTimeout(()=>{
		showMask.value = false
	},900)
}
</script>


<template>
  <view>

    <van-button @click="openMask">x 登录</van-button>
	
	
	<div class="mask" v-if="showMask" :class="isLoading == 1?'animateCss':isLoading==2?'animateCss1':''">
		
		<van-button type="primary" @click="closeHandle">关闭</van-button>
	</div>
  </view>
</template>

<style lang="scss" scoped>
	page{
		background: #ccc;
	}
	.mask{
		position: fixed;
		top: 20vh;
		left: 50%;
		transform: translateX(-50%);
		background: #fff;
		width: 200px;
		height: 200px;
		border-radius: 10px;
	}
	@keyframes toShow{
		from{
			opacity: 0;
		}
		to{
			opacity: 1;
		}
	}
	@keyframes toHidden{
		from{
			opacity: 1;
			display: block;
		}
		to{
			opacity: 0;
			display: none;
		}
	}
	.animateCss{
		animation: toShow 1s linear  ;
	}
	
	.animateCss1{
		animation: toHidden 1s linear  ;
	}
</style>
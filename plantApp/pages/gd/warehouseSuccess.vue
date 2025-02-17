<script setup>
	import {
	  onLoad
	} from '@dcloudio/uni-app';
	import {ref} from 'vue'
	const scanVal  = ref(0)
	onLoad((e)=>{
		if(e.code){
			scanVal.value = e.code
		}
	})
	
	function changePage(){
		uni.navigateTo({
			url:'/pages/tab/index'
		})
	}
	

</script>


<template>
	
	<view class="content">
		<view class="between pdlr20 pdtb10">
			<view class="ww50"></view>
			<view class="text_bold f17">结果反馈</view>
			<view class=" ww50" ></view>
		</view>
		
		<view class="pdlr20 mt73">
			<view class="center">
				<image src="@/static/bg/recSuc.png"  style="width: 69px;height: 94px;" />
			</view>
			<view class="text_center f20 text_bold mt20">
				出库成功
			</view>
			<view class="colorAf pdlr35  f12 mt8 text_center" style="line-height: 18px;">
				请将打印出的面单贴到对应的包裹上
			</view>
			
			
			<view class="center">
				<view class="center botBtn" @click="changePage('/pages/tab/index')">
					<view class="f14 ml8">
						返回首页
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>



<style lang="scss" scoped>
	.botBtn{
		width: 200px;
		height: 48px;
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		color: #fff;
		margin-top: 120px;
	}
	.resBox{
		// height: 75px;
		background: #F6F6F7;
		border-radius: 20px 20px 20px 20px;
		margin-top: 26px;
		padding:  20px;
	}
	.content{
		background: #fff;
		min-height: 100vh;
	}
</style>
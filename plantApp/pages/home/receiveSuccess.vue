<script setup>
	import { onMounted } from 'vue';
import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import { showToast } from 'vant';
	import {GDHPStore} from '@/store/gdhp.js';
	const GDHPStoreInfo = GDHPStore()
	import request from '../../comm/request.ts';
	import {
	  onLoad
	} from '@dcloudio/uni-app';
	import {ref,computed} from 'vue'
	const scanVal  = ref(0)
	// onMounted(()=>{
	// 	// uni.showToast({
	// 	// 	title:window.location.href.split('code=')[1]
	// 	// })
	// 	scanVal.value = window.location.href.split('code=')[1]
	// 	// console.log(window.location.href.split('code=')[1]);
	// })
	onLoad(e=>{
		if(e.code){
			scanVal.value = e.code
		}
	})
	const changePage = url=>{
		uni.navigateTo({
			url
		})
	}
	
	const pageData = computed(()=>{
		return GDHPStoreInfo.$state.reviceObj
	})
	const goBack = ()=>{
		uni.navigateBack()
	}
</script>


<template>
	
	<view class="content">
		<view class="between pdlr20 pdtb10">
			<view class="ww50"></view>
			<view class="text_bold f17">Receiving</view>
			<view class="color999 ww50 f14" @click="changePage('/pages/tab/index')">Return</view>
		</view>
		
		<view class="pdlr20 mt73">
			<view class="center">
				<image src="@/static/bg/recSuc.png"  style="width: 69px;height: 94px;" />
			</view>
			<view class="text_center f20 text_bold mt20">
				Succeeded
			</view>
			<view class="colorAf pdlr35  f12 mt8 text_center" style="line-height: 18px;">
				The current product has been successfully warehoused
			</view>
			
			<view class="resBox ">
				<view class="between flex1">
					<view class="f15 text_bold">{{pageData.categoryName}}</view>
					<view class="f12">x{{pageData.num}}</view>
				</view>
			</view>
			
			<view class="center">
				<view class="center botBtn" @click="changePage('./scanCode?type=1')">
					<image src="@/static/icons/smallScan.png" class="ww24 hh24" />
					<view class="f14 ml8">
						Continue
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
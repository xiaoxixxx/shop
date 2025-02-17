<script setup>
	import { onMounted } from 'vue';
import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import { showToast } from 'vant';
import {HWHJStore} from '@/store/hwhj.js';
	const HWHJStoreInfo = HWHJStore()
	const scanVal  = ref(0)
	onMounted(()=>{
		// uni.showToast({
		// 	title:window.location.href.split('code=')[1]
		// })
		scanVal.value = window.location.href.split('code=')[1]
		// console.log(window.location.href.split('code=')[1]);
	})
	
	const changePage = url=>{
		uni.navigateTo({
			url
		})
	}
	
	const changeTabPage = url=>{
		uni.switchTab({
			url
		})
	}
	

	const passList= ref([])
	passList.value = HWHJStoreInfo.$state.USERSUCCESSGOODS.map(item=>{
		return item
	})
</script>


<template>
	
	<view class="content">
		<view class="between pdlr20 pdtb10">
			<view class="ww50"></view>
			<view class="text_bold f17">Receiving</view>
			<view class="color999 f14" @click="changePage('/pages/tab/index')">Return</view>
		</view>
		
		<view class="pdlr20 mt73">
			<view class="center">
				<image src="@/static/bg/recSuc.png"  style="width: 69px;height: 94px;" />
			</view>
			<view class="text_center f20 text_bold mt20">
				Succeeded
			</view>
			<view class="colorAf pdlr35  f12 mt8 text_center" style="line-height: 18px;">
				The items with reference numbers 
				 <span class="colorBlue text_bold pdlr5" v-for="item in passList">{{item}}</span>
				  have been successfully picked up
			</view>
			
			
			<view class="center">
				<view class="center botBtn" @click="changePage('/')">
					<image src="@/static/icons/r_back.png" class="ww24 hh24" />
					<view class="f14 ml8">
						Return
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
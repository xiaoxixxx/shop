<template>
	<view class="">
		<view class="">
			<view class="between mt10 pdlr12">
				<view class="ww24"></view>
				<view class="text_center text_bold f17 ">{{t('home.h_h2')}}</view>
				<view class="ww24" @click="changePage('../setting/index')">
					<image src="/static/icons/settingIcon.png"  class="ww24 hh24" />
				</view>
			</view>
			<view class="text_center color7C f11 mt5">  {{ t('home.h_h3') +" "+ username}}</view>
			<view class=" pdlr12 mt17 ">
				<view>
					<image src="/static/banner.png" style="width: 100%;height: 110px;" />
				</view>
				
				<view class="hasBeforeLine mt30 text_bold f16">
					{{t('home.h_h1')}}
				</view>
				
				<view class="gridBox">
					<view class="gridItem center flex-col" v-for="(item,index) in menuList" @click="changePage(item.url)" :key="index">
						<view>
							<image :src="item.icon" class="ww50 hh48" />
						</view>
						<view class="mt12 f12 word">{{item.name}}</view>
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script setup>
	import { ref,computed,onMounted} from 'vue';
	import {
	  onLoad
	} from '@dcloudio/uni-app';
import {
		useI18n
	} from "vue-i18n";

	const {
		t
	} = useI18n();
	const listItem = computed(()=>{
		return [
			{
				name:'Receiving',
				url:'../home/scanCode?type=1',
				icon:'/static/l1.png'
			},
			{
				name:'Warehousing',
				url:'../home/scanCode?type=2',
				icon:'/static/l2.png'
			},
			{
				name:'Collect',
					url:'../home/scanCode?type=4',
				icon:'/static/l3.png'
			},
			{
				name:'Goods Management',
				url:'../home/goodsList',
				icon:'/static/l4.png'
			},
			{
				name:'Shelf Management',
				url:'../shelf/index',
				icon:'/static/l5.png'
			},
		]
	})

	const listItemGD = computed(()=>{
		return [
			{
				name:'收货',
				url:'../home/scanCode?type=6',
				icon:'/static/ll1.png'
			},
			{
				name:'出库',
				url:'../home/scanCode?type=7',
				icon:'/static/ll2.png'
			},
			{
				name:'出库管理',
					url:'../gd/warehouseMen',
				icon:'/static/ll3.png'
			},
			{
				name:'货品管理',
				url:'../gd/goodsMen',
				icon:'/static/ll4.png'
			},
		]
	})
	const menuList = ref([])
	// staffType
	if(uni.getStorageSync('staffType')){
		menuList.value = listItem.value
	}else{
		menuList.value = listItemGD.value
	}
	
	menuList.value = listItem.value.concat(listItemGD.value)
	const changePage = url=>{
		uni.navigateTo({
			url
		})
	}
	const username = uni.getStorageSync('username')
	onMounted(()=>{
		if(!uni.getStorageSync('token')){
			uni.clearStorage()
			uni.navigateTo({
				url:'/pages/home/login'
			})
		}
	})
</script>

<style lang="scss" scoped>
.gridBox {
		display: grid;
		grid-template-columns: repeat(3,1fr);
		gap:  40px 10px;
		padding-top: 30px;
		.gridItem{
			.word{
				color: #3C5079;
				margin: 12px  20px 0;
				text-align: center;
			}
		}
	}
</style>

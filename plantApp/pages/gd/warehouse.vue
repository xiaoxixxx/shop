<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts';
	import {GDHPStore} from '@/store/gdhp.js';
	const GDHPStoreInfo = GDHPStore()
	import { showToast } from 'vant';
	import { ref,computed} from 'vue'
	// import {
	// 	useI18n
	// } from "vue-i18n";
	
	// const {t}  = useI18n();
		// 顶部取消按钮

	// 扫描到的商品列表
	

	const getData = ()=>{
		let storageType;
		try{
			storageType = GDHPStoreInfo.$state.outboundList[0].storageType
		}catch(e){
			//TODO handle the exception
		}
		request({
			url:'/admin-api/storage/local/goods/get-for-outbound',
			data:{
				orderNo:window.location.href.split('code=')[1],
				storageType
			},
		}).then(res=>{
			
			// let flag = GDHPStoreInfo.$state.outboundList.some(item=>item.orderNo == res.orderNo)
			if(!GDHPStoreInfo.$state.outboundList.some(item=>item.orderNo == res.orderNo)){
				GDHPStoreInfo.addToList(res)
			}else{
				uni.showToast({
					title: '该商品已添加',
					icon: 'none'
				})
				
			}
			// showToast('出库成功')
		}).catch(e=>{
			uni.showToast({
				title:e.msg,
				icon: 'none'
			})
		})
	}
	// getData()
	// 删除
	const deleteHandle = (item,index)=>{
		GDHPStoreInfo.celByList(index)
	}
	
	
	const uploadGoods = ()=>{
		const goodsIds = GDHPStoreInfo.$state.outboundList.map(item=>{
			return item.id
		})
		request({
			url:'/admin-api/storage/local/goods/outbound/create',
			methods:'POST',
			data:{
				goodsIds
			}
		}).then(res=>{
			GDHPStoreInfo.$state.outboundList = []
			changePage('./warehouseSuccess')
		}).catch(e=>{
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
		})
	}
	
	const changePage = url=>{
		uni.navigateTo({
			url
		})
	}
	
	const dataList = computed(()=>{
		return GDHPStoreInfo.$state.outboundList
	})
	
	const goBack = ()=>{
		uni.navigateBack()
	}
</script>


<template>
	
	<view class="content">
	
		<view class="pdlr10 pdtb10  between  topNav" >
		  <view class="left">
		    <image src="/static/icons/right.png" class="ww32 hh32"  @click="goBack" />
		  </view>
		  <view class="text_center  f17 ">
		    <van-text-ellipsis rows="1" content="出库" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>
		<view class="pdlr12 pt12">
			<view class="topBox pdlr12 pt21 pb16">
			 <view class="f14">仓储类型</view>
			 <view class="mt19 shelfBox center flex-col">
				 <view class="f20 text_bold colorBlue">{{GDHPStoreInfo.$state.outboundList[0]?.storageTypeName}}</view>
			 </view>
			</view>
			
			<view class="mt12 botBox ">
				<view class="between">
					<view class="f14 ">商品总数 x{{dataList.length}}</view>
					<view class="rightBtn flex col_center f12" @click="changePage('../home/scanCode?type=7')">
						<image src="@/static/icons/scan_blue.png" class="ww24 hh24" />
						继续添加
					</view>
				</view>
				
			<view class="goodsBox pt12">
				<view class="between goodsItem" v-for="(item,index) in dataList" :key="index">
					<view class="flex col_center f14 text_bold">
						<view>{{item.categoryName}}  -- {{item.orderNo}}</view>
						<view class="pl15">x{{item.num}}</view>
					</view>
					<image src="@/static/icons/delete.png"  class="ww24 hh24" @click="deleteHandle(item,index)" />
				</view>
			</view>
			</view>
			
		<view class="botFixed">
			<view class="pdlr12 pb10">
				<view class="btns f14 text_white center"  @click="uploadGoods" >
				确认出库
						</view>
			</view>
		</view>
		</view>

		
	
		
		<view style="height:100px;"></view>
	</view>
</template>



<style lang="scss" scoped>
	.botFixed{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
	.btns{
		height: 48px;
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		text-align: center;
		line-height: 48px;
		margin-top: 30px;
	}


	.topBox{
		background: #fff;
		border-radius: 16px;
		.shelfBox{
			height: 56px;
			background: #F6F6F7;
			box-shadow: 0px 1px 19px 0px rgba(0,0,0,0.02);
			border-radius: 16px 16px 16px 16px;
		}
	}
	.botBox{
		background: #fff;
		border-radius: 16px;
		padding: 16px 12px;
	}
	.rightBtn{
		color: #3178FC;
	}
	.goodsItem{
		padding: 16px 12px;
		background: #F6F6F7;
		box-shadow: 0px 1px 19px 0px rgba(0,0,0,0.02);
		border-radius: 16px 16px 16px 16px;
		
		font-size: 14px;
	}
	.goodsItem:not(:first-child){
		margin-top: 12px;
	}
</style>
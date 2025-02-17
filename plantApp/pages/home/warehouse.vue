<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'
	import {HWHJStore} from '@/store/hwhj.js';
	const HWHJStoreInfo = HWHJStore()
	import { showToast } from 'vant';
	import {ref,computed} from 'vue'
	// import {
	// 	useI18n
	// } from "vue-i18n";
	
	// const {t}  = useI18n();
		// 顶部取消按钮
	const cancelHandle = ()=>{
		HWHJStoreInfo.$state.warehouseList = []
		uni.navigateTo({
			url:'/pages/tab/index'
		})
	}
	// 扫描到的商品列表
	const goodsList = computed(()=>{
		return HWHJStoreInfo.$state.warehouseList
	})
	
	const shelfVal = ref([1])
	// 弹窗columns
	const columns=ref([
		
	])
	const showPicker = ref(false)
	// 弹窗confirm
	const confirmShelfHandle = e=>{
		HWHJStoreInfo.$state.default_shelf[1] = e.selectedValues[0]
		showPicker.value = false
	}
	
	// 删除
	const deleteHandle = (item,index)=>{
		HWHJStoreInfo.$state.warehouseList.splice(index,1)
	}
	
	
	const uploadGoods = ()=>{
		const orderNoList = goodsList.value.map(item=>{
			return item.orderNo
		})
		request({
			url:'/admin-api/storage/overseas/goods/batch-put-on-shelf',
			data:{
				shelf:default_shelfVal.value[0],
				floor:default_shelfVal.value[1],
				orderNoList
			},
			methods:"PUT"
		}).then(res=>{
			showToast('Batch success')
			changePage('./wareSuccess')
		}).catch(e=>{
			showToast(e.msg)
		})
	}
	
	const changePage = url=>{
		uni.navigateTo({
			url
		})
	}
	
	const default_shelfVal = computed(()=>{
		return HWHJStoreInfo.$state.default_shelf
	})

	
	const layersList = ref([])
const getClassList = ()=>{
		request({
			url:'/admin-api/storage/overseas/goods-location/floor-list/'+default_shelfVal.value[0]
		}).then(res=>{
			layersList.value = res.floorList.map(item=>{
				return {
					name:item,
					value:item
				}
			})
		})
	}
	getClassList()
	
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
		    <van-text-ellipsis rows="1" content="Warehousing" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <view class="color999 f14" @click="cancelHandle">Cancel</view>
		  </view>
		</view>
		<view class="pdlr12 pt12">
			<view class="topBox pdlr12 pt21 pb16">
			 <view class="f16"><span class="colorFc">*</span>	Shelf</view>
			 <view class="mt19 shelfBox center flex-col" @click="showPicker = true">
				 <view class="f24 text_bold">Shelf {{default_shelfVal[0]}}- Layer {{default_shelfVal[1]}}</view>
				 <view class="mt4 f15 color7C">current shelf</view>
			 </view>
			</view>
			
			<view class="mt12 botBox ">
				<view class="between">
					<view class="f16 text_bold">Goods</view>
					<view class="rightBtn flex col_center f12" @click="changePage('./scanCode?type=3')">
						<image src="@/static/icons/scan_blue.png" class="ww24 hh24" />
						Scan
					</view>
				</view>
			
			<view class="goodsBox">
				<view class="between goodsItem" v-for="(item,index) in goodsList" :key="index">
					<view class="flex col_center">
						<view>{{item.categoryName}}</view>
						<view class="pl15">X{{item.num}} </view>
					</view>
					<image src="@/static/icons/delete.png"  class="ww24 hh24" @click="deleteHandle(item,index)" />
				</view>
			</view>
			</view>
			
			<view class="btns f14 text_white center"  @click="uploadGoods" v-if="goodsList.length > 0" >
			 <image src="@/static/icons/upload.png"  class="ww24 hh24"/>	<view class="ml8">Batch Warehousing</view>
			</view>
		</view>
		
		<van-popup v-model:show="showPicker" round position="bottom">
		<van-picker v-model="shelfVal" title="Layers" :columns="layersList"
		 confirm-button-text="Confirm" cancel-button-text="Cancel" @confirm="confirmShelfHandle" 
		:columns-field-names="{text:'name'}"
		@cancel="showPicker = false"
		  />
		</van-popup>
		
	
		
		<view style="height: 50px;"></view>
	</view>
</template>



<style lang="scss" scoped>
	.btns{
		height: 48px;
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		text-align: center;
		line-height: 48px;
		margin-top: 30px;
	}
	.goodsBox{
		padding: 12px 0;
		height: 400px;
		overflow: scroll;
	}

	.topBox{
		background: #fff;
		border-radius: 16px;
		.shelfBox{
			height: 107px;
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
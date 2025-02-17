<script setup>
	import request from '../../comm/request.ts'
	import {HWHJStore} from '@/store/hwhj.js'
	const HWHJStoreDeatil = HWHJStore()
	import {ref} from 'vue'
	// import {
	// 	useI18n
	// } from "vue-i18n";
	// const {t}  = useI18n();

	const shelfVal = ref([0])
	const layerVal = ref([0])
	// 弹窗columns
	const showPickerShelf = ref(false)
	// 弹窗confirm
	const confirmShelfHandle = e => {
		// choose shelf
		shelfVal.value = e.selectedValues
		showPickerShelf.value = false
	}

	const showPickerLayer = ref(false)
	const confirmLayerHandle = (e) => {
		if (layerList.value.length > 0) {
			layerList.value.forEach((item, index) => {
				if (item.value == Number(e.selectedValues[0])) {
					layerList.value.splice(index, 1)
				}
			})

			choLayerList.value.push(e.selectedValues[0])
			choLayerList.value.sort((a, b) => a - b)
			if (layerList.value.length > 0) {
				layerVal.value = [layerList.value[0].name]
			}

		}

		showPickerLayer.value = false
	}

	// 删除
	const deleteItem = (item,ind) => {
		let obj = {
			name:item,value:item
		}
		layerList.value.push(obj)
		layerList.value.sort((a, b) => a.value - b.value)
		choLayerList.value.splice(ind, 1)
	}
	const choLayerList = ref([])
	const shelfList = ref([])
	const layerListStatic = HWHJStoreDeatil.LAYERSLIST
	const layerList = ref([])



	const getShelfList = () => {
		request({
			url: '/admin-api/storage/overseas/goods-location/new-shelf-list/'
		}).then(res => {
			// 初始化数据
			shelfList.value = res.map(item => {
				return {
					name: item,
					value: item
				}
			})
			layerList.value = layerListStatic.map(item => {
				return {
					name: item,
					value: item
				}
			})
			shelfVal.value = [shelfList.value[0].name]
			// getShelfClass()
		})
	}
	getShelfList()


	const confirmAddHandle = ()=>{
		if(choLayerList.value.length == 0) return
		let floorList = choLayerList.value
		request({
			url:'/admin-api/storage/overseas/goods-location/create-shelf',
			data:{
				shelf:shelfVal.value[0],
				floorList
			},
			methods:'POST'
		}).then(res=>{
			
			
			uni.showToast({
				title:'Add success',
				icon:'none'
			})
			uni.navigateTo({
				url:'./index'
			})
		})
	}
	
	const goBack = ()=>{
		uni.navigateBack()
	}
</script>


<template>

	<view>
	<view class="pdlr10 pdtb10  between  topNav" >
		  <view class="left">
		    <image src="/static/icons/right.png" class="ww32 hh32"  @click="goBack" />
		  </view>
		  <view class="text_center  f17 ">
		    <van-text-ellipsis rows="1" content="Compile" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>
		<view class="mt20 pdlr12">
			<view class="between">
				<view class="f16 text_bold">New Shelves</view>
				<view class="colorAf f12">Please complete the required fields</view>
			</view>

			<view class="mt20 shelfBox between">
				<view class="f15">
					<span class="colorFc">*</span>
					Shelf
				</view>
				<view class="flex col_center" @click="showPickerShelf = true">
					{{shelfVal[0]}}
					<image src="@/static/icons/b_down.png" class="ww24 hh24" />
				</view>
			</view>


			<view class="mt47">
				<view class="between">
					<view>Layers</view>
					<view class="flex col_center f12" @click="showPickerLayer = true">
						<image src="@/static/icons/blue_add.png" class="ww12 hh12" />
						<view class="ml6 colorBlue">Add</view>
					</view>
				</view>
			</view>

			<view class="layersBox mt27">
				<view v-for="(item,index) in choLayerList" class="layersItem between">
					<view class="f15">Layer</view>
					<view class="flex col_center">
						<view class="mr5">{{item}}</view>
						<image src="@/static/icons/b_down.png" class="ww24 hh24" />
					</view>
					<view class="deleteIcon" @click.stop="deleteItem(item,index)">
						<image src="@/static/icons/rt_delete.png" class="ww14 hh14" />
					</view>
				</view>
			</view>
		</view>
		<!-- shelf -->
		<van-popup v-model:show="showPickerShelf" round position="bottom">
			<van-picker v-model="shelfVal" :title="'Shelf'" :columns="shelfList" confirm-button-text="Confirm"
				cancel-button-text="Cancel" @confirm="confirmShelfHandle" :columns-field-names="{text:'name'}"
				@cancel="showPickerShelf = false" />
		</van-popup>

		<van-popup v-model:show="showPickerLayer" round position="bottom">
			<van-picker v-model="layerVal" :title="'Layers'" :columns="layerList" confirm-button-text="Confirm"
				cancel-button-text="Cancel" @confirm="confirmLayerHandle" :columns-field-names="{text:'name'}"
				@cancel="showPickerLayer = false" />
		</van-popup>

		<view class="fixedBot">
			<view class="girdBtn">
				<view class="botBtn cancelBtn center color7C" @click="goBack">Cancel</view>
				<view class="botBtn  center text_white confirmBtn" :class="choLayerList.length == 0?'disabledBtn':''" @click="confirmAddHandle">
					Confirm</view>
			</view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.fixedBot {
		position: fixed;
		width: 100%;
		bottom: 0;

		.girdBtn {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			padding: 12px 10px;
			gap: 12px;
		}

		.botBtn {
			// width: 200px;
			height: 48px;
			border-radius: 48px 48px 48px 48px;
			margin-top: 120px;
		}

		.disabledBtn::after {
			display: block;
			position: absolute;
			content: '';
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.4);
		}

		.confirmBtn {
			background: #3178FC;
			position: relative;
		}

		.cancelBtn {
			background: #F3F3F3;
		}
	}

	.shelfBox {
		padding: 17px 12px;
		background: #F6F6F7;
		border-radius: 12px 12px 12px 12px;
	}

	.layersBox {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;

		.layersItem {
			position: relative;
			background: #F6F6F7;
			border-radius: 12px 12px 12px 12px;
			padding: 17px 9px 17px 12px;

			.deleteIcon {
				position: absolute;
				top: 0;
				right: 0;
			}
		}
	}
</style>
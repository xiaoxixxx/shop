<script setup>
	import request from '../../comm/request.ts';
	import {
		HWHJStore
	} from '@/store/hwhj.js'
	import {
		onMounted
	} from 'vue';
	const HWHJStoreDeatil = HWHJStore();
	import uvQrcode from "@climblee/uv-ui/components/uv-qrcode/uv-qrcode.vue";
	import {
		ref
	} from 'vue';

	import {
		onLoad
	} from '@dcloudio/uni-app';

	// 顶部取消按钮

	const shelfVal = ref(0)
	// 扫描到的商品列表
	const layersList = ref([])


	const deletePopInd = ref({})
	const showPopCenter = ref(false)
	// 删除
	const deleteHandle = (index) => {
		deletePopInd.value = index
		showPopCenter.value = true
		// layersList.value.splice(index, 1)
	}
	const confirmDeleteHandle = () => {
	

		request({
			url: '/admin-api/storage/overseas/goods-location/delete-floor?shelf=' + shelfVal.value +
				'&floor=' + layersList.value[deletePopInd.value],
			methods: "DELETE",

		}).then(res => {
			uni.showToast({
				title: 'Delete success',
				icon: 'none'
			})
			getClassList()
			showPopCenter.value = false
		})
	}

	const popObj = ref({})
	const showCenter = ref(false)
	const qrCodeData = ref("")
	const showQrCode = item => {
		qrCodeData.value = shelfVal.value + "-" + item
		// genCode(String(data))
		popObj.value = item
		showCenter.value = true
	}
	const qrcodeRef =ref("")
	const qrCodeComplete = (res)=>{
		console.log(qrcodeRef.value);
		console.log('生成成功');
	}
	const qrCodeBase64 = ref("")

	const downloadHandle = () => {
		qrcodeRef.value.save({
			success:res=>{
				uni.showToast({
					title:'Save Success',
					icon:'none'
				})
			}
		})
	}



	onLoad(e => {
		if (e.item) {
			shelfVal.value = e.item
			getClassList()
		}
	})

	const getClassList = () => {
		request({
			url: '/admin-api/storage/overseas/goods-location/floor-list/' + shelfVal.value
		}).then(res => {
			layersList.value = res.floorList.sort((a, b) => a - b)
			let arr = findDifferentValues(layerListStatic, res.floorList)
			layerList.value = arr.map(item => {
				return {
					name: item,
					value: item
				}
			})
		})
	}

	function findDifferentValues(arr1, arr2) {
		return [
			...arr1.filter(item => !arr2.includes(item)),
			...arr2.filter(item => !arr1.includes(item))
		];
	}
	const layerVal = ref([0])
	const layerListStatic = HWHJStoreDeatil.LAYERSLIST
	const layerList = ref([])
	const showPickerLayer = ref(false)
	const confirmLayerHandle = (e) => {
		request({
			url: '/admin-api/storage/overseas/goods-location/create-floor',
			methods: "POST",
			data: {
				shelf: shelfVal.value,
				floor: layerList.value[0].name
			}
		}).then(res => {
			uni.showToast({
				title: 'Add success',
				icon: 'none'
			})
			getClassList()
			showPickerLayer.value = false
		})
	}
	const goBack = () => {
		uni.navigateBack()
	}
</script>


<template>

	<view class="">

		<view class="pdlr10 pdtb10  between  topNav">
			<view class="left">
				<image src="/static/icons/right.png" class="ww32 hh32" @click="goBack" />
			</view>
			<view class="text_center  f17 ">
				<van-text-ellipsis rows="1" content="Details" class="text_bold " style="width: 100%;" />
			</view>
			<view class="right" style="min-width: 24px;">
				<slot></slot>
			</view>
		</view>
		<view class="pdlr12 mt20">
			<view class="topBox   ">
				<view class="mt19 shelfBox center flex-col" @click="showPicker = true">
					<view class="f24 text_bold">Shelf {{shelfVal}}</view>
					<view class="mt4 f15 color7C">current shelf</view>
				</view>
			</view>

			<view class="mt35 botBox ">
				<view class="between">
					<view class="f16 text_bold">Layers</view>
					<view class="flex col_center f12" @click="showPickerLayer = true">
						<image src="@/static/icons/blue_add.png" class="ww12 hh12" />
						<view class="ml6 colorBlue">Add</view>
					</view>
				</view>

				<view class="between goodsItem" v-for="(item,index) in layersList">
					<view class="flex col_center">
						<view class="f15 text_bold"> {{ shelfVal+'-'+item}}</view>
					</view>
					<view class="f13 colorBlue" @click="showQrCode(item)">
						QR Code
					</view>
					<view class="deleteIcon" @click="deleteHandle(index)">
						<image src="@/static/icons/rt_delete.png" class="ww14 hh14" />
					</view>
				</view>
			</view>
		</view>


		<view style="height: 50px;"></view>

		<van-overlay :show="showCenter">
			<view class="center flex_col pdtb30 codeBoxEl">
				<div id="imgNode">
					<view class="f22 text_bold text_center">{{shelfVal+'-'+popObj}}</view>
					<view class="f14 color7C mt4 text_center">current shelf</view>
					<!-- <image :src="qrCodeBase64" style="width:200px;height:200px" /> -->
					<view class="qrimg mgtb20">
						<uv-qrcode ref="qrcodeRef" size="150px" :value="qrCodeData" @complete="qrCodeComplete" ></uv-qrcode>
					</view>
				</div>
				<view class="codeBtn f14 text_white center" @click="downloadHandle">
					<image src="@/static/icons/downLoad.png" class="ww25 hh24" />
					Download
				</view>
				<view class="closeIconEl" @click="showCenter = false">
					<image src="@/static/icons/closeIcon.png" class="ww24 hh24" />
				</view>
			</view>
		</van-overlay>
		<van-popup v-model:show="showPickerLayer" round position="bottom">
			<van-picker v-model="layerVal" :title="'Layers'" :columns="layerList" confirm-button-text="Confirm"
				cancel-button-text="Cancel" @confirm="confirmLayerHandle" :columns-field-names="{text:'name'}"
				@cancel="showPickerLayer = false" />
		</van-popup>
		<van-popup v-model:show="showPopCenter" round style="width: 280px;">
			<view class="pt30 pdlr26 ">
				<view class="f15   text_center borderB pb24" style="line-height: 18px;">
					Are you sure you want to delete the current layer number?
				</view>
			</view>
			<view class="  pdlr20 ">
				<view class="girdBtn pop">
					<view class="botBtn cancelBtn center color7C" @click="showPopCenter = false">Cancel</view>
					<view class="botBtn  center text_white confirmBtn" @click="confirmDeleteHandle">Confirm</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>



<style lang="scss" scoped>
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

	.girdBtn {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}

	.botBtn {
		height: 48px;
		border-radius: 48px 48px 48px 48px;
	}

	.confirmBtn {
		background: #3178FC;
		position: relative;
	}

	.cancelBtn {
		background: #F3F3F3;
	}

	.borderB {
		border-color: #EFEFEF;
	}

	.codeBoxEl {
		background: #fff;
		border-radius: 30px;
		width: 280px;
		margin: 200px auto;
		position: relative;

		.closeIconEl {
			position: absolute;
			bottom: -50px;
		}
	}


	.codeBtn {
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		text-align: center;
		line-height: 40px;
		width: 160px;
		height: 40px;
	}



	.topBox {
		background: #fff;
		border-radius: 16px;

		.shelfBox {
			height: 107px;
			background: #F6F6F7;
			box-shadow: 0px 1px 19px 0px rgba(0, 0, 0, 0.02);
			border-radius: 16px 16px 16px 16px;
		}
	}

	.botBox {
		background: #fff;
		border-radius: 16px;
		padding: 16px 0;
	}

	.rightBtn {
		color: #3178FC;
	}

	.goodsItem {
		height: 58px;
		padding: 0 12px;
		background: #F6F6F7;
		box-shadow: 0px 1px 19px 0px rgba(0, 0, 0, 0.02);
		border-radius: 16px 16px 16px 16px;

		font-size: 14px;
		position: relative;

		.deleteIcon {
			position: absolute;
			right: 0;
			top: 0;
		}
	}

	.goodsItem:not(:first-child) {
		margin-top: 12px;
	}
</style>
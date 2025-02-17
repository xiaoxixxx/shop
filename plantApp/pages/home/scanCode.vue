<template>
	<view class="content">
		<view class="between pdlr20 pdtb10 topNav">
			<view @click="goBack">
				<image src="@/static/icons/back_white.png" class="ww24 hh24" />
			</view>
			<view class="text_white text_bold  f17">{{t('home.h_a1')}}</view>
			<view class="ww24"></view>
		</view>


		<view class="sectionview">
			<view id="qr-reader" style="width:100%;height:550px;"></view>
		</view>
		<view class="centerWord pdlr35 f13 text_white text_center" v-if="type == 1 || type == 5">

			{{t('home.h_a2')}}
		</view>
		<view class="centerWord pdlr35 f13 text_white text_center" v-if="type == 2">
			{{t('home.h_a3')}}
		</view>

		<!-- v-if="type != 4" -->
		<view class="botBtn center">
			<view class="inpEl mt24 flex col_center" @click="showPop = true">
				<image src="@/static/icons/info.png" class="ww24 hh24" />
				<view class="colorAf ml12">{{t('home.h_a4')}} </view>
			</view>
		</view>

		<van-popup v-model:show="showPop" round :style="{ padding: '30px 20px',width:'calc(100vw - 90px)' }"
			:closeable="true">
			<view>
				<view class="text_bold text_center f17">{{t('home.h_a5')}}</view>
				<view class="mt16 f11 colorAf text_center" style="line-height: 13px;">

					{{type != 2?t('home.h_a6'):t('home.h_a7')}}
				</view>

				<view class="inpEl mt30 flex col_center" style="width: calc(100% - 20px);background: #F1F1F3;">
					<image src="@/static/icons/info.png" class="ww24 hh24" />

					<input type="text" class="ml8" :placeholder="t('home.h_a4')" v-model="inpVal" />
				</view>

				<view class="btns f14 text_white" @click="popComfirm">
					{{t('setting.s_s6')}}
				</view>
			</view>
		</van-popup>
	</view>
</template>

<script setup>
	import request from '../../comm/request.ts'
	import {
		showToast
	} from 'vant';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		useI18n
	} from "vue-i18n";
	import {
		ref
	} from 'vue'
	const {
		locale,
		t
	} = useI18n();
	import {
		GDHPStore
	} from '@/store/gdhp.js';
	const GDHPStoreInfo = GDHPStore()

	import {
		HWHJStore
	} from '@/store/hwhj.js';
	const HWHJStoreInfo = HWHJStore()


	const showPop = ref(false)
	const cameraId = ref(0)
	const list = ref([])
	const getCameras = () => {

		// #ifdef APP
		// 扫描条码
		if(type.value == 4){
			uni.scanCode({
				scanType: ['qrCode' ],
				success(res) {
					inpVal.value = res.result
					console.log(res.result)
					popComfirm()
				},
				fail(e) {
					console.log(e)
				}
			})
		}else{
			uni.scanCode({
				scanType: ['barCode', 'qrCode', 'datamatrix'],
				success: function (res) {
					inpVal.value = res.result
					console.log(res.result)
					popComfirm()
				},
				complete() {
					console.log('扫面完成');
				}
			});
		}

		// #endif
	}

	const type = ref(0) // 1 收货  2 入库扫描货架号 ； 3 扫描商品上货架  4 // 出库

	onLoad(e => {
		if (e.type) {
			type.value = e.type
			getCameras()
		}
	})
	const inpVal = ref("")
	const popComfirm = () => {
		if (type.value == 1) {
			hwRecHandle('/pages/home/receiveSuccess', inpVal.value)
			
		} else if (type.value == 2) {
			vertifyShelf('/pages/home/warehouse', inpVal.value)
			
		} else if (type.value == 3) {
			hwWarehouseHandle('/pages/home/warehouse', inpVal.value)
		
		} else if (type.value == 4) {
			hwCollect('/pages/collect/index', inpVal.value)
			
		} else if (type.value == 5) {
			hwUserGet('/pages/collect/index', inpVal.value)
			
		} else if (type.value == 6) {
			gdShouhuo('/pages/gd/recive', inpVal.value)
			
		} else if (type.value == 7) {
			
			gdChuku('/pages/gd/warehouse', inpVal.value)
		}
		showPop.value = false
	}



	const hwUserGet = (url, val) => {
		request({
			url: '/admin-api/storage/overseas/goods/pickup',
			data: {
				orderNo: val
			},
			methods: "PUT"
		}).then(res => {
			uni.showToast({
				title: HWHJStoreInfo.$state.NOW_VERCODE + ' Delivery successful',
				icon: 'none'
			})
			HWHJStoreInfo.$state.USERSUCCESSGOODS.push(HWHJStoreInfo.$state.NOW_VERCODE)
			if (HWHJStoreInfo.$state.USERSUCCESSGOODS.length == HWHJStoreInfo.$state.USERGOODS.length) {
				uni.navigateTo({
					url: '../collect/collectSuccess'
				})
			} else {
				uni.navigateTo({
					url: '../collect/index'
				})
			}


		}).catch(e => {
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
			getCameras()
		})
	}
	// 海外提货
	const hwCollect = (url, val) => {
		// 8-1-71514404
		request({
			url: '/admin-api/storage/overseas/goods/pickup-goods-list/' + val,
		}).then(res => {
			HWHJStoreInfo.$state.PICKCODE = val
			HWHJStoreInfo.$state.USERGOODS = res
			uni.navigateTo({
				url: '../collect/index'
			})
		}).catch(e => {
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
			getCameras()
		})
	}

	// 海外 入库
	const hwWarehouseHandle = (url, val) => {

		request({
			url: '/admin-api/storage/overseas/goods/get-info/' + val,
		}).then(res => {
			if(HWHJStoreInfo.$state.warehouseList.findIndexOf(res) == -1){
				HWHJStoreInfo.$state.warehouseList.push(res)
				uni.navigateTo({
					url
				})
			}else{
				uni.showToast({
						title:'Please do not scan again',
						icon:'none'
				})
			}
		
		}).catch(e => {
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
			getCameras()
		})
	}


	// 海外校验 货柜
	const vertifyShelf = (url, val) => {
		let arr = val.split('-')
		request({
			url: '/admin-api/storage/overseas/goods-location/exist',
			data: {
				shelf: arr[0],
				floor: arr[1]
			}
		}).then(res => {
			if (res) {
				HWHJStoreInfo.$state.default_shelf = arr
				uni.navigateTo({
					url: './warehouse'
				})
			} else {
				uni.showToast({
					title: 'Container does not exist',
					icon: 'none'
				})
				
			}
		}).catch(e=>{
			uni.showToast({
				title:e.msg,
				icon:'none'
			})
		})
	}

	// 广州 收货
	const gdShouhuo = (url, val) => {
		request({
			url: '/admin-api/storage/local/goods/receive',
			data: {
				supplierLogisticsNo: val
			},
			methods: 'POST'
		}).then(res => {
			uni.showToast({
				title: '收货成功',
				icon: 'none'
			})
			changePage(url, val)
		}).catch(e => {
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
			getCameras()
		})
	}

	// 广州 出库
	const gdChuku = (url, val) => {
		let storageType;
		try {
			storageType = GDHPStoreInfo.$state.outboundList[0].storageType
		} catch (e) {
			//TODO handle the exception
		}
		request({
			url: '/admin-api/storage/local/goods/get-for-outbound',
			data: {
				orderNo: val,
				storageType
			},
		}).then(res => {

			// let flag = GDHPStoreInfo.$state.outboundList.some(item=>item.orderNo == res.orderNo)
			if (!GDHPStoreInfo.$state.outboundList.some(item => item.orderNo == res.orderNo)) {
				GDHPStoreInfo.addToList(res)
			} else {
				uni.showToast({
					title: '该商品已添加',
					icon: 'none'
				})
			}
			changePage(url, inpVal.value)
		}).catch(e => {
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
			getCameras()
		})
	}

	// 海外 收货
	const hwRecHandle = (url, val) => {
		request({
			url: '/admin-api/storage/overseas/goods/receive',
			data: {
				orderNo: val
			},
			methods: "POST"
		}).then(res => {
			GDHPStoreInfo.$state.reviceObj = res
			changePage(url, val)
		}).catch(e=>{
			uni.showToast({
				title:e.msg,
				icon:'error'
			})
			getCameras()
		})
	}

	// 海外 入库
	const hwWareHandle = (url, val) => {
		request({
			url: '/admin-api/storage/overseas/goods/receive',
			data: {
				orderNo: val
			},
			methods: "POST"
		}).then(res => {
			GDHPStoreInfo.$state.reviceObj = res
			changePage(url, val)
		})
	}
	const changePage = (url, code) => {
		uni.navigateTo({
			url: url + '?code=' + code
		})
	}
	



	const goBack = () => {
		uni.navigateTo({
			url: '../tab/index'
		})
	}
</script>

<style lang="scss" scoped>
	.btns {
		height: 48px;
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		text-align: center;
		line-height: 48px;
		margin-top: 30px;
	}

	.inpEl {
		background: #2B2B2B;
		border-radius: 8px 8px 8px 8px;
		padding: 0 9px;
		height: 36px;
		width: 202px;
	}

	.botBtn {
		line-height: 19px;
		position: fixed;
		bottom: 100px;
		width: 100%;
	}

	.content {
		background: #090909;
		height: 100vh;
		overflow: hidden;
	}

	.centerWord {
		color: rgba(255, 255, 255, 0.8);
		line-height: 19px;
		position: fixed;
		bottom: 150px;
	}
</style>
<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'
	import {
		showToast
	} from 'vant';
	import useClipboard from 'vue-clipboard3';
	const {
		toClipboard
	} = useClipboard();
	import {
		ref,
		onMounted
	} from 'vue'
	import {
	  onLoad
	} from '@dcloudio/uni-app';

	const showPopCenter = ref(false)

	const popConfirmHandle = () => {
		request({
			url: '/admin-api/storage/local/goods/outbound/cancel',
			data: {
				outboundId: deatilId.value
			},
			methods: 'PUT'
		}).then(res => {
			showPopCenter.value = false
			uni.showToast({
				title: '取消成功',
				icon: 'none'
			})
			uni.navigateTo({
				url: '/'
			})
		}).catch(e => {
			uni.showToast({
				title: e.msg,
				icon: 'none'
			})
		})
		// showPopCenter.value = false
	}

	const deatilId = ref("")
	onLoad((e) => {
		if(e.id){
			deatilId.value = e.id
			getPageDeatil(deatilId.value)
		}
	})
	
	const pageData = ref({
		itemList: [

		]
	})
	const getPageDeatil = (id) => {
		request({
			url: '/admin-api/storage/local/goods/outbound/detail/' + id,
			method: 'GET'
		}).then(res => {
			pageData.value = res
			console.log(res)
		})
	}

	const goBack = () => {
		uni.navigateBack()
	}
</script>


<template>

	<view class="content">


		<view class="pdlr10 pdtb10  between  topNav">
			<view class="left">
				<image src="/static/icons/right.png" class="ww32 hh32" @click="goBack" />
			</view>
			<view class="text_center  f17 ">
				<van-text-ellipsis rows="1" content="出库详情" class="text_bold " style="width: 100%;" />
			</view>
			<view class="right" style="min-width: 24px;">
				<slot></slot>
			</view>
		</view>

		<view class="mt12 pdlr12">
			<view class="topBox pdlr12 pt21 pb16">
				<view class="f14">仓储类型</view>
				<view class="mt19 shelfBox center flex-col">
					<view class="f20 text_bold colorBlue">{{pageData.storageTypeName}}</view>
				</view>
			</view>
			<view class="mt12 copyBox">
				<view class="pb6 f14">
					商品总数 x {{pageData.itemList.length}}
				</view>
				<view class=" mt12 between dataItem" v-for="(item,index) in pageData.itemList" :key="index">
					<view>
						<view class="f15 text_bold">{{item.categoryName}}</view>

					</view>
					<view class="printBtn  f12 center">
						x{{item.num}}
					</view>
				</view>
			</view>

			<view class="fixedBot">
				<view class="girdBtn">
					<view class="botBtn  center text_white confirmBtn">打印面单</view>
					<view class="botBtn cancelBtn center color7C" @click="showPopCenter = true">取消出库</view>
				</view>
			</view>
		</view>


		<van-popup v-model:show="showPopCenter" round style="width: 280px;">
			<view class="pt30 pdlr26 ">
				<view class="f15   text_center borderB pb24" style="line-height: 18px;">
					取消出库将删除此清单项，相关货品状态变更为“已收货”
				</view>
			</view>
			<view class=" pop  pdlr20 pdtb16">
				<view class="girdBtn">
					<view class="botBtn cancelBtn center color7C" @click="showPopCenter = false">取消</view>
					<view class="botBtn  center text_white confirmBtn" @click="popConfirmHandle">确认</view>
				</view>
			</view>
		</van-popup>

	</view>
</template>



<style lang="scss" scoped>
	.pop {
		.girdBtn {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
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
	}

	.fixedBot {
		width: 100%;
		margin-top: 140px;

		.girdBtn {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			padding: 12px 10px;
			gap: 8px;
			direction: rtl;
		}

		.botBtn {
			width: 110px;
			height: 44px;
			border-radius: 48px 48px 48px 48px;
			line-height: 44px;
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
			background: #fff;
		}
	}

	.copyBox {
		background: #fff;
		border-radius: 20px;
		padding: 18px 12px;

		.dataItem {
			padding: 18px 12px;
			background: #F6F6F7;
			border-radius: 8px;
		}
	}

	.topBox {
		background: #fff;
		border-radius: 16px;

		.shelfBox {
			height: 56px;
			background: #F6F6F7;
			box-shadow: 0px 1px 19px 0px rgba(0, 0, 0, 0.02);
			border-radius: 16px 16px 16px 16px;
		}
	}
</style>
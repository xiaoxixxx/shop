<script setup>

	import request from '../../comm/request.ts';
	import { ref} from 'vue'
	import {
		showToast
	} from 'vant';
	import useClipboard from 'vue-clipboard3';
	
	import {
	  onLoad
	} from '@dcloudio/uni-app';
	
	const {
		toClipboard
	} = useClipboard();

	const copyHandle = async (data) => {
		// #ifdef H5
		try {
			await toClipboard(data);
			uni.showToast({
				title: 'Copy Success',
				icon: 'none'
			})
		} catch (e) {
			console.log(e)
			//TODO handle the exception
		}
		// #endif
		
		// #ifdef APP
			uni.setClipboardData({
				data: data,
				success: function () {
					uni.showToast({
						title: 'Copy Success',
						icon: 'none'
					})
				}
			});
		// #endif
		
	}
	const changePage = url => {
		uni.navigateTo({
			url
		})
	}
	const pages = ref({
		pageSize: 10,
		pageNo: 1
	})
	const dataList = ref([])
	const paging = ref("")
	const pageData = ref("")
	
	const codeVal = ref("")
	onLoad(e=>{
		if(e.code){
			codeVal.value = e.code
			queryList()
		}
	})
	const queryList = () => {
		request({
			url: '/admin-api/storage/local/goods/get-logistics-info/' + codeVal.value,

		}).then(res => {
			pageData.value = res
			dataList.value = res.orderSheetList
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
		    <van-text-ellipsis rows="1" content="收货" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>

		<view class="mt20 pdlr12">
			<view class="color7C">
				供应商物流单号
			</view>
			<view class="mt12 copyBox between ">
				<view class="f20 text_bold">{{pageData.supplierLogisticsNo}}</view>
				<image src="@/static/icons/b_copy.png" class="ww18 hh18"
					@click="copyHandle(pageData.supplierLogisticsNo)" />
			</view>

			<view class="mt30 f13 color7C">
				{{pageData.categoryName}} x{{pageData.goodsNum}}
			</view>

			<view class="copyBox mt12 between" v-for="(item,index) in dataList" :key="index">
				<view>
					<view class="f15"> {{item.receiverName + ' ' + item.receiverMobile}}</view>
					<view class="mt4 f12 colorAf">
						单号:{{item.orderNo}}
					</view>
				</view>
			</view>
			<!-- </z-paging> -->

		</view>
		<view style="height: 100px;"></view>

		<view class="fixedBot">
			<view class="pdlr12 pb10">
				<view class="botBtn  center text_white confirmBtn" @click="changePage('./reciveSuccess')">Confirm</view>
			</view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.fixedBot {
		position: fixed;
		width: 100%;
		bottom: 0;

		.botBtn {
			// width: 200px;
			height: 48px;
			border-radius: 48px 48px 48px 48px;
			background: #3178FC;
		}


	}

	.printBtn {
		color: #3178FC;
		border: 1px solid #3178FC;
		border-radius: 50px;
		height: 28px;
		padding: 0 10px;
	}

	.copyBox {
		height: 64px;
		background: #F6F6F7;
		border-radius: 8px 8px 8px 8px;
		padding: 0 12px;
	}
</style>
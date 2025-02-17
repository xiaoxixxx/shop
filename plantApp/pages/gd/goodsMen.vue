<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'
	import { ref} from 'vue'
	import useClipboard from 'vue-clipboard3';

	import {
		timeFormat
	} from '../../comm/useGoods.js'
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

	const tabActive = ref(0)
	const changeHandle = e => {
		tabActive.value = e
		paging.value.clean()
		queryList(1)
	}
	const tabsList = ref([])

	const dataList = ref([])
	const paging = ref("")
	const pages = ref({
		pageNo: 1,
		pageSize: 10,
		status: 0
		// status:tabsList.value[tabActive.value].type
	})

	const getTypeList = () => {
		request({
			url: '/admin-api/storage/local/goods/status-list',
		}).then(res => {
			tabsList.value = res
			queryList(1)
		})
	}
	getTypeList()
	const queryList = (page) => {
		pages.value.status = tabsList.value[tabActive.value].type
		pages.value.pageNo = page
		request({
			url: '/admin-api/storage/local/goods/page',
			data: pages.value

		}).then(res => {
			pages.value.pageNo++;
			// tabsList.value = res
			paging.value.complete(res.list)
		})

	}
	
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
		    <van-text-ellipsis rows="1" content="Management" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>
		<view v-if="tabsList.length>0">
			<view class="flex tabListEl">
				<view class="tabItem"  v-for="(item,index) in tabsList" :class="tabActive== index?'actTabItem':''" :key="index" @click="changeHandle(index)">
					{{item.name}}
				</view>
			</view>
		</view>


		<view class="mt12 pdlr12">
			<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
				:refresher-enabled="false" :auto="false">
				<view v-for="(item,index) in dataList" class="dataItem" :key="index">
					<view class="between">
						<view class="f12 colorAf flex col_center">订单流水号:{{item.orderNo}} <image
								src="@/static/icons/copy.png" class="ww14 hh14 ml8" @click="copyHandle(item.orderNo)" />
						</view>
						<view class="f11 rightEl center"
							:class="item.status == 1 ?'Received':item.status == 2?'Warehoused':'Outbound'">
							{{item.statusInfo}}
						</view>
					</view>
					<view class="mt12 goodsBox between">
						<view class="f16 text_bold">{{item.categoryName}}</view>
						<view class="f13">x{{item.num}}</view>
					</view>
					<view class="mt12  between f12 colorAf">
						<view class=" ">{{timeFormat(item.time,'yyyy:mm:dd hh:MM:ss')}}</view>
						<view class="ml30"> 操作人：{{item.operatorName}}</view>

						<view class="printBtn  f12 center">
							打印面单
						</view>
					</view>
				</view>
			</z-paging>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.tabListEl{
		background: #fff;
		justify-content: space-around;
		padding:  0 10rpx ;
		height: 88rpx;
		line-height: 88rpx;
		.tabItem{
			width: 100%;
			color: #afafaf;
			font-size: 14px;
			text-align: center;
		}
		.actTabItem{
			color: #3178FC;
			font-weight: bold;
			position: relative;
		}
		.actTabItem::after{
			position: absolute;
			display: block;
			content: '';
			width: 30px;
			height: 4px;
			background: #3178FC;
			border-radius: 50px;
			left: 50%;
			transform: translateX(-50%);
			bottom: 10rpx;
		}
	}

	// title-active-color="#3178FC" title-inactive-color="#AFAFAF"
	// 	color="#3178FC" 
	.printBtn {
		// width: 200px;
		padding: 10px 10px;
		border-radius: 48px 48px 48px 48px;
		background: #3178FC;
		color: #fff;
	}

	.goodsBox {
		height: 51px;
		background: #F6F6F7;
		border-radius: 8px 8px 8px 8px;
		padding: 0 16px 0 9px;
	}

	.rightEl {
		padding: 0 7px;
		height: 25px;
		border-radius: 4px 4px 4px 4px;
	}

	.Received {
		background: rgba(21, 209, 77, 0.1);
		color: #09AC00;
	}

	.Warehoused {
		background: rgba(49, 120, 252, 0.1);
		color: #3178FC;
	}

	.Outbound {
		color: #7C7C7C;
		background: rgba(241, 241, 241, 0.7);
	}

	.dataItem {
		padding: 17px 12px;
		background: #fff;
		border-radius: 10px;
		margin-bottom: 12px;
	}
</style>
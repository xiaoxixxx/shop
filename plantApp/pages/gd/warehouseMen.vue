<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'

	import useClipboard from 'vue-clipboard3';
	import {
		timeFormat
	} from '../../comm/useGoods.js';
	import {
		ref
	} from 'vue'
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


	const dataList = ref([])

	const paging = ref("")
	const pages = ref({
		pageNo: 1,
		pageSize: 10
	})
	const queryList = (page) => {
		pages.value.pageNo = page
		request({
			url: '/admin-api/storage/local/goods/outbound/page',
			data: pages.value
		}).then(res => {
			paging.value.complete(res.list)
			pages.value.pageNo++;
		})
	}
	// queryList()
	const allChecked = ref(false)

	const childBoxChange = e => {
		e.checked = !e.checked
		if (e.checked ) {
			let arr = dataList.value.filter(item => {
				return item.checked
			})
			if (arr.length == dataList.value.length) {
				allChecked.value = true
			} else {
				allChecked.value = false
			}
		} else {
			allChecked.value = false
		}
	}

	const parentChange = e => {
		allChecked.value = !allChecked.value
		dataList.value.forEach(item => {
			item.checked = allChecked.value
		})
	}

	const changePage = url => {
		uni.navigateTo({
			url
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
				<van-text-ellipsis rows="1" content="出库管理" class="text_bold " style="width: 100%;" />
			</view>
			<view class="right" style="min-width: 24px;">
				<image src="@/static/icons/search.png" class="ww24 hh24" />
			</view>
		</view>


		<view class="mt12 pdlr12">


			<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
				:refresher-enabled="false">

				<view v-for="(item,index) in dataList" class="dataItem" :key="index">
					<view class="flex col_center">
						<view>
							<image :src="item.checked?'/static/icons/actChe.png':'/static/icons/invChe.png'" class="ww18 hh18"
							  
							  @click="childBoxChange(item)"></image>
						</view>
						<view class="ml13 flex1">
							<view class="between  ">
								<view class="f12 colorAf flex col_center">包装编号:{{item.no}}
									<image src="@/static/icons/copy.png" class="ww14 hh14 ml8"
										@click="copyHandle(item.no)" />
								</view>
								<view @click="changePage('./warehouseDeatil?id='+item.id)">
									<image src="@/static/icons/g_right.png" class="ww24 hh24" />
								</view>
							</view>
							<view class="mt12 goodsBox between">
								<view class="f16 text_bold">{{item.storageTypeName}}</view>
								<view class="f13">x{{item.num}}</view>
							</view>
							<view class="mt12  flex col_center f12 colorAf">
								<view class=" ">{{timeFormat(item.time,'yyyy:mm:dd hh:MM:ss')}}</view>
								<view class="ml30"> 操作者：{{item.creatorName}}</view>
							</view>
						</view>
					</view>
				</view>

			</z-paging>
		</view>

		<view class="fixedBot">
			<view class="pdlr12 pb10 between pt4">
				<view class="flex col_center">
					<image :src="allChecked?'/static/icons/actChe.png':'/static/icons/invChe.png'" class="ww18 hh18"  @click="parentChange(allChecked)"></image>
				 						<span class="f14 color7C pl5">全选</span></view>
				<view class="botBtn  center text_white ">打印面单</view>
			</view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.fixedBot {
		position: fixed;
		width: 100%;
		bottom: 0;
		background: #fff;

		.botBtn {
			width: 110px;
			height: 48px;
			border-radius: 48px 48px 48px 48px;
			background: #3178FC;
		}


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
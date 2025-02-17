<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import {
		showToast
	} from 'vant';
	import {
		cartStore
	} from '@/store/cart';
	import {
		useI18n
	} from "vue-i18n";
import request from '../../../comm/request.ts'
import {timeFormat} from '../../../comm/useGoods.js'
	const {
		t
	} = useI18n();
	const cartStoreDeatil = cartStore();

import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()
const userInfo = computed(() => {
  return userStoreInfo.$state.userInfo
})

	const titleActInd = ref(0)
	const topTitle = ref([
		'Obtain points',
		'use points'
	])
	
	
	const dataList = ref([])
	const paging = ref("")
	const pages = ref({
		pageNo:1,
		pageSize:10
	})

	const queryList = (page)=>{
		pages.value.pageNo = page
		uni.showLoading()
		request({
			url:'/app-api/member/point/record/page',
			data:{
				...pages.value,
				addStatus:!titleActInd.value?true:false
			}
		}).then(res=>{
			paging.value.complete(res.list)
			pages.value.pageNo++;
		}).finally(()=>{
			uni.hideLoading()
		})
		
		
	}
	
	const changeActInd = ind=>{
		titleActInd.value = ind
		paging.value.clean()
		dataList.value = []
		queryList(1)
	}
</script>


<template>

	<view class="pointsBg">
		<topNavbar :title="'Points'"></topNavbar>

		<view class="mt30 pl20 pr12 between">
			<view class="flex col_center">
				<img src="@/static/my/coins.png" class="ww32 hh32" />
				<view class="mainColor f24 text_bold ml8"> {{userInfo.point}}</view>
				<view class="secondColor f10  ml8 mt5"> points</view>
			</view>

			<view class="exchangeEl flex col_center">
				<img src="@/static/my/exchangeIcon.png" class="ww16 hh16" />
				<view class="ml10 f10 thirdColor">1 point = 0.1 dollar</view>
			</view>
		</view>

		<view class="pdlr12 mt16">
			<view class="titleBox flex col_center ">
				<view v-for="(item,index) in topTitle" class="titleItem" :class="titleActInd == index?'titleActEl':''"
					@click="changeActInd(index)">
					{{item}}
				</view>
			</view>
			
			<view class=" mt16">
			<!-- 	<view class="listBox">
										<view v-for="item in data" class="listItem between">
											<view>
												<view class="f14 text_bold">{{item.name}}</view>
												<view class="mt8 colorAf f12">{{item.time}}</view>
											</view>
											<view class="colorFc text_bold f16">+{{item.value}}</view>
										</view>
				</view> -->
				<z-paging ref="paging"   v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
				  :refresher-enabled="false" >
	
				  <view class="listBox" v-if="dataList.length > 0">
						<view v-for="item in dataList" class="listItem between">
							<view>
								<view class="f14 text_bold">{{item.description}}</view>
								<view class="mt8 colorAf f12">{{ timeFormat(item.createTime,'yyyy-mm-dd hh:MM:ss')}}</view>
							</view>
							<view class="colorFc text_bold f16" v-if="!titleActInd ">+{{item.point}}</view>
							<view class="colorDel text_bold f16" v-else>+{{item.point}}</view>
						</view>
				  </view>
				</z-paging>
			</view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.listBox{
		background: #fff;
		padding: 13px 20px;
		border-radius: 16px;
		.listItem:not(:last-child){
			padding-bottom: 20px;
			border-bottom: 1px solid #EFEFEF;
		}
		.listItem:not(:first-child){
			padding-top: 20px;
		}
	}
	.titleBox {
		height: 59px;
		background: #fff;
		border-radius: 16px;
		font-size: 16px;
		font-weight: bold;

		.titleItem {
			width: 50%;
			text-align: center;

		}

		.titleActEl {
			background: linear-gradient(to right, #772ACD, #7526CD);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			position: relative;
		}
		.titleActEl::after{
			position: absolute;
			display: block;
			content: '';
			bottom: -8px;
			width: 33px;
			height: 4px;
			background: linear-gradient( 96deg, #9F58EF 0%, #8730E8 100%);
			border-radius: 2px 2px 0px 0px;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.pointsBg {
		background-image: url('@/static/my/pointsBg.png');
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: top;
		min-height: 100vh;
		background-color:rgba(217, 217, 217, 0.1);
		.mainColor {
			color: #5E0C7B;
		}

		.secondColor {
			color: #450E59;
		}

		.thirdColor {
			color: #2F0866;
		}

		.exchangeEl {
			background: rgba(255, 255, 255, 0.5);
			border-radius: 11px 11px 11px 11px;
			padding: 3px 12px 3px 6px;
		}
	}
</style>
<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import {
		showToast
	} from 'vant';
	import request from '../../../comm/request.ts';
	import {
		fen2yuan,
		timeFormat
	} from '../../../comm/useGoods.js'
	import {
		cartStore
	} from '@/store/cart';
	const cartStoreDeatil = cartStore();
	import cancelOrder from '@/components/pop/cancelOrder.vue';
	import {
		useI18n
	} from "vue-i18n";
	const {
		t
	} = useI18n();
	import useClipboard from 'vue-clipboard3';
	import QRCode from 'qrcode';
	const {
		toClipboard
	} = useClipboard();

	const copyHandle = async (data) => {
		try {
			await toClipboard(data);
			showToast(t('pay.ord_j1'));
		} catch (e) {
			console.log(e)
			//TODO handle the exception
		}
	}
	const tabsList = computed(() => {
		return [{
				name: t('pay.ord_li_j1'),
				value: -1
			},
			{
				name: t('pay.ord_li_j2'),
				value: 0
			},
			{
				name: t('pay.ord_li_j3'),
				value: 10
			},
			{
				name: t('pay.ord_li_j4'),
				value: 30
			},
			{
				name: t('pay.ord_li_j5'),
				value: 40
			},
		]
	})



	const tabActive = ref(0)
	const dataList = ref([])
	const paging = ref("")
	const pages = ref({
		pageNo: 1,
		pageSize: 10
	})

	const queryList = (page) => {
		let tempData = []
		uni.showLoading()
		pages.value.pageNo = page
		if (tabActive.value !== 0) {
			pages.value.status = tabsList.value[tabActive.value].value
			if (pages.value.status == 40) {
				pages.value.commentStatus = false
			} else {
				if(pages.value.commentStatus || !pages.value.commentStatus){
					delete pages.value.commentStatus
				}
			}
		} else {
			
			delete pages.value.status
		}
		request({
			url: '/app-api/trade/order/page',
			data: {
				...pages.value
			}
		}).then(res => {
			uni.hideLoading()
			// paging.value.complete([...res.list, ...res.list])
			paging.value.complete(res.list)
			pages.value.pageNo++
		}).finally(() => {
			uni.hideLoading()
		})
		// paging.value.complete(tempData)
	}

	const changeHandle = e => {
		tabActive.value = e
		paging.value.clean()
		queryList(1)
	}

	onMounted(() => {
		if (window.location.search.includes('status=')) {
			tabActive.value = Number(window.location.search.split('status=')[1])
		}
		queryList(1)
	})

	const goPayDeatil = id => {
		uni.navigateTo({
			url: './orderDeatil?id=' + id
		})
	}
	
	
	const cancelOrderRef = ref("")
	const cancelId = ref(0)
	const cancelClick = id => {
		// console.log(id)
		cancelId.value = id
		cancelOrderRef.value.showBottom = true
	}
	const afterCancelHandle = id => {
		paging.value.clean()
		queryList(1)
	}


	const deleteOrder = id => {
		// /app-api/trade/order/delete?id=235
		uni.showLoading()
		request({
			url: '/app-api/trade/order/delete?id=' + id,
			methods: 'DELETE'
		}).then(res => {
			uni.hideLoading()
			paging.value.clean()
			showToast(t('pay.ord_li_j6'))
			queryList(1)
		})
	}
	// 确认收货
	const confirmHandle = (id) => {
		uni.showLoading()
		request({
			url: '/app-api/trade/order/receive?id=' + id,
			methods: 'PUT'
		}).then(res => {
			uni.hideLoading()
			paging.value.clean()
			showToast(t('pay.ord_li_j7'))
			queryList(1)
		})

	}
	const changePage = url => {
		uni.navigateTo({
			url
		})
	}
	
	const doShowToast = ()=>{
		showToast(t('add1.a_a1'))
	}
	
	
	const ORDER_STATUS  =  {
		0:t('pay.ord_li_j2'),
		10:t('pay.ord_li_j3'),
		20:t('pay.ord_li_j4'),
		30:t('add1.a_a3'),
		40:t('pay.ord_li_h6'),
		50:t('pay.ord_li_h9')
	}
	
	
	const showCenter = ref(false)
	const qrCodeBase64 = ref("")
	
	const showQrCode = (item) => {
		let data = item.pickUpVerifyCode
		showCenter.value = true
		genCode(String(data))
	}
	const genCode = async (text) => {
		try {
			// 生成二维码
			qrCodeBase64.value = await QRCode.toDataURL(text);
		} catch (error) {
			console.error('生成二维码失败:', error);
		}
	}
	
</script>


<template>
	<view>
		<view>
			<topNavbar :title="t('pay.ord_li_h1')" :backUrl="'/pages/tabbar/my'" :isWhiteBg="false"></topNavbar>
		</view>
		<view>
			<van-sticky :offset-top="55">
				<van-tabs v-model:active="tabActive" shrink swipeable title-active-color="#090909"
					title-inactive-color="#7c7c7c" color="#9F58EF" line-width="20" line-height="4"
					@change="changeHandle">
					<van-tab v-for="(item,index) in tabsList" :title="item.name" :key="item.id">
					</van-tab>
				</van-tabs>
			</van-sticky>

			<view class=" mt10 hh8 mainf8Bg" v-if="dataList.length !== 0 "></view>
			<view class="">
				<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
					:refresher-enabled="false" :auto="false"  empty-view-text=" ">
					<!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
					<!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
					<view class="listBox">
						<view v-for="(item,index) in dataList" class="  ">
							<view class="pdlr12 pt20">
								<view class="between pb12 borderB">
									<view class="f12 color7C flex col_center">{{t('chat.c_h1') +item.no}} <img
											src="@/static/icons/copy.png" class="ww14 hh14 ml4"
											@click.stop="copyHandle(item.no)"> </view>
									<view class="f13">
										<view v-if="item.status == 0" class="colorFc">{{ORDER_STATUS[item.status]}}</view>
										<view v-else-if="item.status == 10" class="colorContent">{{ORDER_STATUS[item.status]}}
										</view>
										<view v-else-if="item.status == 20" class="color7C"> {{ORDER_STATUS[item.status]}}
										</view>
										<view v-else-if="item.status ==30" class="color7C"> {{ORDER_STATUS[item.status]}}
										</view>
										<view v-else-if="item.status ==40" class="color7C"> {{t('pay.ord_li_h5')}}
										</view>
										<view v-else class="color7C">{{t('all.can')}} 
										</view>
									</view>
								</view>
								<view class="mt12  pb12 borderB " v-for="ite in item.items"
									@click.stop=" item.status == 0 || item.status == 10 || item.status == 30?goPayDeatil(item.id):changePage('../goods/goodsDeatils?id='+item.items[0].spuId)">
									<view class="flex goodsItem ">
										<view>
											<van-image class="ww80 hh80" :src="ite.picUrl" lazy-load radius="10px">
												<template v-slot:loading>
													<van-loading type="spinner" size="20" />
												</template>
											</van-image>
										</view>
										<view class="ml12 flex1">
											<view class="between">
												<view class="f15 text_bold">
													<van-text-ellipsis rows="1" :content="ite.spuName" />
												</view>
												<view class="f12 text_bold">x{{ite.count}}</view>
											</view>
											<view class="f12 flex col_center  mt4 colorDel">
												<view class="mr5" v-for="(tag,tagInd) in ite.properties">
													{{tag.propertyName+':'+tag.valueName}} <span
														v-if="tagInd < ite.properties.length -1">
														|</span>
												</view>
											</view>
											<view class=" flex mt20">
												<view class="f14 text_bold mr4">${{fen2yuan(item.payPrice)}}</view>
												<!-- <del class="f14 colorAf">$84</del> -->
											</view>
										</view>
									</view>

								</view>

								<view class="between f12 pt12">
									<view class="color7C">{{item.productCount}} {{t('pay.ord_li_h7')}}</view>
									<view class="text_bold">{{t('pay.ord_h2')}} : ${{fen2yuan(item.payPrice)}}</view>
								</view>

								<view class="botBtn f12 mt12">
									
								
									<view class="flex" v-if="item.status == 0">
										<view class="btnCancel btn   mr10 " @click.stop="cancelClick(item.id)">
											{{t('all.can')}}
										</view>
										<view class="btnPay btn  text_white " @click.stop="goPayDeatil(item.id)">
											{{t('pay.ord_h6')}}
										</view>
									</view>

									<view class="btnPay btn  text_white " v-else-if="item.status == 	10"  @click="doShowToast">
										{{ORDER_STATUS[item.status]}}
									</view>

									<view class="btnPay btn  text_white " v-else-if="item.status == 	20"
										@click.stop="confirmHandle">
										{{ORDER_STATUS[item.status]}}
									</view>
									<view class="btnPay btn  text_white " v-else-if="item.status == 	30"
										@click.stop="showQrCode(item)">
										{{ORDER_STATUS[item.status]}}
									</view>
									
									<view class="flex " v-else-if="item.status == 40 && !item.commentStatus ">
									<view class="btnCancel btn  color333 mr10 " 
										@click.stop="deleteOrder(item.id)">
										{{ORDER_STATUS[50]}}
									</view>
										<view class=" reviewbtn text_white f14  "
											@click.stop="changePage('./addReviews?id='+item.items[0].id)">
											{{ORDER_STATUS[item.status]}}
										</view>
									</view>
									

									<view class="btnCancel btn  color333 " v-else-if="item.status == 50"
										@click.stop="deleteOrder(item.id)">
										{{ORDER_STATUS[item.status]}}
									</view>



								</view>
							</view>
							<view class=" mt10 hh8 mainf8Bg" v-if="index+1<dataList.length"></view>
						</view>

					</view>
				</z-paging>
			</view>
		</view>
		<cancelOrder :updateFun="afterCancelHandle" :orderId="cancelId" ref="cancelOrderRef"></cancelOrder>

		<view v-if="dataList.length == 0 " class="nullDataBoxEl">
			<view class="center flex_col nullDataEl">
				<img src="@/static/pay/nullOrder.png" class="" />
				<view class="mt20 f20 text_bold">{{t('pay.ord_li_h10')}}</view>
				<view class="mt12 f12 colorCCC">
					{{t('pay.ord_li_h11')}}
				</view>
				<view class="feedBackEl center mt60 f14 text_white" @click="changePage('/')">
					{{t('pay.ord_li_h12')}}
				</view>
			</view>
		</view>
		
		
		
		<van-overlay :show="showCenter">
			<view class="center flex_col pdtb30 codeBoxEl">
				<div id="imgNode">
					<view class="f22 text_bold text_center">Pickup Code</view>
					<img :src="qrCodeBase64" style="width:180px;height:180px">
					<view class="f11 text_center color7C">
						Scan the pickup code
					</view>
				</div>
				<view class="closeIconEl" @click="showCenter = false">
					<img src="@/static/icons/closeIcon.png" class="ww24 hh24" />
				</view>
			</view>
		</van-overlay>
	</view>
</template>



<style lang="scss" scoped>
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
	:deep(.van-tabs__nav) {
		// justify-content: space-between;
	}

	.nullDataBoxEl {
		top: 240px;

		.nullDataEl {
			margin-top: 0;
		}

		.feedBackEl {
			line-height: 44px;
		}

		.smallIcon {
			width: 24px;
			height: 24px;
		}
	}

	.reviewbtn {
		background: linear-gradient(96deg, #9f58ef 0%, #8730e8 100%);
		width: 110px;
		border-radius: 48px 48px 48px 48px;
		text-align: center;
		height: 36px;
		line-height: 36px;
	}

	.botBtn {
		display: flex;
		flex-direction: row-reverse;

		.btnPay {
			background: linear-gradient(96deg, #9f58ef 0%, #8730e8 100%);
		}

		.btnCancel {
			background: #eeeeee;
		}

		.btn {
			width: 110px;
			border-radius: 48px 48px 48px 48px;
			text-align: center;
			height: 36px;
			line-height: 36px;
		}
	}

	.borderB {
		border-bottom: 1px solid rgba(239, 239, 239, 0.6);
	}
</style>
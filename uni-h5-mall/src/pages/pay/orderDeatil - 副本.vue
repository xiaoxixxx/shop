<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../../comm/request.ts';
	import cancelOrder from '@/components/pop/cancelOrder.vue';
	import QRCode from 'qrcode';
	import {
		showToast
	} from 'vant';
	import {
		cartStore
	} from '@/store/cart';
	import {
		useI18n
	} from "vue-i18n";
	import {
		fen2yuan,
		timeFormat
	} from '../../../comm/useGoods.js'
	import {
		onShow
	} from '@dcloudio/uni-app';
	const {
		t
	} = useI18n();
	import useClipboard from 'vue-clipboard3';
	const {
		toClipboard
	} = useClipboard();
	const cartStoreDeatil = cartStore();


	const copyHandle = async (data) => {
		try {
			await toClipboard(data);
			showToast(t('pay.ord_j1'));
		} catch (e) {
			console.log(e)
			//TODO handle the exception
		}
	}

	const orderDeatils = ref({
		items: [],
		payPrice: 0,
		discountPrice: 0,
		totalPrice: 0,
		vipPrice: 0

	})
	const getData = () => {
		request({
			url: '/app-api/trade/order/get-detail',
			methods: "get",
			data: {
				id: window.location.search.split('id=')[1]
			}
		}).then(res => {
			if (res.payStatus && res.status !== 30) {
				uni.navigateTo({
					url: './orderList'
				})
			} else {
				orderDeatils.value = res
				seconds.value = res.orderExpireTime
				if (timer.value) {
					clearInterval(timer.value)
				}
				if (seconds.value > 0) {
					startTimer()
				}
			}
		})
	}

	const payStatusTimer = ref(null)

	const payStatusTimerFn = () => {
		payStatusTimer.value = setInterval(() => {
			
			if(PAY_FLAG.value == 0){
				clearInterval(payStatusTimer.value)
			}
			getPayStatus()
			PAY_FLAG.value--;
		}, 2000)
	}

	const getPayStatus = () => {
		request({
			url: '/app-api/paypal/order/getOrderPayStatus',
			data: {
				orderId: orderDeatils.value.id
			}
		}).then(res => {
				if(res.orderPayStatus == 1){
					clearInterval(payStatusTimer.value)
					clearInterval(timer.value)
					uni.hideLoading()
					uni.navigateTo({
						url: './payResult?status=' + res.orderPayStatus
					})
					return
				}
			if(PAY_FLAG.value == 0){
				clearInterval(payStatusTimer.value)
				clearInterval(timer.value)
				uni.hideLoading()
				uni.navigateTo({
					url: './payResult?status=' + res.orderPayStatus
				})
			}
		})
	}
	const payHandle = () => {
		if (!orderDeatils.value.id) return
		showDialog.value = false
		uni.showLoading()
		request({
			url: '/app-api/paypal/order/createPaypal',
			methods: "POST",
			data: {
				id: orderDeatils.value.id,
				description: ""
			}
		}).then(res => {			
			window.open(res)
		})
	}

	const seconds = ref(0)
	const timer = ref(null)
	const showTime = ref("")
	const PAY_FLAG = ref(10)
	const startTimer = () => {
		timer.value = setInterval(() => {
			if (seconds.value == 0) {
				clearInterval(timer.value)
				getData()
			}
			showTime.value = formatTime(seconds.value)
			seconds.value--;
		}, 1000)
	}

	function formatTime(seconds) {
		// 计算小时、分钟和秒  
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 3600 % 60;

		// 补0操作  
		const paddedHours = hours.toString().padStart(2, '0');
		const paddedMinutes = minutes.toString().padStart(2, '0');
		const paddedSeconds = secs.toString().padStart(2, '0');

		// 组合成 "时:分:秒" 的格式  
		return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
	}
	onShow(() => {
		if(payStatusTimer.value){
			clearInterval(payStatusTimer.value)
		}
			payStatusTimerFn()
	})
	onMounted(() => {
		getData()
	})
	
	const cancelOrderRef = ref("")
	const cancelId = ref(0)
	const cancelClick = id => {
		cancelId.value = orderDeatils.value.id
		cancelOrderRef.value.showBottom = true
	}

	const afterCancelHandle = () => {
		uni.navigateTo({
			url: "./cancelResult"
		})
	}
	const isBig = ref(false)
	const isTopFixed = ref(false)
	const showDialog = ref(false)
	// 吸顶判断
	const topChangeHandle = (e) => {
		isTopFixed.value = e
	}

	const popConfirmHandle = () => {
		clearInterval(timer.value)
		clearInterval(payStatusTimer.value)
		uni.navigateTo({
			url: '/'
		})
	}

	const changePage = url => {
		uni.navigateTo({
			url
		})
	}

	const ORDER_STATUS = {
		0: t('pay.ord_li_j2'),
		10: t('pay.ord_li_j3'),
		20: t('pay.ord_li_j4'),
		30: t('add1.a_a2'),
		40: t('pay.ord_li_h6'),
		50: t('pay.ord_li_h9')
	}


	const goService = () => {
		uni.navigateTo({
			url: '../chat/index'
		})
	}

	const showCenter = ref(false)
	const qrCodeBase64 = ref("")

	const showQrCode = () => {
		let data = orderDeatils.value.pickUpVerifyCode
		showCenter.value = true
		genCode(String(data))
		showCenter.value = true
	}
	const genCode = async (text) => {
		try {
			// 生成二维码
			qrCodeBase64.value = await QRCode.toDataURL(text);
		} catch (error) {
			console.error('生成二维码失败:', error);
		}
	}
	
	const goBackHandle = ()=>{
		if(orderDeatils.value.status == 0){
			showDialog.value = true
		}else{
			clearInterval(timer.value)
			clearInterval(payStatusTimer.value)
			uni.navigateTo({
				url:'/'
			})
		}
	}
</script>


<template>

	<view class="orderDeatil">
	

		<van-sticky :offset-top="0"  @change="topChangeHandle">
			<view class="pdlr10 pdtb10  between  topNav" :class="isTopFixed?'topFixedBg ':''">
				<view class="left">
					<img :src="'../../static/icons/whiteBackIcon.png'" :class="isBig?['ww32', 'hh32']:['ww24','hh24']"
						@click="goBackHandle">
				</view>
				<view class="text_center center   f17 ">
				</view>
				<view class="right" :class="isBig?['ww32', 'hh32']:['ww24','hh24']">
					<img src="@/static/pay/service.png" class="ww24 hh24" @click="goService" />
				</view>
			</view>
		</van-sticky>


		<view class="mt20 pdlr12 ">
			<view class="text_white">
				<view class="f20 semiBold">
					{{orderDeatils.payStatus?ORDER_STATUS[orderDeatils.status]:t('pay.ord_li_j2')}}
					<span class=" f14 " v-if="orderDeatils.status == 0">
						{{showTime}}</span>
				</view>
				<view class="mt4 f12 introWord">{{ t('pay.ord_h1') }}</view>
			</view>
			<view class="pdlr10 mt20 addressEl">
				<view class="flex">
					<img src="@/static/icons/dw.png" class="ww24 hh24" />
					<view class="ml8 ">
						<view class="mt3 f15"><span class=" semiBold">
								{{orderDeatils.receiverName}}

							</span> <span> {{orderDeatils.receiverMobile}}</span></view>
						<view class="mt8 f12 color7C" style="height: 20px;">
							<van-text-ellipsis rows="1" :content="orderDeatils.receiverDetailAddress" class="f12 " />
						</view>
					</view>
				</view>

				<view>
					<!-- <img src="@/static/my/left.png" class="ww24 hh24" @click="addressClickHandle" /> -->
				</view>
				<img class="linesBot" src="@/static/icons/lineColor.png"
					style="width: 100%;height: 4px;margin-top: -10px;" />
			</view>

			<view class="mt52 pdlr12">
				<view class="mt16 flex goodsItem  " v-for="item in orderDeatils.items"
					@click="changePage('../goods/goodsDeatils?id='+item.spuId)">
					<view>
						<van-image class="ww80 hh80" :src="item.picUrl" lazy-load radius="10px">
							<template v-slot:loading>
								<van-loading type="spinner" size="20" />
							</template>
						</van-image>

						<!-- <img src="@/static/temp/deatil1.png" class="ww80 hh80" /> -->
					</view>
					<view class="ml12 flex1">
						<view class="between ">
							<view class="f15 text_bold">
								<van-text-ellipsis rows="2" :content="item.spuName " class="f14" />
							</view>
							<view class="f12 text_bold">x{{item.count}}</view>
						</view>
						<view class="f12  mt4 colorDel">
							<span class="mr5" v-for="tag in item.properties">
								{{tag.propertyName+':'+tag.valueName}}
							</span>
						</view>
						<view class=" flex mt20">
							<view class="f14 semiBold mr4">${{fen2yuan(item.price)}}</view>
						</view>
					</view>
				</view>

			</view>

		</view>
		<view class=" mt16 hh8 mainf8Bg"></view>

		<view class="pdlr12 pt16 f13 color7C">
			<view class="between">
				<view>{{t('pay.che_h5') }}</view>
				<view>${{fen2yuan(orderDeatils.totalPrice)}}</view>
			</view>
			<view class="between mt20">
				<view>{{t('pay.che_h6')}}</view>
				<view> -${{fen2yuan(orderDeatils.discountPrice)}}</view>
			</view>
			<view class="between mt20">
				<view>{{t('pay.che_h7')}}</view>
				<view class="colorFc">0</view>
			</view>
			<view class="between mt20">
				<view></view>
				<view class="f15 color09">{{t('pay.ord_h2')}} : ${{fen2yuan(orderDeatils.payPrice)}}</view>
			</view>
		</view>
		<view class=" mt20 hh8 mainf8Bg"></view>

		<view class="pdlr12 pt16 f13 color7C">
			<view class="between">
				<view>{{t('pay.ord_h3')}}</view>
				<view class="flex col_center">{{orderDeatils.no}} <img src="@/static/icons/copy.png"
						class="ww14 hh14 ml4" @click="copyHandle(orderDeatils.no)"> </view>
			</view>
			<view class="between mt20">
				<view>{{t('pay.ord_h4')}}</view>
				<view>{{ timeFormat(orderDeatils.createTime,'yyyy-mm-dd hh:MM:ss')}}</view>
			</view>
			<view class="between mt20">
				<view>{{t('pay.ord_h5')}}</view>
				<view class="colorFc">{{orderDeatils.payStatus?'Paid':'Unpaid'}}</view>
			</view>
			<view style="height: 100px;"></view>
		</view>
		<view class="fixedBot f14">
			<view class="btnPay btn mr12 text_white  " @click="payHandle" v-if="orderDeatils.status == 0">
				{{t('pay.ord_h6')}}
			</view>
			<view class="btnCancel btn mr12 color333 " @click="cancelClick" v-if="orderDeatils.status == 0">
				{{t('all.can')}}
			</view>
			<view v-if="orderDeatils.status == 30" class="btnPay btn mr12 text_white" @click="showQrCode">
				{{t('add1.a_a2')}}
			</view>
		</view>


		<cancelOrder :updateFun="afterCancelHandle" :orderId="cancelId" ref="cancelOrderRef"></cancelOrder>


		<van-popup v-model:show="showDialog" round style="width: 320px;">
			<view class="pt30 pdlr26 ">
				<view class="f15   text_center borderB pb24" style="line-height: 18px;">
					{{t('pay.a_add1')}}
				</view>
			</view>
			<view class=" pop  pdlr20 pdtb16">
				<view class="girdBtn">
					<view class="botBtn cancelBtn center color7C" @click=" popConfirmHandle">{{t('pay.a_add2')}}</view>
					<view class="botBtn  center text_white confirmBtn" @click="payHandle">{{t('pay.ord_h6')}}
					</view>
				</view>


			</view>
		</van-popup>

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

	.topFixedBg {
		// background: transparent !important;
		background: linear-gradient(to right, #9F58EF, #9034F7);
	}

	.borderB {
		border-color: #EFEFEF;
	}

	.pop {
		.girdBtn {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
			font-size: 14px;
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
			background: linear-gradient(96deg, #9F58EF 0%, #8730E8 100%);
		}

		.cancelBtn {
			border: 1px solid #9F58EF;
			color: #9F58EF;
		}
	}

	.fixedBot {
		position: fixed;
		bottom: 0;
		background: #ffffff;
		box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.07);
		border-radius: 0px 0px 0px 0px;
		width: 100%;
		height: 36px;
		border-top: 1px solid rgba(0, 0, 0, 0.07);
		display: flex;
		flex-direction: row-reverse;
		padding-top: 4px;

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

	.introWord {
		color: rgba(255, 255, 255, 0.6);
	}

	.addressEl {
		display: flex;
		justify-content: space-between;
		background: linear-gradient(0, #ffffff 0%, #faf5ff 100%);
		border-radius: 8px 8px 8px 8px;
		padding: 12px 12px 16px 12px;
		position: relative;
		overflow: hidden;

		.linesBot {
			position: absolute;
			bottom: 0px;
			left: 0;
		}
	}

	.orderDeatil {
		background-image: url("@/static/pay/orderDeatil.png");
		background-repeat: no-repeat;
		background-size: 100% 248px;
		background-position: top;
		min-height: 100vh;
		// background-color: rgba(217, 217, 217, 0.1);
	}
</style>
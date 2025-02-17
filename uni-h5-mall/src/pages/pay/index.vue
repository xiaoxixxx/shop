<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../../comm/request.ts';
	import {
		fen2yuan
	} from '../../../comm/useGoods.js'
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
		onShow
	} from '@dcloudio/uni-app';

	const {
		t
	} = useI18n();
	const cartStoreDeatil = cartStore();

	const addressDeatil = ref({})


	const payActInd = ref(0)
	const payMethods = ref([

	])

	const addressClickHandle = (type) => {
		if (type == 1) {
			cartStoreDeatil.$state.chooseAddress = true
			uni.navigateTo({
				url: '../my/addressList'
			})
		} else {
			if (addressList.value.length > 0) {
				cartStoreDeatil.$state.chooseAddress = true
				uni.navigateTo({
					url: '../my/addressList'
				})
			} else {
				uni.navigateTo({
					url: './address'
				})
			}

		}

	}

	const remark = ref("")
	// 下单
	const payHandle = () => {
	if(orderDeatil.value.price.totalPrice == 0) return
		if (!addressDeatil.value) {
			showToast(t('pay.che_j1'))
			return
		}
		// uni.navigateTo({
		// 	url:'./payResult'
		// })
		let data = {
			payChannel: payMethods.value[payActInd.value].value,
			addressId: addressDeatil.value.id,
			receiverMobile: addressDeatil.value.mobile,
			remark: remark.value,
			detailAddress:addressDeatil.value.detailAddress,
			receiverName: addressDeatil.value.firstName + addressDeatil.value.lastName,
			...cartStoreDeatil.$state.cartDeatils
		}
		request({
			url: `/app-api/trade/order/create`,
			methods: "POST",
			data

		}).then(res => {
			let orderId = res.id
			uni.navigateTo({
				url: './orderDeatil?id=' + orderId
			})



		})
	}
	const orderDeatil = ref({
		price: {
			couponPrice: 0,
			deliveryPrice: 0,
			discountPrice: 0,
			payPrice: 0,
			pointPrice: 0,
			totalPrice: 0,
			vipPrice: 0
		},
		items: []
	})
	const getOrderDeatil = (data) => {
		uni.showLoading()
		request({
			url: `/app-api/trade/order/settlement`,
			methods: "POST",
			data
		}).then(res => {
			orderDeatil.value = res
		}).finally(() => {
			uni.hideLoading()
		})

		request({
			url: `/app-api/paypal/order/listPayChannel`,
		}).then(res => {

			if (res.includes(1)) {
				payMethods.value.push({
					name: 'PayPal',
					icons: "../../static/pay/paypal.png",
					value: 1,
				})
			}
			// {
			// 	name: 'Alipay',
			// 	icons: "../../static/pay/zfb.png",
			// 	value: 1
			// },
			// {
			// 	name: 'Cash on delivery',
			// 	icons: "../../static/pay/cspay.png",
			// 	value: 2
			// },
			// {
			// 	name: 'PayPal',
			// 	icons: "../../static/pay/paypal.png",
			// 	value: 3
			// },
		})

		// request({
		// 	url: '/app-api/paypal/order/createPaypal',
		// 	methods:'POST',
		// }).then(res => {
		// 	console.log(res)
		// })

	}
	const addressList = ref([])
	const getAddress = () => {
		request({
			url: '/app-api/member/address/list',
		}).then(res => {
			if (cartStoreDeatil.$state.chooseAddressId > 0) {
				addressDeatil.value = res.find(item => item.id == cartStoreDeatil.$state.chooseAddressId)
			} else {
				addressDeatil.value = res.find(item => item.defaultStatus == true)

			}

			if (!addressDeatil.value && res.length == 1) {
				addressDeatil.value = res[0]
			}
			addressList.value = res
		})
	}

	onMounted(() => {
		if (cartStoreDeatil.$state.orderInfo) {
			getOrderDeatil(cartStoreDeatil.$state.orderInfo)
		} else {
			console.log('参数错误')
		}
	})

	onShow(() => {
		getAddress()
	})
	// /app-api/paypal/order/createPaypal
	// const   

	const showPriceDeatil = ref(false)
	const clickRotate = ref(0)
</script>


<template>

	<view>

		<topNavbar :title="t('pay.che_t1')"></topNavbar>

		<view class="pdlr10 mt20 addressEl" v-if="addressDeatil?.country">
			<view class="flex">
				<img src="@/static/icons/dw.png" class="ww24 hh24" />
				<view class="ml8 ">
					<view class="mt3 f15"><span
							class=" semiBold">{{addressDeatil.firstName +" "+ addressDeatil.lastName}}</span>
						<span> +{{addressDeatil.mobile + ` (${addressDeatil.country})`}}</span>
					</view>
					<view class="mt12 f12">
						{{addressDeatil.detailAddress}}
					</view>
				</view>
			</view>
			<view>
				<img src="@/static/my/left.png" class="ww24 hh24" @click="addressClickHandle(1)" />
			</view>
		</view>
		<view class="pdlr10 mt20 addressEl" v-else @click="addressClickHandle(2)">
			<view class=" f14 flex col_center">
				<img src="@/static/icons/dw.png" class="ww24 hh24" />
				<view class="ml8">
					{{t('pay.che_h1')}}
				</view>
			</view>
			<view>
				<img src="@/static/my/left.png" class="ww24 hh24" />
			</view>
		</view>

		<view class="mt16">
			<img src="@/static/icons/lineColor.png" style="width: 100%;height: 4px;" />
		</view>
		<view class="hh8 mainf8Bg"></view>

		<!-- goods -->
		<view class="pdlr12 pdtb16">
			<view class="f15 semiBold"> {{ t('pay.che_h2') }} ({{orderDeatil.items.length}})</view>
			<view class="mt16 flex goodsItem  " v-for="item in orderDeatil.items">
				<view>
					<van-image class="ww80 hh80" :src="item.picUrl" lazy-load radius="10px">
						<template v-slot:loading>
							<van-loading type="spinner" size="20" />
						</template>
					</van-image>

				</view>
				<view class="ml12 flex1">
					<view class="f15 semiBold between">

						<view style="max-width: 80%;">
							<van-text-ellipsis :content="item.spuName" />
						</view>
						<view class="f12">
							x{{item.count}}
						</view>
					</view>
					<view class="f12 flex col_center  mt4 colorDel" style="flex-wrap: wrap;">
						<view class="mr5" v-for="tag in item.properties">
							<span v-if="tag.propertyName && tag.valueName">{{tag.propertyName+':'+tag.valueName}}</span> 
							<span v-else>{{t('add1.a_a4')}}</span>
						</view>
					</view>
					<view class=" mt20">
						<view class="flex">
							<view class="f14 text_bold mr4">$ {{fen2yuan(item.price)}}</view>
						</view>

					</view>
				</view>
			</view>
		</view>

		<!-- pay methods -->
		<view class="hh8 mainf8Bg"></view>
		<view class="pdlr12 pdtb16">
			<view class="f15 semiBold">{{t('pay.che_h3')}}</view>
			<view class="mt8 flex col_center">
				<img src="@/static/icons/info.png" class="ww14 hh14" />
				<view class="f12 ml6 colorAf">{{t('pay.che_h4')}}</view>
			</view>
			<view class="mt5">
				<view class="pdtb16  payItem between" v-for="(item,index) in payMethods" @click="payActInd = index">
					<view class="flex col_center">
						<img :src="item.icons" class="ww40 hh40" />
						<view class="ml12 f13">{{item.name}}</view>
					</view>
					<view>
						<img src="../../static/icons/choosed_cho.png" class="ww18 hh18" v-if="payActInd == index">
						<img src="../../static/icons/null_cho.png" class="ww18 hh18" v-else>
					</view>
				</view>
			</view>
		</view>
		<view class="hh8 mainf8Bg"></view>
		<view class="pdlr12 pdtb16 f13  ">
			<view class="between    borderB pb16">
				<view class=" ">{{t('pay.che_h5')}}: </view>
				<view class=" ">${{fen2yuan(orderDeatil.price.totalPrice)}} </view>
			</view>

			<view class="mt16 between ">
				<view class="color7C">{{t('pay.che_h6')}}</view>
				<view class="">${{fen2yuan(orderDeatil.price.couponPrice)}}</view>
			</view>
			<view class="mt16 between ">
				<view class="color7C">{{t('pay.che_h7')}}</view>
				<view class="">-${{fen2yuan(orderDeatil.price.discountPrice)}}</view>
			</view>
			<view class="mt16 between  ">
				<view class="color7C">{{t('pay.che_h8')}}</view>
				<view class="">x{{orderDeatil.items.length}}</view>
			</view>
			<view class="mt16 flex  ">
				<view class="color7C">{{t('pay.che_h12')}}</view>
				<view class="flex1 ml20">
					<textarea class="hh40 f13" cols="20" rows="2" v-model="remark" style="width: 100%;"
						placeholder="You can enter the remark requirements. Maximum 50 characters~"></textarea>
				</view>
			</view>

			<view class="mt16 between  f15">
				<view class=" ">{{t('pay.che_h9')}}</view>
				<view class="">${{fen2yuan(orderDeatil.price.totalPrice)}}</view>
			</view>

		</view>
		<view class="hh8 mainf8Bg"></view>
		<!-- 挂载到 body 节点下 -->
		<view :style="clickRotate ==1?{height:'250px'}:{height:'60px'}"></view>
		<view class="fixedBot">
			<view :class=" clickRotate == 1?' disBlock': 
			clickRotate == 2?' disNone ':'opcity0'" :style="clickRotate !==1?{height:'0'}:''">
				<view class="pdlr12 pdtb16 f13 popDeatil ">
					<view class="between    borderB pb16">
						<view class=" ">{{t('pay.che_h5')}}: </view>
						<view class=" ">${{fen2yuan(orderDeatil.price.totalPrice)}} </view>
					</view>

					<view class="mt16 between ">
						<view class="color7C">{{t('pay.che_h6')}}</view>
						<view class="">${{fen2yuan(orderDeatil.price.couponPrice)}}</view>
					</view>
					<view class="mt16 between ">
						<view class="color7C">{{t('pay.che_h7')}}</view>
						<view class="">-$ {{fen2yuan(orderDeatil.price.discountPrice)}}</view>
					</view>
					<view class="mt16 between  ">
						<view class="color7C">{{t('pay.che_h8')}}</view>
						<view class="">x{{orderDeatil.items.length}}</view>
					</view>

				</view>
				<view class="hh8 mainf8Bg"></view>
			</view>
			<view class="between pdlr12 pdtb5">
				<view>
					<view class="f12 colorAf">{{t('pay.che_h10')}}</view>
					<view class="flex col_center ">
						<view class="f20 text_bold colorContent mr10">${{fen2yuan(orderDeatil.price.totalPrice)}}</view>
						<img src="../../static/icons/top.png" class="ww24 hh24"
							:class="clickRotate == 1?'rotate180':'rotate360'"
							@click="()=>{showPriceDeatil = !showPriceDeatil ;showPriceDeatil ?clickRotate = 1:clickRotate = 2 }" />
					</view>
				</view>
				<view class="botBtn center" @click="payHandle">
					{{t('pay.che_h11')}}
				</view>
			</view>
		</view>

	</view>
</template>



<style lang="scss" scoped>
	.opcity0 {
		opacity: 0;
		display: none;
	}

	.disBlock {
		display: block;
	}

	.disNone {
		display: none;
	}

	.rotate180 {
		transform: rotateZ(180deg);
		transition: 0.2s linear all;
	}

	.rotate360 {
		transform: rotateZ(0deg);
		transition: 0.2s linear all;
	}

	.popDeatil {
		box-shadow: 0px -1px 24px 0px rgba(0, 0, 0, 0.06);
		border-radius: 16px 16px 0 0;
	}

	.botBtn {
		width: 200px;
		height: 44px;
		background: linear-gradient(91deg, #8a3ddf 0%, #7f2add 100%);
		border-radius: 65px 65px 65px 65px;
		line-height: 44px;
		color: #fff;
	}

	.fixedBot {
		position: fixed;
		bottom: 0;
		// left: 0;
		background: #fff;
		width: 100%;
		left: 50% !important;
		transform: translateX(-50%) !important;
	}

	.addressEl {
		display: flex;
		justify-content: space-between;
	}

	.payItem:not(:last-child) {
		border-bottom: 1px solid #efefef;
	}

	.borderB {
		border-bottom: 1px solid #efefef;
	}
</style>
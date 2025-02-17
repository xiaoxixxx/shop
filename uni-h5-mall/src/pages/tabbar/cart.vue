<script setup>
	import {
		computed
	} from 'vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import carLoading from '@/components/loading/car.vue';
	import request from '../../../comm/request.ts';
	import {
		fen2yuan
	} from '../../../comm/useGoods.js'
	import {
		showConfirmDialog,
		showToast
	} from 'vant'
	import {
		cartStore
	} from '@/store/cart';
	import {
		useI18n
	} from "vue-i18n";
	import CartDeatilsPopConfirm from '../../components/pop/cartDeatilsPopConfirm.vue';
	const {
		locale,
		t
	} = useI18n();
	const cartStoreDeatil = cartStore();
	const refresh = ref(false)
	const refreshFun = () => {
		setTimeout(() => {
			refresh.value = false
		}, 3000)
	}

	const isTopFixed = ref(false)
	// 吸顶判断
	const topChangeHandle = (e) => {
		isTopFixed.value = e
	}

	// 是否全选

	// 商品列表
	const goodsCart = computed(() => {
		return cartStoreDeatil.cartList
	})


	const invalidList = computed(() => {
		return cartStoreDeatil.invalidList
	})


	const tempArr = ref([])


	const allChecked = ref(false)

	// 全选  全不选
	const allCheckedChangeHandle = (e) => {
		allChecked.value = e
		let data = {
			ids: [],
			selected: allChecked.value
		}
		goodsCart.value.forEach(item => {
			data.ids.push(item.id)
		})



		request({
			url: '/app-api/trade/cart/update-selected',
			methods: 'PUT',
			data
		}).then(res => {
			cartStoreDeatil.getCarList()
		})
	}


	// 单个商品选择
	const goodsCheckedChangeStatus = (item) => {
		// initAllcheckedStatus()
		item.selected = !item.selected
		let data = {
			ids: [item.id],
			selected: item.selected
		}
		updateSelectStatus(data, true)
	}

	onMounted(() => {
		if(localStorage.getItem('token')){
			cartStoreDeatil.getCarList()
			initAllcheckedStatus()
		}
	})
	const initAllcheckedStatus = () => {
		let flag = 0
		goodsCart.value.forEach(item => {
			if (item.selected) {
				flag += 1
			}
		})
		allChecked.value = (flag == goodsCart.value.length)
	}

	const updateSelectStatus = (data, type) => {
		request({
			url: '/app-api/trade/cart/update-selected',
			methods: 'PUT',
			data
		}).then(res => {
			initAllcheckedStatus()
		})
	}

	const totalMoney = computed(() => {
		let money = 0
		goodsCart.value.forEach(item => {
			if (item.selected && item.sku) {
				money += Number(item.sku.price) * Number(item.count)
			}
		})
		return money
	})

	const goBack = () => {
		history.back()
	}

	function findObjectIndex(array, key, value) {
		return array.findIndex(obj => obj[key] === value);
	}
	// 移除购物车
	const deleteHandle = () => {

		let ids = []
		goodsCart.value.forEach(item => {
			if (item.selected) {
				ids.push(item.id)
			}
		})
		let params = ids.join(',')
		request({
			url: '/app-api/trade/cart/delete?ids=' + params,
			methods: "DELETE"
		}).then(res => {
			showToast(t('goods.g_j2'))
			// tabbarRef.value.getDoubleCount()
			cartStoreDeatil.getCarList()
		})
	}

	const tabbarRef = ref("")
	// 去支付
	const goPayInfo = () => {
		// let data = {
		// 	deliveryType: 1,
		// 	pointStatus: false,
		// 	items: []
		// }
		let data = []
		let queryData = {
			deliveryType: 2,
			pointStatus: false,
		}
		let showFlag = true
		let showInd = 0
		goodsCart.value.forEach((item, index) => {
			if (item.selected) {
				if (item.count > item.sku.stock) {
					showInd = Number(index) + 1
					showFlag = false
					return
				}
				let obj = {
					cartId: item.id,
					count: item.count,
					skuId: item.sku.id,
					categoryId: item.spu.categoryId
				}
				data.push(obj)
			}
		})
		if (!showFlag) {
			showToast(t('tab.ca_j1') + showInd + t('tab.ca_j2'))
			return false
		}

		if (data.length == 0) return
		cartStoreDeatil.$state.cartDeatils = Object.assign({}, queryData, {
			items: data
		});
		cartStoreDeatil.$state.orderInfo = cartStoreDeatil.$state.cartDeatils
		uni.navigateTo({
			url: "../pay/index"
		})
	}

	const countUpdate = (type, item) => {
		uni.showLoading()
		if (type == 'cel') {

			if (item.count == item.spu.startSale) {
				request({
					url: '/app-api/trade/cart/delete?ids=' + item.id,
					methods: "DELETE"
				}).then(res => {
					// tabbarRef.value.getDoubleCount()
					showToast(t('goods.g_j2'))
					cartStoreDeatil.getCarList()
					uni.hideLoading()
				})
				return
			} else {
				item.count--;
			}
		} else if (type == 'add') {
			item.count++;
		}

		request({
			url: '/app-api/trade/cart/update-count',
			methods: 'PUT',
			data: {
				count: item.count,
				id: item.id
			}
		}).then(res => {
			uni.hideLoading()
		})
	}



	const changePage = url => {
		uni.navigateTo({
			url
		})
	}
	
	const deleteInvalidList = ()=>{
		showConfirmDialog({
			title:  t('com.dia_t1'),
			message:  t('goods.g_h15'),
			confirmButtonText:  t('all.con'),
			cancelButtonText:t('all.can'),
		})
			.then(() => {
				let ids = []
				invalidList.value.forEach(item => {
						ids.push(item.id)
				})
				let params = ids.join(',')
				request({
					url: '/app-api/trade/cart/delete?ids=' + params,
					methods: "DELETE"
				}).then(res => {
					showToast(t('goods.g_j2'))
					cartStoreDeatil.getCarList()
				})
			}).finally(() => {
				
			})
	}
	
	const CartDeatilsPopConfirmRef = ref("")

	
	const showBottomHandle= (item)=>{
		CartDeatilsPopConfirmRef.value.choosedList = []
		CartDeatilsPopConfirmRef.value.getPropertyListHandle(item)
		CartDeatilsPopConfirmRef.value.showBottom = true
	}
</script>
<template>
	<view class="cartPage">
		<van-pull-refresh v-model="refresh" @refresh="refreshFun" loosing-text="  " loading-text="loading...">
			<van-sticky :offset-top="0" @change="topChangeHandle">
				<view class="pdlr10 pdtb10   center  " style="height: 30px;" :class="isTopFixed?'mainf8Bg':''">
					<view class="text_center  f17  semiBold ">{{t('tab.ca_t1')}}</view>
				</view>
			</van-sticky>


			<view v-if="goodsCart.length >0">
				<view class="mt20 pdlr10">
					<view class="between borderB pb10 pdlr10">
						<view class="flex col_center">
						<!-- 	<van-checkbox v-model="allChecked" shape="round" checked-color="#9A50ED"
								@click="allCheckedChangeHandle">
								<span class="color5E">{{t('tab.ca_h1')}}</span>
							</van-checkbox> -->
							
							<img src="@/static/icons/choosed.png" class="ww18 hh18"   v-if="allChecked" @click="allCheckedChangeHandle(false)"  />
							<img src="@/static/icons/choose.png" v-else class="ww18 hh18" @click="allCheckedChangeHandle(true)"  />
							<span class="color5E pl12 f14">{{t('tab.ca_h1')}}</span>
						</view>
						<view>
							<img src="../../static/icons/del.png" class="ww24 hh24" @click="deleteHandle" />
						</view>
					</view>


					<view class="cartGoodsList">
						<view class="goodsItem between" v-for="(item,index) in goodsCart">
							<view>
										<img src="@/static/icons/choosed.png" class="ww18 hh18"   v-if="item.selected" @click="goodsCheckedChangeStatus(item)"  />
								<img src="@/static/icons/choose.png" v-else class="ww18 hh18" @click="goodsCheckedChangeStatus(item)"  />
						
								<!-- <van-checkbox v-model="item.selected" shape="round" checked-color="#9A50ED"
									></van-checkbox> -->
							</view>

							<view class="flex  ml12" style="flex: 1;">
								<view @click.stop="changePage('../goods/goodsDeatils?id=' + item.spu.id)">
									<van-image class="goodsPic" :src="item.sku?item.sku.picUrl:item.spu.picUrl" lazy-load radius="10px">
										<template v-slot:loading>
											<van-loading type="spinner" size="20" />
										</template>
									</van-image>

								</view>
								<view style="flex :1">
									<view class="ml10">
										
									<view @click.stop="changePage('../goods/goodsDeatils?id=' + item.spu.id)">
										<van-text-ellipsis rows="1" :content="item.spu.name" class="f15 " />
										<view class="f12 flex col_center   colorDel "
											style="flex-wrap: wrap; line-height: 18px;" v-if="item.sku">
											<view class="mr5" v-for="(tag,ind) in item.sku.properties" >
												<!-- {{tag.propertyName+':'+tag.valueName}} -->
												<view @click.stop="showBottomHandle(item)">
													<span  v-if="tag.valueName !== '默认' " >{{ item.flag==1? t('add1.a_a4'):tag.valueName}}</span>
													<span
														v-if="ind<item.sku.properties.length - 1"> | </span>
												</view>
											</view>
											<img src="@/static/icons/car_right.png"  class="ww14 hh14" />
										</view>
									</view>

										<view class="between mt10">
											<view class="colorContent text_bold f17" v-if="item.sku">${{fen2yuan(item.sku.price)}}
											</view>
											<view class="between opEl">
												<img :src="item.count == item.spu.startSale?'../../static/icons/cel.png':'../../static/icons/cel1.png'" class="ww20 hh20"
												@click.stop="item.count == item.spu.startSale?'':countUpdate('cel',item)"	>
													<!--  -->
												<view class="mglr13 f13 semiBold">{{ item.count }}</view>
												<img src="../../static/icons/add.png" class="ww20 hh20"
													@click.stop="countUpdate('add',item)">
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>



				</view>
				<view v-if="invalidList.length >0">
					<!-- status    商品状态: 1 上架（开启） 0 下架（禁用） -1 回收 -->
					<view class="hh8 mainf8Bg"></view>

					<view class="pdlr12  pdtb20">
						<view class="between borderB pb16">
							<view class="text_bold f14">Sold out</view>
							<view class="colorFc f12" @click="deleteInvalidList">
								Delete all
							</view>
						</view>
						<view class="maskContent">
							<view class="flex  goodsItem " v-for="item in invalidList">
								<view>
									<van-image class="hh80 ww80" :src="item.spu.picUrl" lazy-load radius="10px">
										<template v-slot:loading>
											<van-loading type="spinner" size="20" />
										</template>
									</van-image>
								</view>
								<view style="flex :1">
									<view class="ml10">
										<van-text-ellipsis rows="2" :content="item.spu.name" class="f15 " />
										<view class="f12 flex col_center   colorDel "
											style="flex-wrap: wrap; line-height: 18px;">
											<view class="mr5" v-for="(tag,ind) in item.sku.properties">
												{{tag.propertyName+':'+tag.valueName}} <span
													v-if="ind<item.sku.properties.length - 1"> | </span>
											</view>
										</view>
										<view class="between mt10">
											<view class="colorContent text_bold f17">${{fen2yuan(item.sku.price)}}
											</view>
											<view class="between opEl">
												<img src="../../static/icons/cel.png" class="ww20 hh20">
												<view class="mglr13 f13 semiBold">{{ item.count }}</view>
												<img src="../../static/icons/add.png" class="ww20 hh20">
											</view>
										</view>
									</view>
								</view>
							</view>

						</view>
					</view>
				</view>
				<view style="height: 150px;"></view>



				<view class="totalMoneyEl" v-if="totalMoney>0">
					<view class="pdlr10 pt16 pb10 between">
						<view class=" text_bold">
							<view class="f12 colorDel ">{{t('pay.che_h10')}}</view>
							<view class="colorContent f20 mt5 text_bold">${{fen2yuan(totalMoney)}}</view>
						</view>
						<view class="btnContent center f14 text_white " @click="goPayInfo">
							{{t('pay.che_t1')}}
							<img src="../../static/icons/pay_check.png" class="ww14 hh14 ml12" />
						</view>
					</view>
				</view>
			</view>

			<!-- </view> -->
			<view v-if="goodsCart.length == 0" class="pageEmpty center flex_col">
				<img src="@/static/pay/nullCart.png" />
				<view class="mt20 f20 text_bold">{{t('tab.ca_h2')}}</view>
				<view class="f12 colorCCC mt12  text_center">{{t('tab.ca_h3')}}
				</view>
			</view>
		</van-pull-refresh>
		<CartDeatilsPopConfirm ref="CartDeatilsPopConfirmRef"  >
		</CartDeatilsPopConfirm>
		<Tabbar :activeIndex="2" ref="tabbarRef"></Tabbar>
	</view>
</template>



<style lang="scss" scoped>
	.maskContent{
		// background: rgba(0,0,0,0.2);
		.goodsItem{
			position: relative;
			::after{
				background: rgba(250,250,250,0.05);
				display: block;
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
			}
		}
	}
	.borderB {
		border-color:rgba(239,239,239,0.5);
	}

	.pageEmpty {
		margin-top: 147px;

		img {
			width: 145px;
			height: 171px;
		}

		.colorCCC {
			width: 266px;
			line-height: 14px;
		}
	}

	.btnContent {
		// background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
		background: linear-gradient(96deg, #9F58EF 0%, #8730E8 100%);
		border-radius: 65px 65px 65px 65px;
		width: 200px;
		box-shadow: 1px 4px 6px 4px rgba(0, 0, 0, 0.1);
		font-weight: 500;
	}

	.cartPage {
		background: #fff;
	}

	.opEl {
		background: #f8f8f8;
		padding: 8px 10px;
		border-radius: 50px;
	}

	.totalMoneyEl {
		background: #ffffff;
		box-shadow: 0px -1px 24px 0px rgba(0, 0, 0, 0.06);
		position: fixed;
		bottom: 50px;
		width: 100%;
		border-radius: 20px 20px 0 0;
	}

	.goodsItem {
		padding: 20px 10px;

		.goodsPic {
			width: 80px;
			height: 80px;
			background: #eee;
			border-radius: 10px;
		}
	}

	.goodsItem:not(:last-child) {
		border-bottom: 1px solid rgba(239,239,239,0.5);
	}

	.searchBox {
		padding: 6px 16rpx;
		border-radius: 50rpx;
		height: 48rpx;
		border: 1px solid #e9e9e9;
		display: flex;
		background: #fff;
		align-items: center;
	}

	:deep(.van-checkbox__icon .van-icon) {
		// border-radius: 3px !important;
	}
</style>
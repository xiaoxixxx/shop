<script setup>
	import request from '../../../comm/request';
	import {
		goLoginDialog
	} from '../../../comm/goLogin.js';
	import {
		cartStore
	} from '@/store/cart';
	import {
		throttle
	} from '../../../comm/utils.js'
	import {
		showToast
	} from 'vant';
	import {
		convertProductPropertyList,
		fen2yuan
	} from '../../../comm/useGoods.js'
	import {
		watch
	} from 'vue';

	import {
		useI18n
	} from "vue-i18n";
	const {
		locale,
		t
	} = useI18n();
	const showBottom = ref(false) //是否显示弹窗
	const props = defineProps({
		closeSelectPop: {
			type: Function
		},
		goodsProperty: {
			type: Object
		},
		updateChooseItem: {
			type: Function
		},

	})
	const chooseTypeInd = ref(0)

	const confirmSelectHandle = () => {
		showBottom.value = false
		props.closeSelectPop(chooseTypeInd.value)
	}


	const buyNum = ref(1)

	// 添加到购物车
	const cartStoreDeatil = cartStore()

	const addToCar = throttle((item) => {
		const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
		if (!res) return
		if (nowChooseItem.value.stock < countVal.value) {
			showToast(t('com.pop_j7'))
			return
		}
		let data = {
			count: countVal.value,
			skuId: nowChooseItem.value.id
		}
		cartStoreDeatil.addToCar(data)
	}, 1000)

	const propertyList = ref([])
	watch(props, val => {
		if (val.goodsProperty.skus) {

			propertyList.value = convertProductPropertyList(props.goodsProperty.skus)
			propertyList.value.forEach(item => {
				choosedList.value.push({
					parentId: item.id,
					valueId: item.values[0].id
				})
			})

		}
	})
	// const  子 id 和 父id  为一组，如果 数组中存在，那么就是切换，如果没有 那就是首选

	const choosedList = ref([])
	const onSelectSku = (propertyId, valueId) => {
		choosedList.value.forEach(item => {
			if (item.parentId == propertyId) {
				item.valueId = valueId
			}
		})
	}
	onMounted(() => {

	})



	const nowChooseItem = computed(() => {
		if (props.goodsProperty.skus && choosedList.value) {

			const index = findMatchingIndex(choosedList.value, props.goodsProperty.skus);
			if (props.updateChooseItem) {
				props.updateChooseItem(props.goodsProperty.skus[index])
			}
			return props.goodsProperty.skus[index]
		} else {
			return {}
		}
	})

	function findMatchingIndex(tempArr, totalArr) {
		for (let i = 0; i < totalArr.length; i++) {
			if (isEqual(tempArr, totalArr[i].properties)) {
				return i;
			}
		}
		return -1; // 如果没有找到匹配项，返回-1  
	}

	function isEqual(arr1, arr2) {

		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i].parentId !== arr2[i].propertyId || arr1[i].valueId !== arr2[i].valueId) {
				return false;
			}
		}
		return true;
	}
	const countVal = ref(1)
	watch(props, val => {
		if (val.goodsProperty) {
			countVal.value = val.goodsProperty.startSale
		}
	})
	const buyNowHandle = () => {
		const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
		if (!res) return

		if (nowChooseItem.value.stock < countVal.value) {
			showToast(t('com.pop_j7'))
			return
		}

		let queryData = {
			deliveryType: 2,
			pointStatus: false,
		}
		let data = []
		let obj = {
			skuId: nowChooseItem.value.id,
			count: countVal.value
		}
		data.push(obj)
		cartStoreDeatil.$state.cartDeatils = Object.assign({}, queryData, {
			items: data
		});

		// console.log(cartStoreDeatil.$state.cartDeatils)
		// let items = []
		// for (let i = 0; i < data.length; i++) {
		//   items[encodeURIComponent('items[' + i + '' + '].skuId')] = data[i].skuId + '';
		//   items[encodeURIComponent('items[' + i + '' + '].count')] = data[i].count + '';
		// }
		// let resData = Object.assign({}, queryData, items);

		// const queryString = Object.keys(resData)
		//   .map((key) => key + '=' + resData[key])
		//   .join('&');

		cartStoreDeatil.$state.orderInfo = cartStoreDeatil.$state.cartDeatils
		showBottom.value = false
		uni.navigateTo({
			url: "../pay/index"
		})
	}
	defineExpose({
		showBottom,
		choosedList,
		countVal,
		nowChooseItem
	})
</script>


<template>
	<view>
		<van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round>

			<view class="pt20 pdlr20 pb20 borderB">
				<view class="between">
					<view class="ww24"></view>
					<view class=" f16 semiBold">{{t('com.pop_h2')}}</view>
					<view>
						<img src="../../static/icons/pop_close.png" class="ww24 hh24 " @click="showBottom = false">
					</view>
				</view>
			</view>

			<view class="pt20 pdlr20 ">
				<view class="flex ">
					<view>
						<img :src="nowChooseItem.picUrl" class="ww80 hh80 bbo12" />
					</view>
					<view class="ml12 ">
						<view class=" ">
							<van-text-ellipsis rows="1" :content="goodsProperty.name" class="f14 " />
						</view>
						<view class="mt4 f12 colorDel">{{t('goods.g_h1')}}: {{nowChooseItem.stock}}
						</view>
						<view class="mt17">
							<span class="colorContent text_bold f17">${{fen2yuan(nowChooseItem.price)}}</span> <del
								class="colorDel f13">${{fen2yuan(nowChooseItem.marketPrice)}}</del>
						</view>
					</view>
				</view>
				<view style="max-height: 300px;overflow: scroll;">
					<view class="mt30" v-for="(item,index) in propertyList">
						<view class="f15 semiBold">{{item.name}}</view>
						<view class="colorBoxEl ">
							<view v-for="(ite,ind) in item.values">
								<view class="sizeItem center f13 " v-if="ite.valueId !==0"
									:class="choosedList[index].parentId == item.id&& choosedList[index].valueId ==ite.id ?'sizeActEl':''"
									:key="ite" @tap="onSelectSku(item.id, ite.id)">
									{{ite.name}}
								</view>
							</view>
						</view>
					</view>
				</view>

			</view>
			<view class="mt8 pt7 borderT flex col_center pdlr20">
				<view class="f15 semiBold">{{t('com.pop_h3')}}</view>
				<view class="  flex ml16">
					<view class="numberBox between">
						<img src="../../static/icons/cel.png" class="ww20 hh20"
							@click="countVal!== goodsProperty.startSale?countVal --:''">
						<view class="mglr13 f13 semiBold">{{ countVal }}</view>
						<img src="../../static/icons/add.png" class="ww20 hh20" @click="countVal ++">
					</view>
				</view>
			</view>
			<view class="mt14 center botBtns pt4 pb4 borderT pdlr11">
				<view class="addCartEl" @click="addToCar">
					{{t('goods.g_h7')}}
				</view>
				<view class="btnContent center text_white buyNowEl" @click="buyNowHandle">
					{{t('goods.g_h8')}}
				</view>
			</view>
		</van-popup>
	</view>
</template>


<style lang="scss" scoped>
	.numberBox {
		background: #f8f8f8;
		padding: 8px 10px;
		border-radius: 50px;
	}

	.borderB,
	.borderT {
		border-color: #efefefef;
	}

	.botBtns {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;

		view {
			width: 50%;
			text-align: center;
			height: 44px;

			line-height: 44px;
			border-radius: 44px;
			border: 1px solid;
			border: 1px solid #8736e1;
			font-weight: normal;
			font-size: 14px;
		}

		.addCartEl {
			color: #8736e1;
		}
	}

	.numBoxEl {
		background: #f8f8f8;
		border-radius: 50px;
		padding: 10px;
		min-width: 60px;
	}

	.colorBoxEl {
		margin-top: 12px;
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		flex-shrink: 1;

		.sizeItem {
			// width: 48px;
			padding: 0 10px;
			height: 32px;
			border-radius: 10px;
			background: #f8f8f8;
		}

		.sizeActEl {
			background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
			color: #fff;
		}
	}
</style>
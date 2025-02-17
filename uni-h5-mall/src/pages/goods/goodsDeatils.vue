<script setup>
	import {
		goLoginDialog
	} from '../../../comm/goLogin.js';
	import {
		cartStore
	} from '@/store/cart';
	import {
		useI18n
	} from "vue-i18n";
	import goodsList from '../../components/goodsList/goodsList.vue';
	import {
		fen2yuan
	} from '../../../comm/useGoods.js'
	import {
		throttle
	} from '../../../comm/utils.js'
	import {
		showToast,showImagePreview 
	} from 'vant';
	import goodsDeatilsPop from '../../components/pop/goodsDeatilsPop.vue';
	import sharePop from '../../components/pop/sharePop.vue';
	import request from '../../../comm/request';

	import vue3VideoPlay from 'vue3-video-play' // 引入组件
	import 'vue3-video-play/dist/style.css' // 引入css
	const {
		locale,
		t
	} = useI18n();
	const goodsDeatilsPopRef = ref("")
	const isTopFixed = ref(false)
	// 吸顶判断
	const topChangeHandle = (e) => {
		isTopFixed.value = e
	}
	const goBack = () => {
		history.back()
	}
	const changePage = url => {
		uni.navigateTo({
			url
		})
	}


	// 添加道购物车
	const cartStoreDeatil = cartStore()

	const addToCar = throttle((item) => {
		const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
		if (!res) return
		let data = {
			count: deatilPageData.value.startSale,
			skuId: defaultChooseItem.value.id
		}
		cartStoreDeatil.addToCar(data)
	}, 1000)
	// 这是传递给商品组件的参数
	const searchPage = ref({
		url: '/app-api/product/spu/same',
		data: {
			pageSize: 4,
			spuId: window.location.search.split('id=')[1]
		},
		methods: 'GET'
	})

	const deatilPageData = ref({
		marketPrice: 0,
		price: 0
	})
	const defaultChooseItem = ref({
		marketPrice: 0,
		price: 0
	})
	const videoUrl = ref("")
	const swiperList = ref([])
	const getDeatil = (id) => {
		request({
			url: '/app-api/product/spu/get-detail',
			data: {
				id
			}
		}).then(res => {
			deatilPageData.value = res
			swiperList.value = res.sliderPicUrls
			if(res.sliderVideoUrls){
				videoUrl.value =  res.sliderVideoUrls[0]
			}
			defaultChooseItem.value = res.skus[0]
			getCommentList(res.id)
			if (uni.getStorageSync('token')) {
				isFavExists(res.id)
			}
		})
	}
	const swiperInd = ref(0)
	const swiperChange = ind => {
		swiperInd.value = ind

if( videoRef.value){
	if (ind == 0 && isPlayed.value ) {
		videoRef.value.play()
	} else {
		videoRef.value.pause()
	}
}
		
	}
	onMounted(() => {
		getDeatil(window.location.search.split('id=')[1])

	})

	const updateChooseItem = obj => {
		defaultChooseItem.value = obj
	}

	const commentList = ref([])
	const commentListToTal = ref(0)
	const getCommentList = (id) => {
		request({
			url: '/app-api/product/comment/page',
			data: {
				spuId: id,
				pageNo: 1,
				pageSize: 1,
				type: 0
			}
		}).then(res => {
			commentList.value = res.list
			commentListToTal.value = res.total
		})
	}
	const isFavExistsBoolean = ref(false)
	const isFavExists = (id) => {

		request({
			url: '/app-api/product/favorite/exits',
			data: {
				spuId: id
			}
		}).then(res => {
			isFavExistsBoolean.value = res
		})
	}

	const addToFav = id => {
		const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
		if (!res) return
		request({
			url: '/app-api/product/favorite/create',
			data: {
				spuId: id
			},
			methods: "POST"
		}).then(res => {
			showToast(t('goods.g_j1'))
			isFavExistsBoolean.value = true
		})
	}
	const removeToFav = id => {
		const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
		if (!res) return
		request({
			url: '/app-api/product/favorite/delete',
			data: {
				spuId: id
			},
			methods: "DELETE"
		}).then(res => {
			showToast(t('goods.g_j2'))
			isFavExistsBoolean.value = false
		})
	}

	const goService = () => {
		uni.navigateTo({
			url: '/pages/chat/index?id=' + deatilPageData.value.id
		})
	}

	const buyNowHandle = () => {
		goodsDeatilsPopRef.value.showBottom = true
	}
	const sharePopRef = ref("")
	onMounted(() => {
		// setTimeout(()=>{
		// 	let el  = document.querySelector('uni-page-wrapper')
		// 		console.log(el)
		// },1000)
	})

	const VideoOptions = ref({
		width: '100%', //播放器高度
		height: '360px', //播放器高度
		color: "#409eff", //主题色
		title: '', //视频名称
		src: "https://waisj-mall-dev.obs.cn-east-3.myhuaweicloud.com/627b9cba9864a21b4ad65bf4d36569fd7f3f8fe390e4a75592900cb9f8764873.mp4", //视频源
		muted: false, //静音
		webFullScreen: false,
		speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
		loop: false, //循环播放
		mirror: false, //镜像画面
		ligthOff: true, //关灯模式
		volume: 0.3, //默认音量大小
		control: true, //是否显示控制
		controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen',
			'fullScreen'
		] //显示所有按钮,
	})
	const playVideo = ref(false) //自动播放
	const showPlayIcon = ref(true)
	const videoRef = ref("")
	const isPlayed = ref(false)
	const playVideoHandle = (ind) => {
		// videoRef.value.play()
		showPlayIcon.value = false
		videoRef.value.play()
		isPlayed.value = true
	}
	
	const  showImageView =(ind)=>{
		showImagePreview(
		{
		  images: swiperList.value,
		  startPosition: ind,
		}
		)
	}
</script>
<template>
	<div id="goodsDeatilsPage">
		<view class="topboxEl">

			<van-sticky :offset-top="0" @change="topChangeHandle">
				<view class="topBtnFixed between" :class="isTopFixed?'topFixedBg ':''">
					<view>
						<img src="../../static/icons/full_back.png" class="ww32 hh32" @click="goBack">
					</view>
					<view>
						<img src="../../static/icons/full_love.png" v-if="!isFavExistsBoolean"
							@click=" addToFav(deatilPageData.id)" class="ww32 hh32">
						<img src="../../static/icons/dLoved.png" v-else @click="removeToFav(deatilPageData.id)"
							class="ww32 hh32">
						<img src="../../static/icons/kefu.png" class="ww32 hh32 ml2" @click="goService">
						<img src="../../static/icons/full_share.png" class="ww32 hh32 ml2"
							@click="sharePopRef.showBottom = true">
					</view>
				</view>
			</van-sticky>

			<view class="center ">
				<view class="rightDots" v-if="swiperList.length >1">
					{{Number(swiperInd +1) }} <span class="mglr2">/ </span>{{swiperList.length }}
				</view>
				<van-swipe class="my-swipe" :autoplay="30000" :show-indicators="false" @change="swiperChange">
					<van-swipe-item  v-if="videoUrl">
						<view class="videoEl bigPic">
							<vue3VideoPlay v-bind="VideoOptions" :src="videoUrl" :poster='deatilPageData.picUrl'
								:autoPlay="false" ref="videoRef" @ended="showPlayIcon = true" />
							<img src="@/static/icons/playVideo.png" v-if="showPlayIcon" class="videoIcon"
								style="width: 50px;height: 50px;" @click="playVideoHandle(index)" />
						</view>
					</van-swipe-item>
					<van-swipe-item v-for="(item,index) in swiperList" @click="showImageView(index)">
						<view style="width: 100%;height: 100%;">
							<img :src="item" class="bigPic" />
						</view>
					</van-swipe-item>


				</van-swipe>

				<!-- swiperList -->
			</view>
		</view>
		<!-- 规格价格分类 尺寸 -->
		<view class="pdlr20 pt16 pb15 bgFf">
			<view class="">
				<van-text-ellipsis rows="3" :content="deatilPageData.name" class="semiBold f18"
					style="line-height: 23px;" />
			</view>
			<view class="f14  mt8 colorCCC">
				<view>{{deatilPageData.introduction}}</view>
			</view>
			<view class="mt8 flex">
				<view class="pdlr6 pdtb4 f10 color5E bgDe bbo5">
					{{t('goods.g_h1')}}
					:{{deatilPageData.stock}} | {{t('goods.g_h2')}}: {{deatilPageData.salesCount}}
				</view>
 <!-- v-if="commentList.length > 0" -->
				<view class="pdlr6 pdtb4 f10 flex col_center  color5E  ml26">
					<img src="../../static/icons/star.png" class="ww14 hh14">
					<view class="ml10">
						5.0 ({{commentListToTal}} {{t('goods.rev_c1')}})
					</view>
				</view>
			</view>

			<view class="mt15 flex col_center" v-if="defaultChooseItem.valueId !== 0">
				<view class="f20 text_bold colorContent">${{ fen2yuan(defaultChooseItem.price)}}</view>
				<view class="colorDel ml4 f14">
					<del>${{ fen2yuan( defaultChooseItem.marketPrice)}}</del>
				</view>
			</view>
			<view class=" between mt16" @click="goodsDeatilsPopRef.showBottom = true">
				<view class="flex col_center">
					<!-- <view class="f15 semiBold">{{t('goods.g_h3')}}</view> -->
					<view class="  f13 color7C " style="word-break: break-all;">
						<span v-for="(item,index) in defaultChooseItem.properties" class="mr5">
							<span v-if="item.valueId !== 0"> {{item.propertyName}} : {{item.valueName}} <span
									v-if="index< defaultChooseItem.properties.length-1">|</span></span>
							<span v-else> {{t('add1.a_a4')}}</span>

						</span>
					</view>
				</view>
				<img src="../../static/icons/g_right.png" class="ww24 hh24">
			</view>
			<view class="f12 mt5 color7C" v-if="deatilPageData.startSale >1">
				{{t('goods.g_h14')}} : <span class="semiBold colorContent f14">{{deatilPageData.startSale}}</span>
			</view>
		</view>
		<view v-if="commentList.length >0">
			<view class="bgF8f8 hh8 "></view>
			<!-- 评论 -->
			<view class="pdlr20 mt8 pt19 pb16   bgFf">
				<view class="between">
					<view class="f15 semiBold">
						{{t('goods.g_h4')}}
					</view>
					<img src="../../static/icons/g_right.png" class="ww24 hh24"
						@click="changePage('./comment?id='+deatilPageData.id)">
				</view>

				<view v-for="item in commentList">
					<view class="mt15 between">
						<view class="flex">
							<img :src="item.userAvatar" class="ww24 hh24">
							<view class="ml12">{{item.userNickname}}</view>
						</view>
						<view>

							<van-rate v-model="item.descriptionScores" :size="14" gutter="3" color="#FFC058"
								void-icon="star" void-color="#eee" readonly />
						</view>
					</view>
					<view class="mt13 textHiddenTwo f12 color5E">
						{{item.content}}
					</view>
				</view>
			</view>
		</view>

		<view class="bgF8f8 hh8 "></view>
		<!-- 成分 -->
		<view class="pdlr20 mt8 pdtb16   bgFf">
			<view class="f15 semiBold">
				{{t('goods.g_h5')}}
			</view>
			<view class="brandList" v-if="deatilPageData.proIntro && deatilPageData.proIntro.length >0">
				 <view class="brandItem f12" v-for="item in deatilPageData.proIntro">
					 <view class="brand_name ">{{item.split('-')[0]}}</view>
					 <view class="brand_value ">{{item.split('-')[1]}}</view>
				 </view>
			</view>
			<view class="richText mt12" v-html="deatilPageData.description"></view>
		</view>

		<!-- <view class="bgF8f8 hh8 "></view> -->
		<!-- 推荐 -->
		<view class="pdlr10 mt8 pdtb16   bgF8f8  ">
			<view class="pdlr10 pb16">
				<view class="f16  semiBold hasBeforeLine">
					{{t('goods.g_h6')}}
				</view>
			</view>
			<goodsList :searchPage="searchPage"></goodsList>
		</view>

		<view style="height: 50px;"></view>
		<!-- 	// {{document.querySel}} -->
		<van-back-top :bottom="80" />
		<goodsDeatilsPop ref="goodsDeatilsPopRef" :goodsProperty='deatilPageData' :updateChooseItem="updateChooseItem">
		</goodsDeatilsPop>
		<view class="fixedBottom center">
			<view class="addCartEl" @click="addToCar">
				{{t('goods.g_h7')}}
			</view>
			<view class="btnContent center text_white buyNowEl" @click="buyNowHandle">
				{{t('goods.g_h8')}}
			</view>
		</view>
		<sharePop ref="sharePopRef" :proDeatil="deatilPageData"></sharePop>
	</div>
</template>


<style lang="scss" scoped>
	.brandList{
		background: #F7F7F5;
		border-radius: 12px 12px 12px 12px;
		padding: 12px 10px;
		margin: 12px 0;
		.brandItem{
			display: flex;
			&:not(:last-child){
				margin-bottom: 12px;
			}
			.brand_name{
				color: #5E647C;
				width: 20%;
			}
		}
	}
	.videoEl {
		position: relative;

		.videoIcon {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 99;
		}
	}

	.fixedBottom {
		position: fixed;
		bottom: 0px;
		width: calc(100% - 20px);
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 10px;
		z-index: 999;
		background: #ffffff;
		box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.07);
		border-radius: 0px 0px 0px 0px;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
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

	.introEl {
		background: #f7f7f5;
		border-radius: 12px;

		.introItem:not(:last-child) {
			margin-bottom: 12px;
		}

		.introItem {
			view:nth-child(1) {
				width: 80px;
			}
		}
	}

	.littlePicItem:not(:last-child) {
		margin-right: 8px;
	}

	.littlePicItem {
		border: 1px solid;
		border-color: #eeeeee;
		border-radius: 5px;
	}

	.actLittleBorder {
		border-color: #8735e1;
		border-radius: 5px;
	}

	.topboxEl {
		background: #f0f0f2;
		height: 360px;
		position: relative;
		width: 100%;

		.rightDots {
			padding: 5px 10px;
			border-radius: 10px;
			font-size: 10px;
			color: #fff;
			// background: deepskyblue;
			background: rgba(0, 0, 0, 0.52);
			border-radius: 16px 16px 16px 16px;
			position: absolute;
			z-index: 99;
			bottom: 15px;
			right: 12px;
		}

		.my-swipe {
			position: absolute;
			top: 0;
			height: 100%;
			width: 100%;

			.van-swipe-item {
				text-align: center;

				.bigPic {
					height: 100%;
					width: 100%;
				}
			}
		}

		// .bigPic {
		//   position: absolute;
		//   top: 0;
		//   height: 100%;
		//   width: 100%;
		// }

		.topBtnFixed {
			padding: 0 10px;
			z-index: 99;
			position: absolute;
			width: calc(100% - 20px);
			height: 50px;
		}
	}

	.topFixedBg {
		background: #f0f0f2;
	}
</style>
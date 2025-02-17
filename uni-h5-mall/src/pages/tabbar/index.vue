<script setup>
import {
  onLoad,
  onPageScroll,
  onPullDownRefresh,
  onShow
} from '@dcloudio/uni-app';
import Tabbar from '@/components/tabbar/tabbar.vue';
import request from '../../../comm/request.ts'
import {
  userStore
} from '@/store/user.js';
import {
  throttle
} from '../../../comm/utils.js';
import {
  handleTree
} from '../../../comm/useGoods.js';
import {
  showToast
} from 'vant';
import topSearch from '@/components/topSearch/topSearch.vue';
import indexPopFl from '@/components/pop/indexPopFl.vue';

import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
import {
  cartStore
} from '@/store/cart';
import goodsList from '../../components/goodsList/goodsList.vue';
import { computed } from 'vue';
const cartStoreDeatil = cartStore();
const userStoreInfo = userStore()
const userInfo = computed(() => {
  return userStoreInfo.$state.userInfo
})
const searchVal = ref("")

const refresh = ref(false)
const refreshFun = () => {
	getCategory()
	getData()
  setTimeout(() => {
    refresh.value = false
  }, 3000)
}

const getCategory = () => {
  request({
    url: '/app-api/product/category/list'
  }).then(res => {
    cartStoreDeatil.$state.classifyList = handleTree(res)

  })
}
const classifyList = computed(() => {
  return [{
    name: 'Recommend',
    value: 0,
    id: 0
  },
  ...cartStoreDeatil.$state.classifyList
  ]
})

const changeHandle = e => {
  tabActive.value = e
  let data = {
    pageNo: 1,
    pageSize: 10
  }
  if (e !== 0) {
    data.categoryId = classifyList.value[e].id
  }
  goodsListRef.value.reloadSearchData(data)
}

// 轮播图列表
const swiperList = ref([])

// 获取首页信息内容
const getData = () => {
  request({
    url: '/app-api/promotion/diy-template/used',
    method: 'GET'
  }).then(res => {
    swiperList.value = res.home.components[0].property.items

  }).catch(e => {
    showToast(e.msg)
  })
}
onMounted(() => {
  getCategory()
  getData()
})



const goodsListRef = ref("")
let mrFl = ref(t('tab.ind_j1'))
const closeSelectPop = (ind, val) => {
  // sortField\
  let data = {
    pageNo: 1,
    pageSize: 10
  }
  if (ind == 1) {
    data.sortField = "salesCount"
    data.sortAsc = false
  } else if (ind == 2) {
    data.sortAsc = false
  }
  mrFl.value = val
  goodsListRef.value.reloadSearchData(data)
}

const indexPopFlRef = ref("")
const showBotHandle = () => {
  indexPopFlRef.value.showBottom = true
}
const changePage = url => {
  uni.navigateTo({
    url
  })
}

// 这是传递给商品组件的参数
const searchPage = ref({
  url: '/app-api/product/spu/page',
  data: {},
  methods: 'GET'
})



//，goole 0 ， x 是 1 ，fb2
const postCode = (data) => {
  request({
    url: '/app-api/member/auth/social-login',
    data: data,
    methods: 'POST'
  }).then(res => {
    uni.setStorageSync('token', res.accessToken)
    uni.setStorageSync('refresh-token', res.refreshToken)
    userStoreInfo.updateUserInfo()
    showToast(t('login.log_log_suc'))
    uni.reLaunch({
      url: '/'
    });
  })
}
onMounted(() => {
  // 校验注册
  if (window.location.href.includes('state=') && window.location.href.includes('code=')) {
    // goole login
    let state = window.location.href.split('state=')[1].split('&code=')[0]
    let code = window.location.href.split('code=')[1].split('&scope=')[0]
    let type = 0
    let data = {
      state,
      type,
      code,
    }
    postCode(data)
  } else if (window.location.href.includes('oauth_token=') && window.location.href.includes(
    'oauth_verifier=')) {
    // x login
    let oauthToken = window.location.href.split('oauth_token=')[1].split('&oauth_verifier')[0]
    let oauthVerifier = window.location.href.split('oauth_verifier=')[1].split('#/')[0]
    let data = {
      oauthToken,
      oauthVerifier,
      type: 1
    }

    postCode(data)
  } else if (window.location.href.includes('#_=_')) {
    let code = window.location.href.split('code=')[1].split('#_=_')[0]
    let type = 2
    let data = {
      state: "",
      type,
      code,
    }
    postCode(data)
  }

})
const tabbarRef = ref("")
const tabActive = ref(0)

const isTopFixed= ref(false)
const topChangeHandle= e=>{
	isTopFixed.value = e
}

</script>
<template>
  <view class="content bgF8f8">
    <van-pull-refresh v-model="refresh" @refresh="refreshFun" loosing-text="  " loading-text="loading...">
 <view class="topBg">
      <van-sticky :offset-top="0" @change="topChangeHandle">
        <view class="pdlr10 pdtb10  " :class="isTopFixed?'whiteBg':''">
          <view class=" flex  col_center">
            <img src="@/static/logo.png" class="ww59 hh30" />
            <topSearch class="ml11 flex1"></topSearch>
          </view>

          <view class="pt5">
            <van-tabs v-model:active="tabActive" shrink swipeable title-active-color="#9F58EF"
              title-inactive-color="#333" color="#9F58EF" line-width="20" line-height="4" @change="changeHandle">
              <van-tab v-for="(item,index) in classifyList" :title="item.name" :key="item.id">
              </van-tab>
            </van-tabs>
          </view>
        </view>

        <!--  -->
      </van-sticky>

      <!-- swiper -->
      <view class="swiperBox mt5">
        <swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :duration="3000" :circular="true"
          :disable-touch="false">
          <swiper-item v-for="(item,index) in swiperList" :id="index">
            <img :src="item.imgUrl" alt="banner" class="swiperImg mglr10"></img>
          </swiper-item>
        </swiper>
      </view>
	  
	 </view>
      <view class="contentBox pdlr10">

        <!-- 分类 -->
        <view class="between mt18">
          <view class="flex col_center">
            <img src="@/static/index/laba.png" class="ww28 hh28">
            <view class="semiBold f18 ml12 ">
              {{t('tab.ind_h1')}}
            </view>
          </view>
          <view class="AllEl flex col_center" @click="showBotHandle">
            {{mrFl}}
            <img src="../../static/index/fl.png" class="ml6 ww14 hh14" alt="">
          </view>
        </view>

        <view class="mt12" style="min-height: 100vh;">
          <goodsList ref="goodsListRef" :searchPage="searchPage"></goodsList>
        </view>
      </view>
      <!-- <van-back-top :bottom="80" /> -->
      <view style="height:100rpx"></view>
    </van-pull-refresh>
    <indexPopFl ref="indexPopFlRef" :closeSelectPop="closeSelectPop"></indexPopFl>

    <view class="loginBotTip" v-if="userInfo && !userInfo.id">

      <view class="pdtb8 pdlr10 between f15 text_white">
        <view>{{t('tab.ind_h2')}}</view>
        <view class="btnContent center" @click="changePage('../login/login')">
		<van-text-ellipsis rows="2" :content="t('tab.ind_h3')"  class="f15 " />
	</view>
      </view>
    </view>
    <Tabbar :activeIndex="0" ref="tabbarRef"></Tabbar>
  </view>
</template>



<style lang="scss" scoped>
	.topBg{
		background: linear-gradient( 180deg, #FFFFFF 0%, rgba(255,255,255,0.15) 100%);
	}
	.whiteBg{
		background: #fff;
	}
:deep(.van-tabs__nav) {
  background: transparent;
  padding-left: 0;

  .van-tab {
    padding: 0;
	margin-right: 25px;
  }
}

.mainf8Bg {
  :deep(.searchBox) {
    margin-top: 0;
    flex: 1;
  }
}

.loginBotTip {
  position: fixed;
  bottom: 50px;
  width: 100%;
  background: rgba(9, 9, 9, 0.7);

  .btnContent {
    min-width: 76px;
    height: 32px;
    border-radius: 50px;
  }
}

.addToCar {
  width: 36px;
  height: 26px;
  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
  border-radius: 48px 48px 48px 48px;
}



.AllEl {
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.03);
  border-radius: 16px 16px 16px 16px;
  padding: 8px 12px;
  font-size: 12px;
  color: #5e647c;
}

.swiperBox {
  .swiper {
    height: 360rpx;
  }

  .swiper-item {
    display: block;
    text-align: center;
    border-radius: 30rpx;
    width: 100%;
    height: 200rpx !important;
  }

  .swiperImg {
    width: calc(100% - 20px);
    height: 320rpx;
    border-radius: 30rpx;
  }
}
</style>
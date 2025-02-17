
<script setup>
import Tabbar from '@/components/tabbar/tabbar.vue';
import request from '../../../comm/request.ts';
import {
  userStore
} from '@/store/user.js';
import { onShow } from '@dcloudio/uni-app';
const userStoreInfo = userStore()
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
import { goLoginDialog } from '../../../comm/goLogin.js';
const userInfo = computed(() => {
  return userStoreInfo.$state.userInfo
})

if (!userInfo.value) {
  userStoreInfo.$state.userInfo = {
    nickname: "",
    point: ""
  }
}
const userWallet = computed(() => {
  return userStoreInfo.$state.userWallet
})
const box2List = computed(() => [
  {
    name: t('tab.my_j1'),
    img: "../../static/my/t2.png",
    url: "../my/favorite",
    value: box2Data.value.fav || 0
  },
  {
    name: t('tab.my_j2'),
    img: "../../static/my/t3.png",
    url: "../my/footprint",
    value: box2Data.value.foot || 0
  },
]
)
const box2Data = ref({
  fav: 0,
  foot: 0
})
const box3List = computed(() => {
  return [
    {
      name: t('pay.ord_li_j2'),
      img: "../../static/my/f1.png",
      status: 1
    },
    {
      name: t('pay.ord_li_j3'),
      img: "../../static/my/f2.png",
      status: 2
    },
    {
      name: t('pay.ord_li_j4'),
      img: "../../static/my/f3.png",
      status: 3
    },
    {
      name: t('tab.my_j4'),
      img: "../../static/my/f4.png",
      status: 0
    },
  ]
})

const box5List = [
  {
    name: t('tab.my_j5'),
    img: "../../static/my/w1.png",
    url: "../chat/index",
  },
  // {
  //   name: 'Address',
  //   img: "../../static/my/w4.png",
  //   url: "../my/addressList",
  // },
  {
    name: t('tab.my_j6'),
    img: "../../static/my/w3.png",
    url: "../my/article",
  },

  {
    name: t('my.fed_t1'),
    img: "../../static/my/w5.png",
    url: "../my/feedback",
  },
  {
    name: t('my.que_t1'),
    img: "../../static/my/w2.png",
    url: "../my/questions",
  },
]


const changePage = (url, type) => {
  const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))

  if (res) {
    uni.navigateTo({
      url
    })
  }
}

const waitOrder = ref(0)
const waitOrder1 = ref(0)
const waitOrder2 = ref(0)
const getFavFootData = () => {
  request({
    url: '/app-api/product/favorite/page',
    methods: 'GET',

  }).then(res => {
    box2Data.value.fav = res.total
  })
  request({
    url: '/app-api/product/browse-history/page',
    methods: 'GET',

  }).then(res => {
    box2Data.value.foot = res.total
  })


  if (uni.getStorageSync('token')) {
    request({
      url: '/app-api/trade/order/page?pageNo=1&pageSize=10&status=0',
      methods: 'GET',
    }).then(res => {
      waitOrder.value = res.total
    })
	
	request({
	  url: '/app-api/trade/order/page?pageNo=1&pageSize=10&status=10',
	  methods: 'GET',
	}).then(res => {
	  waitOrder1.value = res.total
	})
	
	request({
	  url: '/app-api/trade/order/page?pageNo=1&pageSize=10&status=30',
	  methods: 'GET',
	}).then(res => {
	  waitOrder2.value = res.total
	})
  }
}
onShow(() => {
  userStoreInfo.updateUserInfo()
  if (uni.getStorageSync('token')) {
    getFavFootData()
  }
})
</script>
<template>
  <view class="myCenter bgF8f8">
    <view class="pdlr10 pt22">
      <view class="flex topBox">
        <view class="flex col_center">
          <view @click="changePage('../setting/index')">

            <van-image class="ww66 hh66 " :src="userInfo.avatar?userInfo.avatar:'../../static/my/def_head.png'" lazy-load
              radius="50px">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>

          </view>
          <view class="ml20">
            <view class="f18 semiBold">{{userInfo.nickname ||userInfo.mobile || ""}}</view>
            <view class="mt8 colorAf f13">{{t('tab.my_h1')}}</view>
          </view>
        </view>
        <view class="mr10">
          <img src="@/static/my/d1.png" class="ww24 hh24" @click="changePage('../setting/index')" />
        </view>
      </view>

      <view class="my_box3 mt20">
        <view v-for="(item,index) in box3List" :key="index" class="gridItem"
          @click="changePage('../pay/orderList?status='+item.status)">
          <view>
            <img :src="item.img" class="ww48 hh48" />
          </view>
          <view class="gridName  f12 mt3 color999" :class="index ==3?'text_bold color09':''">{{item.name}}</view>

          <view class="absVal" v-if="index == 0 && waitOrder>0">
            {{waitOrder}}
          </view>
		  <view class="absVal" v-if="index == 1 && waitOrder1>0">
		    {{waitOrder1}}
		  </view>
		  <view class="absVal" v-if="index == 2 && waitOrder2>0">
		    {{waitOrder2}}
		  </view>
        </view>
      </view>

      <view class="my_box2 mt16">
        <view v-for="(item,index) in box2List" :key="index" class="gridItem" @click="changePage(item.url)">
          <view class="flex col_center">
            <view>
              <img :src="item.img" class="ww32 hh32" />
            </view>
            <view class="gridName semiBold f14 ml8">
              <view class="semiBold">{{item.name}}</view>
              <view class="color999    f12">{{item.value}}</view>
            </view>
          </view>

          <view>
            <img src="../../static/icons/g_left.png" class="ww24 hh24" />
          </view>
        </view>
      </view>

      <view class="my_box5 mt16">
        <view v-for="(item,index) in box5List" :key="index" class="flexItem between" @click="changePage(item.url,2)">
          <view class="flex col_center">
            <img :src="item.img" class="ww24 hh24" />
            <view class="flexName ml22 f14 ">{{item.name}}</view>
          </view>
          <img src="../../static/icons/g_left.png" class="ww24 hh24" />
        </view>
      </view>

      <view style="height: 50px;"></view>
    </view>
    <Tabbar :activeIndex="3"></Tabbar>
  </view>
</template>


<style lang="scss" scoped>
.myCenter {
  background-image: url("@/static/my/myBg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  width: 100%;
  background-position: top;
  min-height: 100vh;
  .my_box5 {
    padding: 30px 20px;
    background: #fff;
    border-radius: 16px 16px 16px 16px;
    .flexItem:not(:last-child) {
      margin-bottom: 30px;
    }
    .flexName {
      color: #090909;
      font-weight: 500;
    }
  }
  .my_box3 {
    padding: 16px 10px;
    background: #fff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.01);
    border-radius: 16px 16px 16px 16px;
    display: flex;
    justify-content: space-between;
    .gridItem {
      width: 20%;
      text-align: center;
      position: relative;
      .absVal {
        position: absolute;
        top: -5px;
        right: 7px;
        color: #ff0004;
        font-size: 11px;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
        border: 1px solid #ff0004;
        border-radius: 50%;
		background: #fff;
      }
    }
  }

  .my_box2 {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .gridItem {
      // width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      padding: 20px 16px;
      border-radius: 16px;
    }
  }
  .topBox {
    justify-content: space-between;
  }
}
</style>
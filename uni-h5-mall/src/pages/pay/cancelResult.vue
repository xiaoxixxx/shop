<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import goodsList from '@/components/goodsList/goodsList.vue'
import { showToast } from 'vant';
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const { t } = useI18n();
const cartStoreDeatil = cartStore();


const isTopFixed = ref(false)
// 吸顶判断
const topChangeHandle = (e) => {
  isTopFixed.value = e
}

const searchPage = ref({
  url: '/app-api/product/spu/page',
  data: {},
  methods: 'GET'
})

const changePage = url => {
  uni.navigateTo({
    url
  })
}
const goBack = () => {
  uni.navigateTo({
    url: '/'
  })
}
</script>


<template>

  <view>
    <view class="pdlr10 pdtb10  between  topNav" :class="isTopFixed?'topFixedBg ':''">
      <view class="left">
        <img src="../../static/icons/right.png" class="hh32 ww32" @click="goBack">
      </view>
      <view class="text_center center  f17  text_bold ">{{t('pay.pay_t1')}}</view>
      <view class="right">
        <slot></slot>
      </view>
    </view>

    <view class="pb30">
      <view class="center mt20 flex_col">
        <img src="@/static/icons/updateSuccess.png" class="updateImg" />
        <view class=" text_bold f20 mt20">
          {{t('pay.pay_h1')}}
        </view>
        <view class="f12 colorCCC mt12 pdlr50 text_center">
          {{t('pay.pay_h2')}}
        </view>
      </view>

    </view>

    <view class="mainf8Bg hh8"></view>

    <view class="pdlr13  pdtb20  bgFf">
      <view class="f15 text_bold hasBeforeLine">
        {{t('goods.g_h6')}}
      </view>
      <goodsList :searchPage="searchPage"></goodsList>
    </view>
  </view>
</template>



<style lang="scss" scoped>
.topFixedBg {
  background: #f8f8f8f8;
}
.updateImg {
  width: 120px;
  height: 120px;
}
.colorCCC {
  line-height: 14px;
}
.btn {
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  border-radius: 50px;
  line-height: 44px;
  font-size: 14px;
}
.btnNoraml {
  border: 1px solid #cccccc;
}
</style>
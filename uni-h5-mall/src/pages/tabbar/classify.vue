<script setup>
import Tabbar from '@/components/tabbar/tabbar.vue';
import topSearch from '@/components/topSearch/topSearch.vue';
import request from '../../../comm/request.ts';
import { handleTree } from '../../../comm/useGoods.js';

import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
import {
  cartStore
} from '@/store/cart';
const cartStoreDeatil = cartStore();
const refresh = ref(false)
const refreshFun = () => {
  setTimeout(() => {
    refresh.value = false
  }, 3000)
}

const classifyList = computed(() => {
  return cartStoreDeatil.$state.classifyList
})


const goClass = item => {

  cartStoreDeatil.$state.chooseTag = []
  cartStoreDeatil.$state.chooseTag.push(item)
  
  if(!!item.children){
  	uni.navigateTo({
  		url: '../class/class'
  	});
  }else{
  	// 无下级
  	uni.navigateTo({
  	  url: '../class/classSearch?fId=' + item.id
  	});
  }
 
}
const dataList = ref([])
const getCategory = () => {
  request({
    url: '/app-api/product/category/list'
  }).then(res => {
    cartStoreDeatil.$state.classifyList = handleTree(res)
  })
}
onMounted(() => {
  getCategory()
})
</script>
<template>
  <view class="bgF8f8">
    <van-pull-refresh v-model="refresh" @refresh="refreshFun" loosing-text="  " loading-text="loading...">
      <van-sticky :offset-top="0">
        <view class="pdlr10 pdtb10  mainf8Bg">
          <view class="text_center mt12 f17  semiBold pb16 ">{{t('tab.cla_t1')}}</view>

          <topSearch></topSearch>
        </view>
      </van-sticky>
      <view class="pdlr10 mt6">
        <view class=" classList">
          <view class="classItem" v-for="item in classifyList" @click="goClass(item)">
            <view class="pt12 pdlr8 f14  hh40" >
				<van-text-ellipsis rows="2" :content="item.name"  class="f14  default_hidden_two" style="text-align: left;" />
			</view>
			
            <view class=" center ">
              <van-image  class="classPostPic" :src="item.picUrl">
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>
            </view>
          </view>
        </view>
      </view>

      <view class="hh50"></view>
      <van-back-top :bottom="80" />
      <view style="height:100rpx"></view>
    </van-pull-refresh>
    <Tabbar :activeIndex="1"></Tabbar>
  </view>
</template>



<style lang="scss" scoped>
.bgF8f8 {
  min-height: 100vh;
}
.classList {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  .classItem {
	  // height: 140px;
    background: #fff;
    border-radius: 10rpx;
    // height: 100px;
    border-radius: 16px;
    overflow: hidden;
    // display: flex;
    // align-items: center;
    // flex-direction: column;
    // justify-content: space-between;
    .classPostPic {
      width: 112px;
      height: 90px;
    }
  }
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
</style>
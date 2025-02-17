<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import request from '../../../comm/request.ts'
import {
  showToast
} from 'vant';
import {
  fen2yuan
} from '../../../comm/useGoods.js'
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const {
  t
} = useI18n();
const cartStoreDeatil = cartStore();


const dataList = ref([])
const pages = ref({
  pageNo: 1,
  pageSize: 10
})
const paging = ref("")
const queryList = (page) => {
  pages.value.pageNo = page
  request({
    url: '/app-api/product/favorite/page',
    methods: 'GET',
    data: {
      ...pages.value,
    }
  }).then(res => {
   // RECYCLE(-1, "回收站"),
    //    DISABLE(0, "下架"),
    //    ENABLE(1, "上架");
    let arr =res.list.filter(item=>{
   	 return item.status == 1
    })
   paging.value.complete(arr)
    pages.value.pageNo++;
  })
}

const goDeatil = (item) => {
  uni.navigateTo({
    url: '../goods/goodsDeatils?id=' + item.spuId
  })
}

const removeFav = (item) => {
  let obj = {
    spuId: item.spuId
  }

  request({
    url: '/app-api/product/favorite/delete',
    methods: 'DELETE',
    data: {
      spuId: item.spuId,
    }
  }).then(res => {
    paging.value.clean()
    queryList(1)
    showToast(t('my.fav_h1'))
  })

}
</script>


<template>

  <view>
    <topNavbar :title="t('my.fav_t1')" :isWhiteBg="false"></topNavbar>
	<view class="bgF8f8 pdlr10  pt12 " style="min-height: 100vh;">
		
    <z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
      :refresher-enabled="false" empty-view-text=" ">
      <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
      <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->
      <view class="goodsList ">
        <view class="goodsItem bg_whiteGoods" v-for="(item,index) in dataList" :key="index" @click="goDeatil(item)">
          <view class="">
            <view class="g_poster center">
              <van-image width="100%" height="100%" :src="item.picUrl" lazy-load>
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>

              <view class="lovedElBox">
                <img src="@/static/index/loved.png" class="ww24 hh24" @click.stop="removeFav(item)" />
              </view>
            </view>
            <view class="goods_bot">
			  <van-text-ellipsis rows="1" :content="item.spuName" class="f14 default_hidden_two  semiBold" />
              <view class="mt5  f14 between">
                <view>
                  <span class="colorContent text_bold">
                    ${{ fen2yuan(item.price) }}
                  </span>
                </view>

                <view class="addToCar center">
                  <img src="../../static/icons/addToCar.png" class="ww18 hh18" />
                </view>
              </view>
            </view>
          </view>

        </view>
      </view>
    </z-paging>
	</view>
    <view v-if="dataList.length == 0 " class="nullDataBoxEl ">
      <view class="center flex_col nullDataEl">
        <img src="@/static/my/noFav.png" class="" />
        <view class="mt20 f20 text_bold">{{t('goods.g_h10')}}</view>
        <view class="mt12 f12 colorCCC">
          {{t('goods.g_h13')}}
        </view>
      </view>
    </view>
  </view>
</template>



<style lang="scss" scoped>
.nullDataBoxEl {
  min-height: 50vh;
  width: 100%;
  justify-content: center;
  img {
    width: 143px;
    height: 177px;
  }
  .colorCCC {
    width: 260px;
    text-align: center;
  }
}

</style>
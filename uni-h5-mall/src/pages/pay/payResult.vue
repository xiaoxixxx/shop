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


const payStatus = ref(-1) // 1成功  2失败

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

onMounted(()=>{
	payStatus.value=  window.location.href.split('status=')[1]
})
</script>


<template>

  <view>
    <topNavbar :title="t('pay.che_t1')" :backUrl='"/"'></topNavbar>



    <view class="pb30" v-if="payStatus == 0">
      <view class="center mt20 flex_col">
        <img src="@/static/icons/updateFail.png" class="updateImg" />
        <view class=" semiBold f20 mt20">
          {{t('pay.res_h4')}}
        </view>
        <view class="f12 colorCCC mt12 pdlr50 text_center">
          {{t('pay.res_h5')}}
        </view>
      </view>
      <view class="pdlr12 between mt20 flex1">
        <view class="btnNoraml  btn color999"  @click="changePage('/')">
          {{t('pay.ord_li_h12')}}
        </view>
        <view class="btnContent btn  text_white" @click="changePage('/')">
          {{t('pay.res_h6')}}
        </view>
      </view>
    </view>
    <view class="pb30" v-else-if="payStatus == 1">
      <view class="center mt20 flex_col">
        <img src="@/static/icons/updateSuccess.png" class="updateImg" />
        <view class=" semiBold f20 mt20">
          {{t('pay.res_h1')}}
        </view>
        <view class="f12 colorCCC mt12 pdlr50 text_center">
          {{t('pay.res_h2')}}
        </view>
      </view>
      <view class="pdlr12 between mt20 flex1">
        <view class="btnNoraml  btn color999" @click="changePage('/')">
          {{t('pay.ord_li_h12')}}
        </view>
        <view class="btnContent btn  text_white" @click="changePage('./orderList')">
          {{t('pay.res_h3')}}
        </view>
      </view>
    </view>
    <view class="mainf8Bg hh8"></view>

    <view class="pdlr13  pdtb20  bgFf">
      <view class="f16 semiBold hasBeforeLine mb12">
        {{t('goods.g_h6')}}
      </view>
      <goodsList :searchPage="searchPage"></goodsList>
    </view>
  </view>
</template>



<style lang="scss" scoped>
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
  font-weight: normal;
}
.btnNoraml {
  border: 1px solid #cccccc;
}
</style>
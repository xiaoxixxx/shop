<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import {
  showToast
} from 'vant';
import request from '../../../comm/request.ts'
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

const addressList = ref([

])

const deleteHandle = (item) => {
  request({
    url: '/app-api/member/address/delete?id=' + item.id,
    methods: 'DELETE',

  }).then(res => {
    showToast('Delete success')
    getAddressList()
  })
}
const getAddressList = () => {
  request({
    url: '/app-api/member/address/list',

  }).then(res => {
    addressList.value = res
  })
}
const changePage = url => {
  uni.navigateTo({
    url
  })
}

const addressItemClick = item => {
  if (cartStoreDeatil.$state.chooseAddress) {
    cartStoreDeatil.$state.chooseAddressId = item.id
    cartStoreDeatil.$state.chooseAddress = false
    history.back()
  }
}

onShow(() => {
  getAddressList()
})
</script>


<template>

  <view>
    <topNavbar :title="t('my.add_t1')"></topNavbar>
    <view v-if="addressList.length>0">
      <view v-for="item in addressList" @click="addressItemClick(item)">
        <van-swipe-cell right-width="100" :stop-propagation="true">

          <view class="pdlr10 mt20 addressEl">
            <view class="flex">
              <img src="@/static/icons/dw.png" class="ww24 hh24" />
              <view class="ml8 ">
                <view class="mt3 f15 flex col_center"><span class=" text_bold">{{item.firstName + item.lastName  }}
                  </span>
                  <span class="ml5">{{item.mobile +` (${item.country})`}}</span> <img v-if="item.defaultStatus"
                    src="@/static/my/default.png" class="ww38 hh17 ml5">
                </view>
                <view class="mt12 f12 color7C">
                  {{item.detailAddress}}
                </view>
              </view>
            </view>
            <view>
              <img src="@/static/my/update.png" class="ww24 hh24"
                @click.stop="changePage('../pay/address?id='+item.id)" />
            </view>
          </view>
          <template #right>
            <view class="deleteBtn  text_white" @click.stop="deleteHandle(item)">{{t('pay.ord_li_h9')}}</view>
          </template>
        </van-swipe-cell>
        <view class="hh8 mainf8Bg" style="width: 100%;"></view>
      </view>

      <view class="fixedBtn">
        <view class="btnContent center text_white" @click="changePage('../pay/address')">
          {{t('my.add_btn')}}
        </view>
      </view>
    </view>
    <view v-else class="emptyCart center flex_col">
      <img src="@/static/my/null_address.png" />
      <view class="mt20 f20 semiBold">{{t('my.add_h1')}}</view>
      <view class="f12 colorCCC mt12  text_center">{{t('my.add_h2')}}</view>
      <view class="btnContent center text_white" @click="changePage('../pay/address')">
        {{t('my.add_btn')}}
      </view>
    </view>

  </view>
</template>



<style lang="scss" scoped>
.btnContent {
  border-radius: 50px;
  margin-top: 60px;
  font-size: 14px;
  padding: 0 44px;
}
.fixedBtn {
  position: fixed;
  width: calc(100% - 24px);
  bottom: 0;
  padding: 12px 12px;

  .btnContent {
    border-radius: 50px;
  }
}

.deleteBtn {
  width: 101px;
  height: 88px;
  background: linear-gradient(311deg, #ff4b4e 0%, #ff696c 100%);
  border-radius: 0px 0px 0px 0px;
  line-height: 80px;
  text-align: center;
}

.addressEl {
  display: flex;
  justify-content: space-between;
  border-radius: 8px 8px 8px 8px;
  padding: 12px 12px 16px 12px;
  position: relative;
  // overflow: hidden;

  .linesBot {
    position: absolute;
    bottom: 0px;
    left: 0;
  }
}

.emptyCart {
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
</style>
<script setup>
import { showToast } from 'vant';
import request from '../../../comm/request.ts'

import {
  useI18n
} from "vue-i18n";

const {
  locale, t
} = useI18n();



import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()

const showBottom = ref(false)


const nickname = ref(userStoreInfo.$state.userInfo?.nickname)

const confirmHandle = type => {
  if (!nickname.value) {
    showToast('Please enter your new nickname')
    return
  }
  uni.showLoading()
  request({
    url: '/app-api/member/user/update',
    data: {
      nickname: nickname.value
    },
    methods: "PUT"
  }).then(res => {
    showToast(t('my.add_j1'))
    userStoreInfo.updateUserInfo()
    showBottom.value = false
  }).finally(() => {
    uni.hideLoading()
  })
}


defineExpose({
  showBottom
})
</script>


<template>
  <view>
    <van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round>
      <view class="pt30 pdlr20 pb20">
        <view class="between">
          <view class="ww24"></view>
          <view class=" f16 text_bold">{{t('com.set_j3')}} </view>
          <view>
            <img src="../../static/icons/pop_close.png" class="ww24 hh24" @click="showBottom = false">
          </view>
        </view>
        <view class="inputItem f14">
          <input type="text" :placeholder="t('com.set_j4')" v-model="nickname" />
        </view>
      </view>
      <view class="mainf8Bg hh8"></view>
      <view class="pdtb16 pdlr20  f14  ">
        <view class="btnContent  f14 center text_white" @click="confirmHandle">
          {{t('all.con')}}
        </view>
      </view>
    </van-popup>
  </view>
</template>


<style lang="scss" scoped>
.selectItem:not(:last-child) {
  margin-bottom: 30px;
}
.inputItem {
  background: #f8f8f8;
  margin-top: 20px;
  padding: 10px;
  border-radius: 10px;
}
:deep(.input-placeholder) {
  color: #ccc;
}
.btnContent{
	font-weight: normal;
}
</style>
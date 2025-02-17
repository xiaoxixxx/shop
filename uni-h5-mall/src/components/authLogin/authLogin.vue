<template>

  <view>
    <view class="mt30 center between">
      <view class="line"></view>
      <view class="f14 color999 ">{{t('login.olw')}}</view>
      <view class="line"></view>
    </view>
    <view class="grid3box mt20">
      <view v-for="item in loginTypeList" class="loginTypeItem center " @click="xLoginHandle(item.type)">
        <img :src="item.img" class="ww24 hh24">
      </view>
    </view>
  </view>
</template>


<script setup>

import request from '../../../comm/request';
import { useI18n } from "vue-i18n";
const { t } = useI18n()

//，goole 0 ， x 是 1 ，fb2
const loginTypeList = ref([{
  name: 'Goole',
  img: '../../static/icons/goole.png',
  type: 0
},
{
  name: 'X',
  img: '../../static/icons/x.png',
  type: 1
}, {
  name: 'Facebook',
  img: '../../static/icons/fb.png',
  type: 2
},
])


const xLoginHandle = (type) => {
  uni.showLoading()
  request({
    url: '/app-api/member/auth/social-auth-redirect',
    data: {
      type: type,
      redirectUri: type == 2 ? 'https://127.0.0.1:5173/' : 'http://127.0.0.1:5173'
    }
  }).then(res => {
    window.location.href = res
  }).catch(e => {
    showToast(e.msg)
  }).finally(() => {
    uni.hideLoading()
  })
}
</script>

<style lang="scss" scoped>
.line {
  width: 103px;
  height: 0px;
  border-radius: 0px 0px 0px 0px;
  border: 1px solid rgba(204, 204, 204, 0.4);
}
.grid3box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 23px;

  .loginTypeItem {
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #dedede;
    height: 56px;
  }
}
</style>
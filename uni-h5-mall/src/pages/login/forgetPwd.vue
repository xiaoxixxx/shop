<script setup>

import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();

import topNavbar from '@/components/topNavbar/topNavbar.vue';
import request from '../../../comm/request';
import { showToast } from 'vant';

import { loginFormPinia } from "../../store/login";
const loginFormPiniaDeatil = loginFormPinia()



const changePage = url => {
  uni.navigateTo({
    url
  })
}
const mobile = ref("")

const sendCode = () => {
  // loginFormPiniaDeatil.resetPwdForm.mobile = mobile.value
  // uni.navigateTo({
  //   url: './codeVerify'
  // })
  if (!mobile.value) {
    showToast(t('login.fo_phone_pla'))
    return
  }
  uni.showLoading()
  request({
    url: '/app-api/member/auth/send-sms-code',
    methods: 'POST',
    data: {
      scene: 4,
      mobile: mobile.value
    }
  }).then(res => {
    loginFormPiniaDeatil.resetPwdForm.mobile = mobile.value
    showToast(t('login.fo_otp_suc'))
    uni.navigateTo({
      url: './codeVerify'
    })
  }).finally(() => {
    uni.hideLoading()
  })
}


</script>
<template>
  <view class="pt13">
    <topNavbar></topNavbar>
    <view class="pdlr20 pt23">

      <view class="mt40  f28 text_bold">
        {{t('login.fo_title')}}
      </view>
      <view class="mt20 colorCCC f14">
        {{t('login.fo_title_int')}}
      </view>
      <view class="">
        <view class="inpItem  mt24">
          <input type="number" v-model="mobile" class="inpEl" :placeholder="t('login.fo_phone_in')" maxlength="11">
        </view>

        <view class="mt30 f14 pdtb4 center text_white btnContent text_bold" @click="sendCode">
          {{t('login.fo_otp_send')}}
        </view>
        <view class="fixedWord f14 color999 text_center semiBold">
          {{t('login.fo_pwd_rem')}} <span class="regNow semiBold" @click="changePage('./login')">
            {{t('login.fo_pwd_login')}}</span>
        </view>
      </view>

      <view style="height: 100px;"></view>
    </view>
  </view>
</template>


<style lang="scss" scoped>
.btnContent {
  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
}
.fixedWord {
  margin-top: 150px;
}
.regNow {
  color: #8c43dd;
}

.inpItem {
  padding: 0 16px;
  background: #f4f5f5;
  border-radius: 10px 10px 10px 10px;
  border: 1px solid #e9e9e9;
  height: 56px;
  .inpEl {
    line-height: 56px;
    height: 56px;
    width: 100%;
  }
}
.inpEl::placeholder {
  color: #999;
}
</style>
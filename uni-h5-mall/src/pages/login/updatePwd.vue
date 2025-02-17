<script setup>
import { showToast } from 'vant';
import request from '../../../comm/request';
import {
  useI18n
} from "vue-i18n";
import topNavbar from '@/components/topNavbar/topNavbar.vue';
const {
  locale, t
} = useI18n();

import { loginFormPinia } from "../../store/login";
const loginFormPiniaDeatil = loginFormPinia()

const changePage = url => {
  uni.navigateTo({
    url
  })
}

const updatePwdHandle = () => {
  if (password1.value !== password2.value) {
    showToast(t('login.reg_j1'))
    return
  }
  uni.showLoading()
  request({
    url: '/app-api/member/user/reset-password',
    methods: "PUT",
    data: {
      password: password1.value,
      mobile: loginFormPiniaDeatil.$state.resetPwdForm.mobile,
      code: loginFormPiniaDeatil.$state.resetPwdForm.code
    }
  }).then(res => {
    showToast(t('login.res_j1'))
    setTimeout(() => {
      uni.navigateTo({
        url: './login'
      })
    }, 1000)
  }).finally(() => {
    uni.hideLoading()
  })
}
const password1 = ref("")
const password2 = ref("")
const showPwd = ref(false)
const showPwd2 = ref(false)
</script>
<template>
  <view class="pt13">

    <topNavbar></topNavbar>
    <view class="pdlr20 pt23">

      <view class="mt40  f28 text_bold">
        {{ t('login.res_h1') }}
      </view>
      <view class="mt20 colorCCC f14">
        {{ t('login.res_h2') }}
      </view>
      <view class="">

        <view class="inpItem mt24 pwdInp">
          <input v-model="password1" :type="showPwd?'text':'password'" class="inpEl" :placeholder="t('login.res_h3')">
          <view class="eyesGroup">
            <img :src="showPwd?'../../static/icons/eye_open.png':'../../static/icons/eye_close.png'" class="ww24 hh24"
              @click="showPwd = !showPwd" />
          </view>
        </view>
        <view class="inpItem mt24 pwdInp">
          <input v-model="password2" :type="showPwd2?'text':'password'" class="inpEl" :placeholder="t('login.reg_h4')">
          <view class="eyesGroup">
            <img :src="showPwd2?'../../static/icons/eye_open.png':'../../static/icons/eye_close.png'" class="ww24 hh24"
              @click="showPwd2 = !showPwd2" />
          </view>
        </view>

        <view class="mt30 f14 pdtb4 center text_white btnContent text_bold" @click="updatePwdHandle">
          {{ t('login.res_btn')}}
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
.pwdInp {
  position: relative;
}
.eyesGroup {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
<script setup>
import request from '../../../comm/request.ts';
import { showToast } from 'vant';
import {
  useI18n
} from "vue-i18n";
import AuthLogin from '@/components/authLogin/authLogin.vue'
import languagePop from '@/components/pop/languagePop.vue';
import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()
const languagePopRef = ref("");
import {
  settingPlant
} from '@/store/setting.js';
const settingPlantDeatil = settingPlant();

function findObjectIndex(array, key, value) {
  return array.findIndex(obj => obj[key] === value);
}
const langName = ref(settingPlantDeatil.languageList[findObjectIndex(settingPlantDeatil.languageList, 'value', uni.getStorageSync('language'))].name)

const updateLangName = (val) => {
  langName.value = val
}
const {
  locale, t
} = useI18n();

const showPwd = ref(false)
const showPwd2 = ref(false)


const changePage = url => {
  uni.navigateTo({
    url
  })
}

const registerForm = ref({
  mobile: "",
  code: "",
  password: "",
  password2: ""
})

const timer = ref("")
const seconds = ref(59)
const startTimer = () => {
  timer.value = setInterval(() => {
    if (seconds.value == 0) {
      seconds.value = 59
      clearInterval(timer.value)
    }
    seconds.value--;
  }, 1000)
}

const getCode = () => {
  if (!registerForm.value.mobile) {
    showToast(t('login.fo_phone_pla'))
    return
  }
  if (timer.value) return

  uni.showLoading()
  request({
    url: '/app-api/member/auth/send-sms-code',
    data: {
      scene: 1,
      mobile: registerForm.value.mobile
    },
    methods: 'POST'
  }).then(res => {
    startTimer()
    showToast(t('login.fo_otp_suc'))
  }).catch(e => {
    showToast(e.msg)
  }).finally(() => {
    uni.hideLoading()
  })
}

const registerHandle = () => {
  if (registerForm.value.password !== registerForm.value.password2) {
    showToast(t('login.reg_j1'))
    return
  }
  uni.showLoading()
  request({
    url: '/app-api/member/auth/register',
    data: registerForm.value,
    methods: 'POST'
  }).then(res => {
    uni.hideLoading()
    uni.setStorageSync('token', res.accessToken)
    uni.setStorageSync('refresh-token', res.refreshToken)
    userStoreInfo.updateUserInfo()
    showToast(t('login.reg_j2'))
    setTimeout(() => {
      uni.navigateTo({
        url: '/'
      })
    }, 1000)
  }).catch((e) => {
    showToast(e.msg)
  })
  uni.showLoading()
}

</script>
<template>
  <view class="pdlr20 pt23">
    <view class="between">
      <view></view>
      <view class="color999 flex col_center" @click="languagePopRef.showBottom = true">{{langName}}

        <img src="../../static/icons/langChoose.png" class="ww24 hh24 ml8" alt="">
      </view>
    </view>

    <view class="mt40  f28 text_bold">
      {{t('login.reg_h1')}} <br> {{t('login.reg_h1_1')}}
    </view>

    <view class="">
      <view class="inpItem  mt24">
        <input type="text" class="inpEl" :placeholder="t('login.log_phone_inp')" v-model="registerForm.mobile"
          maxlength="11">
      </view>
      <view class="inpItem pwdInp  mt24">
        <input type="number" class="inpEl" :placeholder="t('login.reg_h2')" v-model="registerForm.code" maxlength="4">
        <view class="eyesGroup">
          <view class="otpText semiBold f14" @click="getCode"> {{timer?seconds:t('login.reg_h3')}}</view>
        </view>
      </view>
      <view class="inpItem mt24 pwdInp">
        <input :type="showPwd?'text':'password'" class="inpEl" :placeholder="t('login.log_pwd_inp')"
          v-model="registerForm.password">
        <view class="eyesGroup">
          <img :src="showPwd?'../../static/icons/eye_open.png':'../../static/icons/eye_close.png'" class="ww24 hh24"
            @click="showPwd = !showPwd" />
        </view>
      </view>
      <view class="inpItem mt24 pwdInp">
        <input :type="showPwd2?'text':'password'" class="inpEl" :placeholder="t('login.reg_h4')"
          v-model="registerForm.password2">
        <view class="eyesGroup">
          <img :src="showPwd2?'../../static/icons/eye_open.png':'../../static/icons/eye_close.png'" class="ww24 hh24"
            @click="showPwd2 = !showPwd2" />
        </view>
      </view>
      <view class="mt30 f14 pdtb4 center text_white btnContent text_bold" @click="registerHandle">
        {{t('login.reg_h5')}}
      </view>

      <AuthLogin></AuthLogin>

      <view class="fixedWord f14 color999 text_center  ">
        {{t('login.reg_h6')}} <span class="regNow semiBold" @click="changePage('./login')">{{t('login.reg_h7')}}</span>
      </view>
    </view>
    <languagePop ref="languagePopRef" :updateLangName="updateLangName"></languagePop>
    <view style="height: 50px;"></view>
  </view>
</template>


<style lang="scss" scoped>
.fixedWord {
  margin-top: 50px;
}
.btnContent {
  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
}
.otpText {
  color: #8737e0;
}
.regNow {
  color: #8c43dd;
}

.text_right {
  text-align: right;
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
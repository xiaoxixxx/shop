<script setup>
import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()
import {
  useI18n
} from "vue-i18n";
import AuthLogin from '@/components/authLogin/authLogin.vue'
import languagePop from '@/components/pop/languagePop.vue';
const languagePopRef = ref("");
import {
  settingPlant
} from '@/store/setting.js';
const settingPlantDeatil = settingPlant();

import request from '../../../comm/request';
import { showToast } from 'vant';

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





const changePage = url => {
  uni.navigateTo({
    url
  })
}

const mobile = ref("")
const password = ref("")
const showCuLoading = ref(false)
const LoginHandle = () => {

  uni.showLoading()
	if(loginType.value == 1){
		
  // 密码登录
  request({
    url: '/app-api/member/auth/login',
    data: {
      mobile: mobile.value,
      password: password.value
    },
    methods: "POST"
  }).then(res => {
    // uni.hideLoading()
    uni.setStorageSync('token', res.accessToken)
    uni.setStorageSync('refresh-token', res.refreshToken)
    userStoreInfo.updateUserInfo()
    showToast(t('login.log_log_suc'))
    uni.navigateTo({
      url: '/'
    })
    // 获取用户信息
  }).catch(e => {
    setTimeout(() => {
      showToast(e.msg)
    }, 1000)

  }).finally(() => {
    uni.hideLoading()
  })
  }else{
	  // 验证码登录
	  request({
	    url: '/app-api/member/auth/sms-login',
	    data: {
	      mobile: mobile.value,
	      code: vertifyCode.value
	    },
	    methods: "POST"
	  }).then(res => {
	    // uni.hideLoading()
	    uni.setStorageSync('token', res.accessToken)
	    uni.setStorageSync('refresh-token', res.refreshToken)
	    userStoreInfo.updateUserInfo()
	    showToast(t('login.log_log_suc'))
	    uni.navigateTo({
	      url: '/'
	    })
	    // 获取用户信息
	  }).catch(e => {
	    setTimeout(() => {
	      showToast(e.msg)
	    }, 1000)
	  
	  }).finally(() => {
	    uni.hideLoading()
	  })
  }
}


const goBack = ()=>{
	uni.navigateTo({
		url:'/'
	})
}

const loginType = ref(1)

const vertifyCode = ref("")

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
  if (!mobile.value) {
    showToast(t('login.fo_phone_pla'))
    return
  }
  if (timer.value) return

  uni.showLoading()
  request({
    url: '/app-api/member/auth/send-sms-code',
    data: {
      scene: 1,
      mobile: mobile.value
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

</script>
<template>
  <view class="pdlr20 pt23">
    <view class="between">
      <view>
		  <img src="@/static/icons/right.png"  class="ww24 hh24" @click="goBack">
	  </view>
      <view class="color999 flex col_center" @click="languagePopRef.showBottom = true">{{langName}}
        <img src="../../static/icons/langChoose.png" class="ww24 hh24 ml8" alt="">
      </view>
    </view>

    <view class="mt40  f28 text_bold">
      {{t('login.log_title')}} <br> {{t('login.log_title1')}}
    </view>
    <custom-loading :showCuLoading="showCuLoading"></custom-loading>
    <view class="">
      <view class="inpItem  mt24">
        <input type="text" class="inpEl" v-model="mobile" maxlength="11" :placeholder="t('login.log_phone_inp')">
      </view>
	  
      <view class="inpItem mt24 pwdInp" v-if="loginType == 1">
        <input :type="showPwd?'text':'password'" v-model="password" class="inpEl" :placeholder="t('login.log_pwd_inp')">
        <view class="eyesGroup">
          <img :src="showPwd?'../../static/icons/eye_open.png':'../../static/icons/eye_close.png'" class="ww24 hh24"
            @click="showPwd = !showPwd" />
        </view>
      </view>
	  
	  <view class="inpItem pwdInp  mt24" v-else-if="loginType == 2">
	    <input type="number" class="inpEl" :placeholder="t('login.reg_h2')" v-model="vertifyCode" maxlength="4">
	    <view class="eyesGroup">
	      <view class="otpText semiBold f14" @click="getCode"> {{timer?seconds:t('login.reg_h3')}}</view>
	    </view>
	  </view>
	  

      <view class="mt12 f14 text_500 text_right" @click="changePage('./forgetPwd')">
        {{t('login.fo_title')}}?
      </view>

      <view class="mt30 f14 pdtb4 center text_white btnContent text_bold" @click="LoginHandle">
        {{t('login.fo_pwd_login')}}
      </view>
		
		<view class="mt16 text_center f14" @click="loginType = 2" v-if="loginType == 1">
			{{t('add1.a_a6')}}
		</view>
		
		<view class="mt16 text_center f14" @click="loginType = 1" v-if="loginType == 2">
			{{t('add1.a_a7')}}
		</view>
	
      <AuthLogin></AuthLogin>

      <view class="fixedWord f14 color999 text_center  ">
        {{t('login.log_bot_b1')}} 
		<span class="regNow semiBold"
          @click="changePage('./register')">{{t('login.log_bot_b2')}}</span>
      </view>
    </view>
    <languagePop ref="languagePopRef" :updateLangName="updateLangName"></languagePop>
    <view style="height: 100px;"></view>

  </view>
</template>


<style lang="scss" scoped>
.fixedWord {
  margin-top: 150px;
}
.otpText {
  color: #8737e0;
}
.btnContent {
  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
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
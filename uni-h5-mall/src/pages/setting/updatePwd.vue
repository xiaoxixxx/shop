<script setup>
import request from '../../../comm/request.ts'
import { showToast } from 'vant';
import {
  useI18n
} from "vue-i18n";

const { t } = useI18n();

const goBack = () => {
  history.back()
}

const formData = ref({
  code: "",
  mobile: "",
  password: ""
})
const submitHandle = () => {
  uni.showLoading()
  request({
    url: '/app-api/member/user/update-password',
    data: formData.value,
    methods: 'PUT'
  }).then(res => {
    showToast('Update success')
    setTimeout(() => {
      history.back()
    }, 1000)
  }).finally(() => {
    uni.hideLoading()
  })
}

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
  if (timer.value) return
  uni.showLoading()
  request({
    url: '/app-api/member/auth/send-sms-code',
    data: {
      scene: 3
    },
    methods: 'POST'
  }).then(res => {
    startTimer()
    showToast(t('login.fo_otp_suc'))
  }).finally(() => {
    uni.hideLoading()
  })
}

const showPwd = ref(false)
</script>


<template>

  <view>
    <view class="pdlr10 pdtb10  between  topNav">
      <view class="left">
        <img src="../../static/icons/right.png" class="hh24 ww24" @click="goBack">
      </view>
      <view class="text_center center  f17  text_bold ">{{t('set.pwd_h1')}}</view>
      <view class="right ww24 hh24">
      </view>
    </view>

    <view class="mt20 pdlr12">
      <view class="f16 ">{{t('set.pwd_h2')}}</view>
      <view class="colorCCC f12  mt4">{{ t('set.pwd_h3') }}</view>

      <view class="mt60">
        <view class="between">
          <view class="flex col_center">
            <img src="@/static/icons/otp.png" class="ww24 hh24" />
            <view class="ml12 f14">
              {{t('login.reg_h2')}}
            </view>
          </view>

          <view class="colorContent f14" @click="getCode">
            {{timer?seconds:t('login.reg_h3')}}
          </view>
        </view>
        <view class="mt12 ml40 pb16 ">
          <input type="number" v-model="formData.code" :placeholder="t('login.otp_inp')" maxlength="4">
        </view>
        <view class="line"></view>

        <view class="between mt30">
          <view class="flex col_center">
            <img src="@/static/icons/pwd.png" class="ww24 hh24" />
            <view class="ml12 f14">
              {{t('login.log_pwd_inp')}}
            </view>
          </view>

        </view>
        <view class="mt12 ml40 pb16 pwdInp ">
          <input :type="!showPwd?'password':'text'" :placeholder="t('set.pwd_h4')" v-model="formData.password">
          <view class="eyesGroup">
            <img :src="showPwd?'../../static/icons/eye_open.png':'../../static/icons/eye_close.png'" class="ww24 hh24"
              @click="showPwd = !showPwd" />
          </view>

        </view>
        <view class="line"></view>
      </view>
    </view>

    <view class="fixedBtn">
      <view class="btnContent center text_white f14" @click="submitHandle">
        {{t('all.con')}}
      </view>
    </view>
  </view>
</template>



<style lang="scss" scoped>
	.btnContent{
		font-weight: normal;
	}
.pwdInp {
  position: relative;
  .eyesGroup {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.fixedBtn {
  position: fixed;
  width: calc(100% - 24px);
  bottom: 0;
  padding: 12px 12px;

  .btnContent {
    border-radius: 50px;
    background: linear-gradient(96deg, #9f58ef 0%, #8730e8 100%);
  }
}
:deep(.input-placeholder) {
  color: #ccc;
}
input {
  font-size: 14px;
}
.line {
  height: 1px;
  background: #efefef;
}
</style>
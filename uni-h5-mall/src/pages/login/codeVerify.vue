<script setup>

import {
  useI18n
} from "vue-i18n";
import topNavbar from '@/components/topNavbar/topNavbar.vue';
const {
  locale, t
} = useI18n();

import { loginFormPinia } from "../../store/login";
import { showToast } from "vant";
const loginFormPiniaDeatil = loginFormPinia()



const changePage = url => {
  uni.navigateTo({
    url
  })
}

const otpGroupVal = ref([
  "",
  "",
  "",
  ""
])
const nowInp = ref(0)
const nextStepClick = () => {
  let str = "" //otpval
  otpGroupVal.value.forEach(item => {
    str += item
  })
  if (str.length < 4) {
    showToast(t('login.otp_inp1'))
    return
  }
  loginFormPiniaDeatil.resetPwdForm.code = str
  changePage('./updatePwd')
}
const inputHandle = (e) => {
  // nowInp.value += 1
  console.log(e)
  if (e.detail.value) {
    otpGroupVal.value[nowInp.value] = e.detail.value
    if (nowInp.value < 3) {
      nowInp.value++
    }
  } else {
    otpGroupVal.value[nowInp.value] = ""
    if (nowInp.value > 0) {
      nowInp.value--;
    }
  }

}
</script>
<template>
  <view class="pt13">
    <topNavbar></topNavbar>
    <view class="pdlr20 pt23">
      <view class="mt40  f28 text_bold">
        {{t('login.ov')}}
      </view>
      <view class="mt20 colorCCC f14">
        {{t('login.cvi')}}
      </view>
      <view class="mt24">
        <view class="otpBox">
          <view class="otpItem center" v-for="(item,index) in otpGroupVal" :class="nowInp>=index?'hasBorderColor':''">
            <input type="number" :value="item" class="f17 text_bold" maxlength="1" style="width: 10px;"
              :focus="nowInp == index" @input="inputHandle" />
          </view>
        </view>
        <view class="mt30 f14 pdtb4 center text_white btnContent text_bold" @click="nextStepClick">
          {{t('login.next')}}
        </view>

      </view>

      <view style="height: 100px;"></view>
    </view>
  </view>
</template>


<style lang="scss" scoped>
.otpBox {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  .otpItem {
    width: 70px;
    height: 70px;
    background: #f4f5f5;
    border-radius: 12px 12px 12px 12px;
    border: 1px solid #fff;
  }
  .hasBorderColor {
    border-color: #8634e1;
  }
}
.btnContent {
  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
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
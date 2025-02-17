<script setup>
import {
  useI18n
} from "vue-i18n";

const {
  locale
} = useI18n();


const changePage = url => {
  uni.navigateTo({
    url
  })
}

</script>
<template>
  <view class="pdlr20 pt23">

    <view class="center flex_col">
      <img src="../../static/icons/updateSuccess.png" class="centerImg" />

      <view class="mt50 f28 text_bold">
        {{t('login.upd_h1')}}
      </view>
      <view class="mt20 colorCCC f14">
        {{t('login.upd_h2')}}
      </view>
    </view>

    <view class="mt30 f14 pdtb4 center text_white btnContent" @click="changePage('./login')">
      {{t('login.upd_h3')}}
    </view>

    <view style="height: 100px;"></view>
  </view>
</template>


<style lang="scss" scoped>
.btnContent {
  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
}

.centerImg {
  width: 200px;
  height: 200px;
  margin-top: 100px;
}
</style>
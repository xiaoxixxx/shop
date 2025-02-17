<script setup>
import {
  useI18n
} from "vue-i18n";
import request from '../../../comm/request.ts';
import { showToast } from 'vant';
const {
  locale,t
} = useI18n();

import {
  settingPlant
} from '@/store/setting.js';
const settingPlantDeatil = settingPlant();
const showBottom = ref(false)

const props = defineProps({
  updateFun: {
    type: Function
  },
  orderId: {
    type: Number
  }
})
const chooseTypeInd = ref(0)

const selectList = computed(() => {
  return [
    t('com.pop_j2'),
    t('com.pop_j3'),
    t('com.pop_j4'),
    t('com.pop_j5'),
    t('com.pop_j6'),

  ]
})

const confirmHandle = () => {
  uni.showLoading()
  request({
    url: "/app-api/trade/order/cancel?id=" + props.orderId,
    methods: "DELETE"
  }).then(res => {
    showBottom.value = false
    uni.hideLoading()
    showToast(t('com.pop_j1'))
    props.updateFun()
  })
}


defineExpose({
  showBottom
})
</script>


<template>
  <view>
    <van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round>

      <view class="pt20 pdlr20 pb20">
        <view class="between">
          <view class="ww24"></view>
          <view class=" f16 text_bold">{{t('com.pop_h1')}}</view>
          <view>
            <img src="../../static/icons/pop_close.png" class="ww24 hh24" @click="showBottom = false">
          </view>
        </view>

        <view class="mt30 f15 text_bold">
          <view class="selectItem between" v-for="(item,index) in selectList" @click="chooseTypeInd = index">
            <view>{{ item }}</view>
            <view>
              <img src="../../static/icons/choosed_cho.png" class="ww18 hh18" v-if="chooseTypeInd == index">
              <img src="../../static/icons/null_cho.png" class="ww18 hh18" v-else>
            </view>
          </view>
        </view>

        <view class="mt43">
          <view class="btnContent  f14 center text_white" @click="confirmHandle">
            {{t('all.con')}}
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>


<style lang="scss" scoped>
.selectItem:not(:last-child) {
  margin-bottom: 30px;
}
.btnContent{
	font-weight: normal;
}
</style>
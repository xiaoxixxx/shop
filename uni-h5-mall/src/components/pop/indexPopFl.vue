<script setup>

import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
const showBottom = ref(false)
const props = defineProps({
  closeSelectPop: {
    type: Function
  }
})
const chooseTypeInd = ref(0)
const selectList = computed(() => {
  return [
    t('tab.ind_j1'),
    t('tab.ind_j2'),
    t('tab.ind_j3'),

  ]
})
const confirmSelectHandle = () => {
  showBottom.value = false
  props.closeSelectPop(chooseTypeInd.value, selectList.value[chooseTypeInd.value])
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
          <view class=" f16 text_bold">{{t('com.pop_h4')}}</view>
          <view>
            <img src="../../static/icons/pop_close.png" class="ww24 hh24" @click="showBottom = false">
          </view>
        </view>

        <view class="mt30 f15 ">
          <view class="selectItem between" v-for="(item,index) in selectList" @click="chooseTypeInd = index">
            <view class="">{{ item }}</view>
            <view>
              <img src="../../static/icons/choosed_cho.png" class="ww18 hh18" v-if="chooseTypeInd == index">
              <img src="../../static/icons/null_cho.png" class="ww18 hh18" v-else>
            </view>
          </view>
        </view>

        <view class="mt43">
          <view class="btnContent  f14 center text_white" @click="confirmSelectHandle">
            {{t('all.con')}}
          </view>
        </view>
      </view>
    </van-popup>
  </view>
</template>


<style lang="scss" scoped>
.btnContent {
  border-radius: 50px;
  font-weight: normal;
}
.selectItem:not(:last-child) {
  margin-bottom: 30px;
}
</style>
<script setup>
import {
  useI18n
} from "vue-i18n";

const {
  locale, t
} = useI18n();

import {
  settingPlant
} from '@/store/setting.js';
const settingPlantDeatil = settingPlant();
const showBottom = ref(false)

const props = defineProps({
  updateLangName: {
    type: Function
  }
})
const chooseTypeInd = ref(0)

const selectList = settingPlantDeatil.languageList

function findObjectIndex(array, key, value) {
  return array.findIndex(obj => obj[key] === value);
}

chooseTypeInd.value = findObjectIndex(selectList, "value", uni.getStorageSync('language'))

const confirmSelectHandle = () => {
  showBottom.value = false
  const lang = selectList[chooseTypeInd.value].value
  if (locale.value == lang) return
  locale.value = lang
  uni.setStorageSync('language', lang)
  props.updateLangName(selectList[chooseTypeInd.value].name)
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
          <view class=" f16 text_bold"> {{t('com.pop_h5')}}</view>
          <view>
            <img src="../../static/icons/pop_close.png" class="ww24 hh24" @click="showBottom = false">
          </view>
        </view>

        <view class="mt30 f15 text_bold">
          <view class="selectItem between" v-for="(item,index) in selectList" @click="chooseTypeInd = index">
            <view>{{ item.name }}</view>
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
.selectItem:not(:last-child) {
  margin-bottom: 30px;
}
.btnContent{
	font-weight: normal;
}
</style>
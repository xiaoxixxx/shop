<script setup>
import { showToast } from 'vant';
import request from '../../../comm/request.ts'
import { uploadFile } from '../../../comm/useGoods.js'
import {
  useI18n
} from "vue-i18n";

const {
  locale, t
} = useI18n();

import {
  settingPlant
} from '@/store/setting.js';

import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()

const showBottom = ref(false)

const props = defineProps({

})

const selectList = ref([{
  name: t("com.set_j1")
},
{
  name: t("com.set_j2")
},
])

const openFileSelect = type => {
  uni.chooseImage({
    sourceType: type == 0 ? ['album'] : ['camera'],
    count: 1,
    success: async (e) => {
      const res = await uploadFile(e.tempFilePaths[0])
      uni.showLoading()
      request({
        url: '/app-api/member/user/update',
        data: {
          avatar: res.data
        },
        methods: "PUT"
      }).then(res => {
        showToast(t('my.add_j1'))
        userStoreInfo.updateUserInfo()
        showBottom.value = false
      }).finally(() => {
        uni.hideLoading()
      })
    }
  })
}


defineExpose({
  showBottom
})
</script>


<template>
  <view>
    <van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round>
      <view class="pt30 pdlr20 pb20">
        <view class=" f15 ">
          <view class="selectItem  center" v-for="(item,index) in selectList" @click="openFileSelect(index)">
            <view>{{ item.name }}</view>
          </view>
        </view>
      </view>
      <view class="mainf8Bg hh8"></view>
      <view class="pdtb16  f14 center " @click="showBottom = false">
        {{t('all.can')}}
      </view>
    </van-popup>
  </view>
</template>


<style lang="scss" scoped>
.selectItem:not(:last-child) {
  margin-bottom: 30px;
}
</style>
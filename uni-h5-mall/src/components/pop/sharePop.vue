<script setup>
import useClipboard from 'vue-clipboard3';
import {
  showToast
} from 'vant';
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
const {
  toClipboard
} = useClipboard();
const showBottom = ref(false)
const props = defineProps({
  closeSelectPop: {
    type: Function
  },
  proDeatil: {
    type: Object
  }
})
const chooseTypeInd = ref(0)

const confirmSelectHandle = () => {
  showBottom.value = false
  props.closeSelectPop(chooseTypeInd.value)
}
defineExpose({
  showBottom
})
const shareTypeList = ref([{
  name: 'Facebook',
  img: '../../static/share/s1.png',
  value: 1
},
{
  name: 'X',
  img: '../../static/share/s2.png',
  value: 2
},
{
  name: 'Whats',
  img: '../../static/share/s3.png',
  value: 3
},
{
  name: 'Ins',
  img: '../../static/share/s4.png',
  value: 4
},
{
  name: 'Copy link',
  img: '../../static/share/s5.png',
  value: 5
},
])

const clickTypeHandle = async ind => {
  switch (ind) {
    case 0:
      // window.location.href  https://developers.facebook.com/docs/plugins/
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href};src=sdkpreparse`)
      break;
    case 1:
      window.open(
        `https://x.com/intent/post?text=${props.proDeatil.name}&url=${window.location.href}&lang=${uni.getStorageSync('language')}`
      )
      break;
    case 2:
      window.open(
        `https://wa.me/?text=${window.location.href}`
      )
      break;
    case 3:
      window.open(`https://www.instagram.com/?${window.location.href}`)
      break;
    case 4:

      try {
        await toClipboard(window.location.href);
        showToast(t('pay.ord_j1'));
      } catch (e) {
        console.log(e)
        //TODO handle the exception
      }
      break;
  }
  showBottom.value = false
}
</script>


<template>
  <view>
    <van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round
      style="width:90%;margin-left:5%;margin-bottom: 5%;border-radius: 16px;">

      <view class="pt20 pdlr20 ">
        <view class=" f16 text_bold">{{t('com.pop_h6')}}:</view>

        <view class="mt12 f12 color7C  shareContent">
          <view class="selectItem text_center" v-for="(item,index) in shareTypeList" @click="clickTypeHandle(index)">
            <view>
              <img :src="item.img" class="ww44 hh44 bbo50" />
            </view>
            <view class="mt4">{{ item.name }}</view>
          </view>
        </view>

        <view class="mt13 pb19 text_center f14 " @click="showBottom = false">
          {{t('all.can')}}
        </view>
      </view>
    </van-popup>
  </view>
</template>


<style lang="scss" scoped>
.shareContent {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding-bottom: 13px;
  border-bottom: 1px solid #f8f8f8;
}

.btnContent {
  border-radius: 50px;
}

.selectItem:not(:last-child) {
  margin-right: 10px;
}
</style>
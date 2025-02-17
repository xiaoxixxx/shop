<script setup>
import { uploadFile } from '../../../comm/useGoods.js'
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import request from '../../../comm/request.ts'
import { showToast } from 'vant';
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const { t } = useI18n();
const cartStoreDeatil = cartStore();


const photoList = ref([])

const formData = ref({
  content: "",
  picUrls: [],
  contact: ""
})
const btnDis = computed(() => {
  return photoList.value.length == 0 || !formData.value.contact || !formData.value.content
})
const submitHandle = async () => {

  if (btnDis.value) return
  formData.value.picUrls = []
  if (photoList.value.length > 0) {
    for (let i in photoList.value) {
      const res = await uploadFile(photoList.value[i].content)
      formData.value.picUrls.push(res.data)
    }
  }
  uni.showLoading()
  request({
    url: '/app-api/system/feedback/add',
    methods: "POST",
    data: formData.value
  }).then(res => {
    showToast(t('my.fed_j1'))
    setTimeout(() => {
      uni.reLaunch({
        url: '/'
      })
    }, 1000)
  }).finally(() => {
    uni.hideLoading()
  })
}


</script>


<template>

  <view>
    <topNavbar :title="t('my.fed_t1')">

    </topNavbar>

    <view class="mt23 pdlr12">
      <view class="f16 text_bold mr12"> <span style="color: #FF4A4D;">*</span> {{t('my.fed_h1')}}
      </view>
      <view class="mt12 flex borderB ">
        <img src="@/static/my/update_g.png" class="ww18 hh18">
        <textarea class="flex1 ml9 textareaContent" name="" id="" cols="30" rows="6" :placeholder="t('my.fed_h2')"
          v-model="formData.content"></textarea>
      </view>
      <view class="f16 text_bold  mt20">
        {{t('my.fed_h3')}}
      </view>

      <view class="mt11  ">
        <van-uploader v-model="photoList" reupload max-count="9" accept=".jpg,.jpeg,.png"
          upload-icon="../../static/pay/photoIcon.png" upload-text="Picture" :multiple="true" />
      </view>

    </view>
    <view class=" mt16  pl12 hh36 f12   colorAf  flex col_center bgF8f8">
      <span style="color: #FF4A4D;">*</span>{{t('my.fed_h4')}}
    </view>
    <view class="pl10 pt16 pr13">
      <view class="between ">
        <view class="f16 text_bold ">{{ t('my.fed_h5') }}</view>
      </view>
      <view class="mt16 borderB pb20 f14">
        <input type="text" :placeholder="t('my.fed_h6')" v-model="formData.contact">
      </view>
    </view>
    <view style="height: 100px;"></view>
    <view class="fixedBtn">
      <view class="btnContent center text_white" @click="submitHandle" :style="btnDis?{background:'#ccc'}:{}">
        Submit
      </view>
    </view>
  </view>
</template>



<style lang="scss" scoped>
.fixedBtn {
  position: fixed;
  width: calc(100% - 24px);
  bottom: 0;
  padding: 12px 12px;

  .btnContent {
    border-radius: 50px;
  }
}
.rateName {
  width: 100px;
}

:deep(.van-uploader) {
  display: block;
}
:deep(.van-uploader__wrapper) {
  // width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
:deep(.van-uploader__preview) {
  // width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  width: 100% !important;
  height: 110px !important;
  margin: 0;
  .van-uploader__preview-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
}
:deep(.van-uploader__upload) {
  width: 100% !important;
  height: 110px !important;
  border-radius: 16px;
}

::deep(.van-uploader__upload-text) {
  margin-top: 1px;
  font-size: 10px;
  color: #7c7c7c;
}

:deep(textarea ::placeholder) {
  color: #ccc;
}
:deep(.input-placeholder) {
  color: #ccc;
}
.borderB {
  border-bottom: 1px solid rgba(239, 239, 239, 0.5);
}
</style>
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



const anonymous = ref(true)

const rate1 = ref(5)
const rate2 = ref(5)
const rate3 = ref(5)
const reviewsForm = ref({
  orderItemId: window.location.search.split("id=")[1], //交易订单项编号不能为空
  descriptionScores: 5, //描述星级 1-5 分不能为空
  benefitScores: 5, //服务星级 1-5 分不能为空
  content: "", //评论内容不能为空
  anonymous: true, //是否匿名不能为空
  appearance: 5,
  logistics: 5,
  // descriptionScores:5, //描述星级 1-5 分不能为空
})
const submitHandle = async () => {

	
  if (reviewsForm.value.content.trim().length < 1) {
    showToast(t('my.rev_j1'))
    return
  }
  let picUrls = []
  let videoUrls = []
  if (videoList.value.length > 0) {
    for (let i in videoList.value) {
      const res = await uploadFile(videoList.value[i].tempFilePath,videoList.value[i].name)
      videoUrls.push(res.data)
    }
  }
  if (photoList.value.length > 0) {
    for (let i in photoList.value) {
      const res = await uploadFile(photoList.value[i].path,photoList.value[i].name)
      picUrls.push(res.data)
    }
  }
  let data = {
    videoUrls,
    picUrls,
    ...reviewsForm.value
  }
  
  request({
    url: '/app-api/trade/order/item/create-comment',
    methods: "POST",
    data
  }).then(res => {
    showToast(t('my.rev_j2'))
    uni.reLaunch({
      url: './orderList'
    })
  })
}
const photoList = ref([])
const videoList = ref([])
const chooseImg = () => {
  uni.chooseImage({
    count: 6,
    success: (e) => {
		
      photoList.value.push(...e.tempFiles)
    }
  })
}

const chooseVideo = () => {
  uni.chooseVideo({
    count: 1,
    success: (e) => {
		// console.log(e)
      videoList.value.push(e)
    }
  })
}
const deleteItem = (arr, ind) => {
  arr.splice(ind, 1)
}
</script>

<!-- anonymous 是否匿名不能为空
orderItemId 交易订单项编号不能为空
descriptionScores 描述星级 1-5 分不能为空
benefitScores 服务星级 1-5 分不能为空
content 评论内容不能为空 -->
<template>

  <view>
    <topNavbar :title="t('my.rev_t1')">
      <slot>
        <view class="subBtn f14 text_bold" @click="submitHandle">{{t('all.submit')}}</view>
      </slot>
    </topNavbar>

    <view class="mt23 pdlr12">
      <view class="flex col_center pb16 borderB">
        <view class="f16 text_bold mr12">{{t('my.rev_h1')}}</view>
        <view class="">
          <van-rate v-model="reviewsForm.descriptionScores" :size="14" gutter="3" color="#FFC058" void-icon="star"
            void-color="#eee" />
        </view>
        <view class="ml14 f11 colorAf">{{t('my.rev_h2')}}</view>
      </view>

      <view class="mt16 flex ">
        <img src="@/static/my/update_g.png" class="ww18 hh18">
        <textarea class="flex1 ml9 textareaContent" name="" id="" cols="30" rows="6" :placeholder="t('my.rev_h3')"
          v-model="reviewsForm.content"></textarea>
      </view>
      <!-- <view class="f11 color7C">
        Leave a comment to get <span class="subBtn">50</span> points.
      </view> -->

      <view class="mt10  uploadBox">
        <view class="previewItem " v-for="(item,index) in photoList" :key="index">
          <img :src="item.path" class="bbo10" style="width: 100%;height: 100%;" />
          <view class="delItem" @click="deleteItem(photoList,index)">x</view>
        </view>
        <view class="previewItem" v-for="(item,index) in videoList" :key="index">
          <video :src="item.tempFilePath" class="bbo10" style="width: 100%;height: 100%;"></video>
          <view class="delItem" @click="deleteItem(videoList,index)">x</view>
        </view>
        <view class="previewItem" @click="chooseImg" v-if="photoList.length < 6">
          <img src="../../static/pay/photoIcon.png" class="ww32 hh32" />
          <view class="text">{{t('my.rev_h4')}}</view>
        </view>
        <view class="previewItem" @click="chooseVideo" v-if="videoList.length < 3">
          <img src="../../static/pay/videoIcon.png" class="ww32 hh32" />
          <view class="text">{{t('my.rev_h5')}}</view>
        </view>
      </view>

      <view class="mt15 flex col_center">
        <img :src="reviewsForm.anonymous?'../../static/icons/choosed_cho.png':'../../static/icons/null_cho.png'"
          class="ww14 hh14" @click="reviewsForm.anonymous = !reviewsForm.anonymous">
        <view class="ml8 f14 color7C">
          {{t('my.rev_h6')}}
        </view>
      </view>

    </view>
    <view class="bgF8f8 mt16 hh8"></view>
    <view class="pl10 pt16 pr13">
      <view class="between ">
        <view class="f16 text_bold ">{{t('my.rev_h7')}}</view>
        <view class="f11 colorAf">{{ t('my.rev_h8') }}</view>
      </view>
      <view class="flex col_center rateItem mt21">
        <view class="f14 rateName">{{t('my.rev_h9')}}</view>
        <van-rate v-model="reviewsForm.appearance" :size="14" gutter="3" color="#FFC058" void-icon="star"
          void-color="#eee" />
      </view>
      <view class="flex col_center rateItem mt21">
        <view class="f14 rateName">{{t('my.rev_h10')}}</view>

        <van-rate v-model="reviewsForm.logistics" :size="14" gutter="3" color="#FFC058" void-icon="star"
          void-color="#eee" />
      </view>
      <view class="flex col_center rateItem mt21">
        <view class="f14 rateName">{{t('my.rev_h11')}}</view>
        <van-rate v-model="reviewsForm.benefitScores" :size="14" gutter="3" color="#FFC058" void-icon="star"
          void-color="#eee" />
      </view>
    </view>
  </view>
</template>



<style lang="scss" scoped>
.rateName {
  width: 100px;
}
.uploadBox {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  .previewItem {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #f8f8f8;
    border-radius: 10px;
    width: 100% !important;
    height: 110px !important;
    position: relative;
    overflow: hidden;
    .delItem {
      position: absolute;
      top: 0;
      right: 0;
      width: 18px;
      height: 18px;
      background: #4e4e4e;
      color: #fff;
      text-align: center;
      line-height: 18px;
      border-radius: 0 10px 0 10px;
      z-index: 99;
      font-size: 13px;
    }
    .text {
      margin-top: 1px;
      font-size: 10px;
      color: #7c7c7c;
    }
  }
  // :deep(.van-uploader__wrapper){
  // 	display: flex;
  // 	gap: 10px;
  // 	.van-uploader__upload,.van-uploader__preview{
  // 		margin: 0;
  // 		border-radius: 16px;
  // 		width:120px  !important;
  // 		height: 120px !important;
  // 		margin-bottom: 10px;
  // 	}
  // 	.van-uploader__preview{
  // 		display: flex;
  // 		align-items: center;
  // 		justify-content: center;
  // 		background: #f8f8f8;
  // 	}

  // }

  // ::deep(.van-uploader__upload-text) {
  //   margin-top: 1px;
  //   font-size: 10px;
  //   color: #7c7c7c;
  // }
}

.subBtn {
  background-image: -webkit-linear-gradient(right, #9f58ef 0%, #8730e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  //   background: linear-gradient(5.8782189891440915deg, #9f58ef 0%, #8730e8 100%);
}

:deep(textarea ::placeholder) {
  color: #ccc;
}
.borderB {
  border-bottom: 1px solid rgba(239, 239, 239, 0.5);
}
</style>
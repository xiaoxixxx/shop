<script setup>
import request from '../../../comm/request';
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import { showImagePreview } from 'vant';
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
const dataList = ref([

])
const pages = ref({
  spuId: window.location.search.split('id=')[1],
  pageNo: 1,
  pageSize: 10,
  type: 0
})

const paging = ref("")
const totalReview = ref(0)
const queryList = (page) => {
  // paging.value.complete(dataList.value)
  pages.value.pageNo = page
  request({
    url: '/app-api/product/comment/page',
    data: pages.value
  }).then(res => {
    paging.value.complete(res.list)
    totalReview.value = res.total
    pages.value.pageNo++;
  })
}

const showImgs = (imgs, ind) => {
  console.log(imgs)
  showImagePreview({
    images: imgs,
    startPosition: ind,
  });
}
</script>
<template>
  <view>

    <topNavbar :title="'Item reviews'"></topNavbar>
    <view class="pdlr10">
      <view class="mt10 f15 text_bold">
        {{totalReview}} {{t('goods.rev_c1')}}</view>

      <z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
        :refresher-enabled="false">
        <view class="commentItem mt20" v-for="(item,index) in dataList" :key="index">

          <view class="between">
            <view class="flex col_center">
              <img :src="item.userAvatar" class="ww24 hh24" />
              <view class="ml12 f14 text_bold">{{item.userNickname}}</view>
            </view>
            <view class="f12 colorDel">
              {{item.time}}
            </view>
          </view>

          <view class="mt8  ">

            <van-rate v-model="item.benefitScores" :size="14" gutter="3" color="#FFC058" void-icon="star"
              void-color="#eee" readonly />
          </view>
          <view class="mt13 f12 color5E">
            {{item.content}}
          </view>

          <view class="commentPic mt10">
			  <view v-for="(pic,ind) in item.picUrls">
				  <img :src="pic"  @click="showImgs(item.picUrls,ind)" />
			  </view>
			  
			  <view v-for="(vid,ind) in item.videoUrls">
			  				  <video :src="vid"    />
			  </view>
			  
          </view>
        </view>
      </z-paging>

      <van-back-top :bottom="80" />

    </view>
  </view>
</template>


<style lang="scss" scoped>
.commentPic {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  img {
    width: 100%;
    border-radius: 5px;
  }
  video{
	  width: 100%;
	  height: 130px;
	  border-radius: 5px;
  }
}
.commentItem {
  padding-bottom: 20px;
  border-bottom: 1px solid #efefef;
}

.topFixedBg {
  background: #f8f8f8f8;
}
</style>
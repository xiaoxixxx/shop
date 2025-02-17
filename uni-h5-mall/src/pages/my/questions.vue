<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import { showToast } from 'vant';
import request from '../../../comm/request.ts'
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const { t } = useI18n();
const cartStoreDeatil = cartStore();
const questionsList = ref([


])

const activeNames = ref(['0'])
const getList = () => {
  request({
    url: '/app-api/system/question/list'
  }).then(res => {
    questionsList.value = res
  })
}
getList()
</script>


<template>

  <view>
    <topNavbar :title="t('my.que_t1')"></topNavbar>

    <view class="hh8 mainf8Bg mt10"></view>
    <view class="mt16 pdlr12">

      <van-collapse v-model="activeNames">
        <van-collapse-item :name="item.id" v-for="(item,index) in questionsList">
          <template #title>
            <view class="flex col_center">
              <view class="center q_titleBg">
                Q{{index+1}}</view>
              <view class="ml8 f14 text_bold">{{item.question}}</view>
            </view>
          </template>

          <view class="pdlr28 f12">
            {{item.answer}}
          </view>
        </van-collapse-item>
      </van-collapse>
    </view>
  </view>
</template>



<style lang="scss" scoped>
.q_titleBg {
  background: url("../../static/my/q_bg.png") no-repeat 100%/100%;
  width: 24px;
  height: 24px;
  color: #fff;
  font-size: 10px;
}

:deep(.van-collapse-item--border){
	&::after{
		border-top: none !important;
	}
}
:deep(.van-hairline--top-bottom){
	&::after{
		border-width: 0;
	}
}

:deep(.van-collapse-item__title--expanded){
	&:after{
		border-width: 0;
	}
}
:deep(.van-collapse-item){
	border-bottom: 1px solid #EFEFEF;
}
</style>
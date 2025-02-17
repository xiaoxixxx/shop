<script setup>
import {
  useI18n
} from "vue-i18n";
import request from "../../../comm/request";
const {
  locale, t
} = useI18n();
const searchGoodsVal = ref("")
const goBack = () => {
  history.back()
}

const imageGoodsNameList = ref([

])

const searchHandle = (data) => {
	localStorage.setItem('searchVal',data)
  uni.navigateTo({
    url: './searchResult' 
  })
}

const inputHandle = e=>{
	request({
		url:'/app-api/product/category/associate',
		data:{
			name:e.detail.value
		}
	}).then(res=>{
		imageGoodsNameList.value = res
		// console.log(res)
	})
}

</script>

<template>
  <view class="pl10 pr24 mt20">
    <view class="flex  col_center">
      <img src="../../static/icons/right.png" class="ww32 hh32" @click="goBack" />
      <view class="inputEl ml8 col_center flex ">
        <input type="text" class="inpContent" :placeholder="t('goods.sea_h1')" focus v-model="searchGoodsVal" @input="inputHandle"
          @confirm="searchHandle(searchGoodsVal)" />

        <img src="../../static/icons/clearInp.png" class="ww24 hh24" @click="searchGoodsVal = ''" />

        <view class="searchGoods ml6 center" @click="searchHandle(searchGoodsVal)">
          <img src="../../static/icons/searchInp.png" class="ww24 hh24" />
        </view>
      </view>
    </view>
    <view v-if="searchGoodsVal" class="pdlr20">
      <view v-for="(item,index) in imageGoodsNameList " class="imgItemList text_bold" @click="searchHandle(item.name)">
        <view>
			<span class="wordContent ">{{item.name}}</span>
		<!-- <span>{{item.split(searchGoodsVal)[1]}}</span> -->
		</view>
      </view>
    </view>
  </view>
</template>


<style lang="scss" scoped>
.inputEl {
  padding: 0 5px 0 16px;
  border-radius: 24px;
  height: 44px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  flex: 1;
}
.imgItemList {
  padding: 15px 0;
  border-bottom: 1px solid #efefef;
}
.searchGoods {
  width: 52px;
  height: 36px;
  background: #000000;
  border-radius: 24px 24px 24px 24px;
}
.inpContent {
  flex: 1;
}
.wordContent {
  color: #8d45dd;
}
</style>

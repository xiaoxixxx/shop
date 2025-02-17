<script setup>
import goodsList from '../../components/goodsList/goodsList.vue';
import filterPop from '../../components/pop/filterPop.vue';
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();

const isTopFixed = ref(false)
// 吸顶判断
const topChangeHandle = (e) => {
  isTopFixed.value = e
}

const searchGoodsVal = ref("")
const goBack = () => {
  history.back()
}

const goodsListRef = ref("")
const searchHandle = () => {

  // goodsListRef.value.reloadSearchData({
  // 	keyword:searchGoodsVal.value
  // })
localStorage.setItem('searchVal',searchGoodsVal.value)
  uni.reLaunch({
    url: './searchResult'
  })
}

const filterType = ref([
  t('goods.fil_f1'),
  t('goods.fil_f2'),
  t('goods.fil_f3'),
])

const chooseTypeInd = ref(0) //选择的分类
const saleType = ref(0) //销售的排序 true 升序 false 降序

const changeFilterType = index => {
  chooseTypeInd.value = index
  let tempObj = {

  }

  if (index == 0) {
	  saleType.value = 0
    // 推荐
  } else if (index == 1) {
	  saleType.value = 0
    // 新品
    tempObj = {
      sortAsc: false
    }
  } else if (index == 2) {
	  tempObj.sortField = 'salesCount'
    // saleType.value = !saleType.value
	if(saleType.value ==  0  || saleType.value ==  1){
		tempObj.sortAsc = true
		saleType.value = 2
	}else if(saleType.value ==  2){
		tempObj.sortAsc = false
		saleType.value = 1
	}
    // 销量
  }
  goodsListRef.value.reloadSearchData(tempObj)
}
// const searchPage = ref({
//   url: '/app-api/product/spu/page',
//   data: {
//     keyword: localStorage.getItem('searchVal')
//   },
//   methods: 'GET'
// })

const searchPage = ref({
  url: '/app-api/product/spu/getSpuByName',
  data: {
    name: localStorage.getItem('searchVal')
  },
  methods: 'GET'
})

searchGoodsVal.value = localStorage.getItem('searchVal')


const clearSearchHandle = () => {
  searchGoodsVal.value = ''
  localStorage.setItem('searchVal','')
  searchHandle()
}

const filterPopRef = ref("")
const confirmHandle = (data) => {
  console.log(data);
}

const showTopFlag = ref(false)
const showTopHandle = val=>{
	showTopFlag.value = val
}
</script>

<template>
  <view class=" bgfff">

    <van-sticky :offset-top="0" @change="topChangeHandle">
      <view class="pdlr10 pdtb10 flex  col_center" :class="isTopFixed?'topFixedBg ':''">
        <img src="../../static/icons/right.png" class="ww32 hh32" @click="goBack" />
        <view class="inputEl ml8 col_center flex ">
          <img src="../../static/index/search.png" class="ww24 hh24" @click="searchHandle" />
          <input type="text" class="inpContent ml16" placeholder="Search Products" v-model="searchGoodsVal"
            @confirm="searchHandle" />
          <img src="../../static/icons/clearInp.png" class="ww24 hh24" @click="clearSearchHandle" />
        </view>
      </view>
    </van-sticky>

    <view class="pdlr10 mt22 " v-show="showTopFlag">
      <view class="between typeList f15" >
        <view class=" center" v-for="(item,index) in filterType" :class="index == chooseTypeInd?'actItem':'colorDel'"
          @click="changeFilterType(index)">
          {{ item }}
          <view class="center flex_col ml5 " v-if="index == 2 ">
            <img :src="saleType !== 1 ?'../../static/icons/s_up-d.png':'../../static/icons/s_up.png'" class="ww10 hh10" />		
            <img :src="saleType !== 2 ?'../../static/icons/s_down-d.png':'../../static/icons/s_down.png'" class="ww10 hh10" />
          </view>
        </view>
		<view style="width: 30%;"></view>
     <!--  <view class=" borderL pl16" @click="filterPopRef.showFilterPop = true">{{t('goods.fil_h1')}}
          <img src="../../static/index/fl.png" class="ml6 ww14 hh14" alt="">
        </view> -->
      </view>
    </view>

    <view class="mt20">
      <goodsList :searchPage="searchPage" :isSearch="true" ref="goodsListRef" :showTopHandle="showTopHandle"></goodsList>
    </view>

    <filterPop ref="filterPopRef" :confirmHandle="confirmHandle"></filterPop>
    <van-back-top :bottom="80" />

  </view>
</template>


<style lang="scss" scoped>
.triangle-up {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 8px solid #007bff;
}

.triangle-down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 8px solid #007bff;
  /* Change the color as needed */
}

.actItem {
  color: #090909;
}

.topFixedBg {
  background: #f8f8f8f8;
}

.typeList {
  font-weight: 500;
}

.borderL {
  border-left: 2px solid #efefef;
}

.inputEl {
  padding: 0 16px;
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
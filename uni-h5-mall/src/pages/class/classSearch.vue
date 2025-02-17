<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import goodsList from '@/components/goodsList/goodsList.vue'
import filterPop from '../../components/pop/filterPop.vue';

import { showToast } from 'vant';
import indexPopFl from '@/components/pop/indexPopFl.vue';
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const { t } = useI18n();
const cartStoreDeatil = cartStore();

const tagsList = computed(() => {
  return cartStoreDeatil.$state.chooseTag
})


// 这是传递给商品组件的参数
const searchPage = ref({
  url: '/app-api/product/spu/page',
  data: {
    categoryId: tagsList.value[tagsList.value.length - 1].id
  },
  methods: 'GET'
})





const goodsListRef = ref("")
const closeSelectPop = (ind, val) => {
  // sortField\
  let data = {
    pageNo: 1,
    pageSize: 10
  }
  if (ind == 1) {
    data.sortField = "salesCount"
    data.sortAsc = false
  } else if (ind == 2) {
    data.sortAsc = false
  }
  goodsListRef.value.reloadSearchData(data)
}

const indexPopFlRef = ref("")
const showBotHandle = () => {
  indexPopFlRef.value.showBottom = true
}

const filterPopRef = ref("")
const confirmHandle = (data) => {
  console.log(data);
}
</script>


<template>

  <view>
    <topNavbar :title="tagsList[tagsList.length - 1].name">
      <slot>
        <img src="@/static/icons/filter.png" class="ww24 hh24" @click="showBotHandle">
        <!-- @click="showFilterPop = true" -->
        <!-- <img src="@/static/icons/menu.png" class="ww24 hh24 ml8" @click="filterPopRef.showFilterPop = true"> -->
      </slot>
    </topNavbar>
	<view class="pdlr12  topRight">
		<view class=" tagsListEl ">
		  <view class="tagsItem" v-for="(item,index) in tagsList">{{ item.name }}</view>
		</view>
	</view>
  
    <view class="pdlr12 bgF8f8 pt12">
      <goodsList :searchPage="searchPage" :isSearch="true" ref="goodsListRef"></goodsList>
    </view>

    <filterPop ref="filterPopRef" :confirmHandle="confirmHandle"></filterPop>

    <indexPopFl ref="indexPopFlRef" :closeSelectPop="closeSelectPop"></indexPopFl>
  </view>
</template>



<style lang="scss" scoped>
.popRightBox {
  .botBtnBox {
    position: absolute;
    bottom: 20px;
    display: flex;
    align-items: center;
    width: calc(100% - 24px);
    .btnContent {
      flex: 1;
      margin-left: 30px;
      line-height: 100%;
      border-radius: 50px;
    }
  }
  .custom-button {
    width: 8px;
    height: 8px;
    background: linear-gradient(91deg, #8a3ddf 0%, #7f2add 100%);
    border-radius: 0px 0px 0px 0px;
    border-radius: 50%;
  }
  .feadBox {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .feadItemEl {
      padding: 8px 0;
      background: rgba(248, 248, 248, 1);
      color: #333;
      border-radius: 40px;
      font-size: 12px;
      width: 30%;
      text-align: center;
    }
    .actItemEl {
      background: linear-gradient(91deg, #8a3ddf 0%, #7f2add 100%);
      color: #fff;
    }
  }
}
.topRight{
	position: relative;
	::after{
		  position: absolute;
		  display: block;
		  content: '';
		  top: 0;
		  right: 0;
		  height: 100%;
		  width: 30px;
			background: linear-gradient( 90deg, rgba(217,217,217,0) 0%, #FFFFFF 100%);
	}
}
.tagsListEl {
  display: flex;
  overflow: scroll;
  gap: 8px;
  width: 100%;
  padding-bottom: 10px;

  ::-webkit-scrollbar{
	  display: none;
  }
  .tagsItem {
	  flex-shrink: 0;
    text-align: center;
    padding: 8px 13px;
    background: #f0f0f2;
    border-radius: 4px 4px 4px 4px;
	font-size: 12px;
  }
}
</style>
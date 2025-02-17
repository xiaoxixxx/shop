<script setup>
import request from '../../../comm/request';
import { goLoginDialog } from '../../../comm/goLogin.js';
import {
  cartStore
} from '@/store/cart';
import { throttle } from '../../../comm/utils.js'
import { showToast } from 'vant';
import { convertProductPropertyList,fen2yuan } from '../../../comm/useGoods.js'
import { watch } from 'vue';

import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();

	const cartStoreDeatil = cartStore();
const showBottom = ref(false) //是否显示弹窗
const props = defineProps({
  closeSelectPop: {
    type: Function
  },
 
  updateChooseItem: {
    type: Function
  },
 
})
const chooseTypeInd = ref(0)
const goodsProperty = ref({})
const confirmSelectHandle = () => {
  showBottom.value = false
  props.closeSelectPop(chooseTypeInd.value)
}


const buyNum = ref(1)


const propertyList = ref([])

const getPropertyListHandle = (item,skus)=>{
	goodsProperty.value = item
	  if (item && item.otherSkus) {
		countVal.value = item.count
		propertyList.value = convertProductPropertyList(item.otherSkus)
	    propertyList.value.forEach(item => {
	      choosedList.value.push({
	        parentId: item.id,
	        valueId: item.values[0].id
	      })
	    })

		item.sku.properties.forEach(item=>{
			propertyList.value.forEach(ite=>{
					ite.values.forEach(it=>{
						if(it.id == item.valueId ){
							onSelectSku(item.propertyId,item.valueId)
						}
					})
			})
		})
		
	  }
}
// watch(goodsProperty, val => {
//   if (goodsProperty.value && goodsProperty.value.otherSkus) {
// 	countVal.value = goodsProperty.value.count
// 	propertyList.value = convertProductPropertyList(goodsProperty.value.otherSkus)
//     propertyList.value.forEach(item => {
//       choosedList.value.push({
//         parentId: item.id,
//         valueId: item.values[0].id
//       })
//     })
// 	goodsProperty.value.sku.properties.forEach(item=>{

// 		propertyList.value.forEach(ite=>{
// 				ite.values.forEach(it=>{
// 					if(it.id == item.valueId ){
// 						onSelectSku(item.propertyId,item.valueId)
// 					}
// 				})
// 		})
// 	})

//   }
// })
// const  子 id 和 父id  为一组，如果 数组中存在，那么就是切换，如果没有 那就是首选

const choosedList = ref([])
const onSelectSku = (propertyId, valueId) => {
  choosedList.value.forEach(item => {
    if (item.parentId == propertyId) {
      item.valueId = valueId
    }
  })
}

const nowChooseItem = computed(() => {
  if (goodsProperty.value && goodsProperty.value.otherSkus ) {

    const index = findMatchingIndex(choosedList.value, goodsProperty.value.otherSkus);

    return goodsProperty.value.otherSkus[index]
  } else {
    return {}
  }
})

function findMatchingIndex(tempArr, totalArr) {

  for (let i = 0; i < totalArr.length; i++) {
    if (isEqual(tempArr, totalArr[i].properties)) {
      return i;
    }
  }
  return -1; // 如果没有找到匹配项，返回-1  
}

function isEqual(arr1, arr2) {

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].parentId !== arr2[i].propertyId || arr1[i].valueId !== arr2[i].valueId) {
      return false;
    }
  }
  return true;
}
const countVal = ref(1)

const confirmHandle = ()=>{
	request({
		url:'/app-api/trade/cart/update',
		methods:"POST",
		data:{
			id:goodsProperty.value.id,
			spuId:goodsProperty.value.spu.id,
			skuId:nowChooseItem.value.id
		}
	}).then(res=>{
		showBottom.value  =false
		cartStoreDeatil.getCarList()
		goodsProperty.value = {}
		propertyList.value = []
		choosedList.value = []
	})
}

defineExpose({
  showBottom,
  countVal,
  propertyList,
  choosedList,
  goodsProperty,
  getPropertyListHandle,
  nowChooseItem
})
</script>


<template>
  <view>
    <van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round >

      <view class="pt20 pdlr20 pb20 borderB">
        <view class="between">
          <view class="ww24"></view>
          <view class=" f16 semiBold">{{t('com.pop_h2')}}</view>
          <view>
            <img src="../../static/icons/pop_close.png" class="ww24 hh24 " @click="showBottom = false">
          </view>
        </view>
      </view>

      <view class="pt20 pdlr20 ">
        <view class="flex ">
          <view>
            <img :src="nowChooseItem.picUrl" class="ww80 hh80 bbo12" />
          </view>
          <view class="ml12">
            <view class=" ">
              <van-text-ellipsis rows="2" :content="goodsProperty.spu?.name" class="f15 semiBold" />
            </view>
            <view class="mt4 f12 colorDel">{{t('goods.g_h1')}}: <text class="color09">{{nowChooseItem.stock}}</text>
            </view>
            <view class="mt17">
              <span class="colorContent text_bold f17">${{fen2yuan(nowChooseItem.price)}}</span> 
            </view>
          </view>
        </view>
      <view style="max-height: 300px;overflow: scroll;">
		  <view class="mt30" v-for="(item,index) in propertyList" >
		    <view class="f15 semiBold" >{{item.name}}</view>
		    <view class="colorBoxEl" >
				<view v-for="(ite,ind) in item.values">
					<view class="sizeItem center f13 " v-if="ite.valueId !==0"
					  :class="choosedList[index].parentId == item.id&& choosedList[index].valueId ==ite.id ?'sizeActEl':''"
					  :key="ite" @tap="onSelectSku(item.id, ite.id)">
					  {{ite.name}}
					</view>
				</view>
		    </view>
		  </view>
	  </view>

		<view class="mt44 center botBtns mb20 borderT text_white " @click="confirmHandle">
		  {{t('all.con')}}
		</view>
      </view>

    </van-popup>
  </view>
</template>


<style lang="scss" scoped>
.numberBox {
  background: #f8f8f8;
  padding: 8px 10px;
  border-radius: 50px;
}
.borderB,
.borderT {
  border-color: #efefef;
}
.botBtns {
	  height: 44px;
	  background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
	  border-radius: 48px 48px 48px 48px;
}
.numBoxEl {
  background: #f8f8f8;
  border-radius: 50px;
  padding: 10px;
  min-width: 60px;
}

.colorBoxEl {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 1;

  .sizeItem {
    // width: 48px;
	padding: 0 10px;
    height: 32px;
    border-radius: 10px;
    background: #f8f8f8;
  }

  .sizeActEl {
    background: linear-gradient(91deg, #8d45dd 0%, #8634e2 100%);
    color: #fff;
  }
}
</style>
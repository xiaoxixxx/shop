<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import { showToast } from 'vant';
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const { t } = useI18n();
const cartStoreDeatil = cartStore();



const parentClass = computed(()=>{
	return cartStoreDeatil.$state.chooseTag[0]
})
const classList = computed(()=>{
	return cartStoreDeatil.$state.chooseTag[0].children
})



const goClass2 = item => {
	if(cartStoreDeatil.$state.chooseTag.length >1){
		cartStoreDeatil.$state.chooseTag.pop()
	}
	cartStoreDeatil.$state.chooseTag.push(item)
	if(!!item.children){
		uni.navigateTo({
			url: './class2'
		});
	}else{
		// 无下级
		uni.navigateTo({
		  url: './classSearch?fId=' + item.id
		});
	}

}


</script>


<template>

  <view>
    <topNavbar :title="parentClass.name"></topNavbar>

    <view class="pdlr12">
      <view class="mt10 flex col_center classItem" v-for="(item,index) in classList" @click="goClass2(item)">
		  <van-image
			class="ww44 hh44 imgsBg "
		  :src="item.picUrl"
		   radius="10"
		  >
		  <template v-slot:loading>
		    <van-loading type="spinner" size="20"  />
		  </template>
		  </van-image>
        <view class="ml16 f14  textHiddenTwo">
          {{ item.name }}
        </view>
      </view>
    </view>

    <view style="height: 100px;"></view>
  </view>
</template>



<style lang="scss" scoped>
.imgsBg {
  width: 44px;
  height: 44px;
  background: #f0f0f2;
  border-radius:10px;
}

.classItem {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(239, 239, 239, 0.5);
}
</style>
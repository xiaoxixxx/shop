<script setup>
import addressPop from '../../components/pop/addressPop.vue';
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import request from '../../../comm/request.ts'
import {
  showToast
} from 'vant';
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";

const {
  t
} = useI18n();
const cartStoreDeatil = cartStore();
import {
  settingPlant
} from '@/store/setting.js';
const settingPlantDeatil = settingPlant();
const isDefault = ref(true)

const countryList = computed(()=>{
	return settingPlantDeatil.$state.languageList
})
let curLang = localStorage.getItem('language')
const defaultCountry = ref("")
const chooseTypeInd = ref(0)
countryList.value.forEach((item,index)=>{
	if(item.value == curLang){
		defaultCountry.value = item
		chooseTypeInd.value = index
	}
})
const addressPopRef = ref("")
const confirmHandle = e => {
  defaultCountry.value = e
  clickRotate.value = 2
}
const clickRotate = ref(0)
const chooseCountryClick = () => {
  addressPopRef.value.showBottom = true
  clickRotate.value = 1
}

const formData = ref({
  firstName: "",
  lastName: "",
  areaId: "",
  mobile: "",
  defaultStatus: false,
})
const addressId = ref("")
const addAddressHandle = () => {
  if (!addressId.value) {
    // 新增
    request({
      url: "/app-api/member/address/create",
      methods: 'POST',
      data: {
        country: defaultCountry.value.name,
        ...formData.value
      }
    }).then(res => {
      showToast(t('goods.g_j1'))
      setTimeout(() => {
        history.back()
      }, 1000)
    })
  } else {
    // 修改
    request({
      url: "/app-api/member/address/update",
      methods: 'put',
      data: {
        country: defaultCountry.value.name,
        ...formData.value
      }
    }).then(res => {
      showToast(t('my.add_j1'))
      setTimeout(() => {
        history.back()
      }, 1000)
    })
  }

}
onMounted(() => {
  if (window.location.search.includes('id=')) {
    addressId.value = window.location.search.split("id=")[1]
    getAddress(addressId.value)
  }
})

const getAddress = (id) => {

  request({
    url: "/app-api/member/address/get",
    methods: 'get',
    data: {
      id
    }
  }).then(res => {
    console.log(res)
    formData.value = res
  })
}
</script>


<template>

  <view>
    <topNavbar :title="!addressId?t('my.add_t1'):t('my.add_t2')"></topNavbar>
    <view class="mt26 pdlr13">
      <view>
        <view class="f15 text_bold">{{t('my.add_h1')}}</view>
        <view class="hasBorder mt8 between pl12 pr27" @click="chooseCountryClick">
          <view class="color7C text_bold f14 ">{{defaultCountry.name}}</view>
          <img src="@/static/icons/bottom.png" class="ww24 hh24"
            :class="clickRotate == 1?'rotate180':clickRotate == 2?'rotate360':''" />
        </view>
      </view>

      <view class="mt20 between ">
        <view class=" nameItem nameItemShort">
          <view class="f15 text_bold  ">{{t('my.add_h2')}}</view>
          <view class="hasBorder f14  mt8 pdlr12 flex col_center ">
            <input type="text" :placeholder="t('my.add_h3')" v-model="formData.firstName" />
          </view>
        </view>
        <view class="nameItem nameItemShort">
          <view class="f15 text_bold ">{{t('my.add_h4')}}</view>
          <view class="hasBorder f14  mt8 pdlr12 flex col_center ">
            <input type="text" :placeholder="t('my.add_h3')" v-model="formData.lastName" />
          </view>
        </view>
      </view>

      <view class="mt20 pb15">
        <view class="f15 text_bold">{{t('my.add_h5')}}</view>
        <view class="hasBorder mt8  pdlr12  flex col_center">
          <view class="color7C text_bold f14 mr12 areaCode"> <span style="text-transform: uppercase;">{{defaultCountry.value}}</span> +{{defaultCountry.areaCode}}</view>
          <view class="ml14 nameItem ">
            <input type="number" class="flex1" :placeholder="t('my.add_h6')" maxlength="11" v-model="formData.mobile" />
          </view>
        </view>
        <view class="mt4 flex col_center ">
          <img src="../../static/icons/safe.png" class="ww24 hh24" />
          <view class="colorGreen f12">{{t('my.add_h7')}}</view>
        </view>
      </view>
    </view>
    <view class="hh8 mainf8Bg"></view>

    <view class="pt20 pdlr13">
      <view class="f15 text_bold">{{ t('my.add_h8') }}</view>
      <view class="hasBorder nameItem mt8  pdlr12 flex col_center ">
        <input type="text" class="flex1" :placeholder="t('my.add_h9')" v-model="formData.detailAddress" />
      </view>
    </view>

    <view class="pt20 pdlr13">
      <view class="f15 text_bold">{{t('my.add_h10')}}</view>
      <view class="hasBorder nameItem mt8  pdlr12 flex col_center ">
        <input type="number" class="flex1" :placeholder="t('my.add_h11')" v-model="formData.areaId" />
      </view>
    </view>

    <view class="pt20 pdlr13 flex col_center f12">
      <van-switch v-model="formData.defaultStatus" active-color="#8730E8" />
      <view class="ml8">{{t('my.add_h12')}}</view>
    </view>
    <view class="fixedBtn">
      <view class="btnContent center text_white" @click="addAddressHandle">
        {{ t('all.save') }}
      </view>
    </view>
    <addressPop ref="addressPopRef" :countryList="countryList" :confirmHandle="confirmHandle" :chooseTypeInd="chooseTypeInd"></addressPop>
    <view style="height: 100px;"></view>
  </view>
</template>



<style lang="scss" scoped>
.rotate180 {
  transform: rotateZ(180deg);
  transition: 0.2s linear all;
}

.rotate360 {
  transform: rotateZ(0deg);
  transition: 0.2s linear all;
}

.fixedBtn {
  position: fixed;
  width: calc(100% - 24px);
  bottom: 0;
  padding: 12px 12px;

  .btnContent {
    border-radius: 50px;
  }
}

.areaCode {
  position: relative;
}

.colorGreen {
  font-weight: 500;
}

.areaCode::after {
  position: absolute;
  content: "";
  display: block;
  height: 16px;
  width: 1px;
  background: rgba(0, 0, 0, 0.2);
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
}

.nameItemShort {
  width: 48%;
}

.hasBorder {
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  height: 48px;
  line-height: 48px;
}
</style>
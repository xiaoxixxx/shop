<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n();

const props = defineProps({
  confirmHandle: {
    tpye: Function,
    default: (data: any) => {
      return data;
    },
  },
});

const showFilterPop = ref(false);

const filterOptions = ref({
  opt1: [
    {
      name: "Unlimited",
      id: 1,
    },
    {
      name: "Popular",
      id: 2,
    },
    {
      name: "Praise",
      id: 3,
    },
  ],
  opt2: [
    {
      name: "China",
      id: 1,
    },
    {
      name: "France",
      id: 2,
    },
    {
      name: "South Korea",
      id: 3,
    },
    {
      name: "China",
      id: 1,
    },
    {
      name: "France",
      id: 2,
    },
    {
      name: "South Korea",
      id: 3,
    },
    {
      name: "Germany",
      id: 2,
    },
    {
      name: "Other",
      id: 3,
    },
  ],
});

const otp1ActInd = ref<number>(0);
const otp2ActInd = ref<number>(0);
const rangeVal = ref<[number, number]>([20, 50]);
const rangeChange = (val) => {
  console.log("range value", val);
  console.log("**********************");
};

const confirmPopHandle = () => {
  let data = {
    pro: filterOptions.value.opt2[otp2ActInd.value],
    fed: filterOptions.value.opt1[otp1ActInd.value],
    rang: rangeVal.value,
  };
  showFilterPop.value = false;
  props.confirmHandle(data);
};

defineExpose({
  showFilterPop,
});
</script>



<template>
  <view>
    <van-popup v-model:show="showFilterPop" position="right" :style="{ width: '80%', height: '100%' }">
      <view class="pdlr12 pt20 popRightBox">
        <view class="f20 text_bold">{{t('goods.fil_h1')}}</view>

        <view class="mt29">
          <view class=" f15 text_bold">
            {{t('goods.fil_h2')}}
          </view>
          <view class="feadBox mt16">
            <view v-for="(item,index) in filterOptions.opt1" class="feadItemEl"
              :class="otp1ActInd == index?'actItemEl':''" @click="otp1ActInd = index">{{ item.name }}
            </view>
          </view>
        </view>

        <!-- <view class="mt50 between">
          <view class="f15 text_bold">Brand</view>
          <view class="f12 flex  col_center">unlimited <img src="@/static/my/left.png" class="ww24 hh24">
          </view>
        </view> -->

        <view>
          <view class="mt50 between">
            <view class="f15 text_bold"> {{t('goods.fil_h3')}}</view>
            <view class="f12 flex  col_center">${{rangeVal[0]}}-{{rangeVal[1]}}</view>
          </view>
          <view class="mt20">
            <van-slider v-model="rangeVal" range @change="rangeChange" :min="10" :max="999" bar-height="5"
              active-color="#8A3DDF" inactive-color="rgba(0,0,0,0.2)">
              <template #button>
                <div class="custom-button"></div>
              </template>
            </van-slider>
          </view>
        </view>

        <view class="mt50">
          <view class="f15 text_bold"> {{t('goods.fil_h4')}}</view>
          <view class="feadBox mt16">
            <view v-for="(item,index) in filterOptions.opt2" class="feadItemEl"
              :class="otp2ActInd == index?'actItemEl':''" @click="otp2ActInd = index">{{ item.name }}
            </view>
          </view>
        </view>

        <view class="botBtnBox f14">
          <view class="text_bold "> {{t('goods.fil_h5')}}</view>
          <view class="btnContent center text_white" @click="confirmPopHandle"> {{t('all.con')}}</view>

        </view>
      </view>

    </van-popup>
  </view>
</template>

<style lang="scss" scoped>
	.btnContent{
		font-weight: normal;
	}
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
</style>
<template>
  <view class="bg-white order-list-card-box ss-r-10 ss-m-t-14 ss-m-20" :key="orderData.id" style="width: 80%;">
    <view class="order-card-header ss-flex ss-col-center ss-row-between ss-p-x-20 pdlr16 pt12">
      <view class="order-no">{{t('chat.c_h1')}}<text class="color999">{{ orderData.no }}</text></view>
      <view class="order-state  f14" :class="formatOrderColor(orderData)">
        {{ formatOrderStatus(orderData) }}
      </view>
    </view>
    <view class="border-bottom" v-for="item in orderData.items" :key="item.id">

      <van-card :thumb="item.picUrl" :title="item.spuName"
        :skuText="item.properties.map((property) => property.valueName).join(' ')" :price="item.price" :num="item.count"
        priceColor="#FF3000" />
    </view>
    <view class="pay-box ss-m-t-30 ss-flex ss-row-right ss-p-r-20">
      <view class="ss-flex ss-col-center between pdlr16 pb12">
        <view class="discounts-title pay-color"> {{ orderData.productCount }}{{t('chat.c_h2')}}</view>
        <view class="discounts-money pay-color">
          $ {{ fen2yuan(orderData.payPrice) }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { fen2yuan, formatOrderColor, formatOrderStatus } from '../../../../comm/useGoods.js';
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
const props = defineProps({
  orderData: {
    type: Object,
    default: {},
  },
});
</script>

<style lang="scss" scoped>
.bg-white {
  background: #fff;
  border-radius: 20px;
}
.order-list-card-box {
  .order-card-header {
    height: 80rpx;

    .order-no {
      font-size: 26rpx;
      font-weight: 500;
    }

    .order-state {
    }
  }
  .pay-box {
    .discounts-title {
      font-size: 24rpx;
      line-height: normal;
      color: #999999;
    }

    .discounts-money {
      font-size: 24rpx;
      line-height: normal;
      color: #999;
      font-family: OPPOSANS;
    }

    .pay-color {
      color: #333;
    }
  }
  .order-card-footer {
    height: 100rpx;

    .more-item-box {
      padding: 20rpx;

      .more-item {
        height: 60rpx;

        .title {
          font-size: 26rpx;
        }
      }
    }

    .more-btn {
      color: #faad14;
      font-size: 24rpx;
    }

    .content {
      width: 154rpx;
      color: #333333;
      font-size: 26rpx;
      font-weight: 500;
    }
  }
}
.warning-color {
  color: #faad14;
}

.danger-color {
  color: #ff3000;
}

.success-color {
  color: #52c41a;
}

.info-color {
  color: #999999;
}
</style>

<template>
  <van-popup :show="showTools" position="bottom" @close="handleClose">
    <view class="ss-modal-box ss-flex-col">
      <slot></slot>
      <view class="content ss-flex ss-flex-1">
        <template v-if="toolsMode === 'emoji'">
          <view>
            <swiper class="emoji-swiper" :indicator-dots="true" circular indicator-active-color="#7063D2"
              indicator-color="rgba(235, 231, 255, 1)" :autoplay="false" :interval="3000" :duration="1000">
              <swiper-item v-for="emoji in emojiPage" :key="emoji">
                <view class="ss-flex ss-flex-wrap">
                  <img v-for="item in emoji" :key="item" class="emoji-img"
                    :src="`https://file.sheepjs.com/static/img/chat/emoji/${item.file}`" @tap="onEmoji(item)">
                  </img>
                </view>
              </swiper-item>
            </swiper>
          </view>
        </template>
        <template v-else>
          <view class="around">
            <view class="image aroundItem">
              <img class="ww60 hh60" src="@/static/chat/c1.png" @click="imageSelect({ type: 'image', data: $event })" />
              <view>{{t('chat.c_h5')}}</view>
            </view>
            <view class="goods aroundItem" @tap="onShowSelect('goods')">
              <img class="ww60 hh60" src="@/static/chat/c2.png" />
              <view>{{t('chat.c_h6')}}</view>
            </view>
            <view class="order aroundItem" @tap="onShowSelect('order')">
              <img class="ww60 hh60" src="@/static/chat/c3.png" />
              <view>{{t('chat.c_h7')}}</view>
            </view>
          </view>
        </template>
      </view>
    </view>
  </van-popup>
</template>

<script setup>
/**
 * 聊天工具
 */
import { emojiPage } from '../util/emoji';
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
const props = defineProps({
  // 工具模式
  toolsMode: {
    type: String,
    default: '',
  },
  // 控制工具菜单弹出
  showTools: {
    type: Boolean,
    default: () => false,
  },
});
const emits = defineEmits(['onEmoji', 'imageSelect', 'onShowSelect', 'close']);

// 关闭弹出工具菜单
function handleClose() {
  emits('close');
}

// 选择表情
function onEmoji(emoji) {
  emits('onEmoji', emoji);
}

// 选择图片
function imageSelect(val) {
  emits('imageSelect', val);
}

// 选择商品或订单
function onShowSelect(mode) {
  emits('onShowSelect', mode);
}
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  align-content: space-around;
  border-top: 1px solid #dfdfdf;
  padding: 20rpx 0;

  .emoji-swiper {
    width: calc(100% - 40rpx);
    height: 280rpx;
    padding: 0 20rpx;

    .emoji-img {
      width: 50rpx;
      height: 50rpx;
      display: inline-block;
      margin: 10rpx;
    }
  }
  .aroundItem {
    text-align: center;
    font-size: 11px;
    color: #7c7c7c;
  }
  // .image,
  // .goods,
  // .order {
  //   width: 60px;
  //   height: 60px;
  //   text-align: center;
  //   font-size: 24rpx;
  //   color: #333;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;

  //   .icon {
  //     width: 50rpx;
  //     height: 50rpx;
  //     margin-bottom: 21rpx;
  //   }
  // }

  :deep() {
    .uni-file-picker__container {
      justify-content: center;
    }

    .file-picker__box {
      display: none;

      &:last-of-type {
        display: flex;
      }
    }
  }
}
</style>

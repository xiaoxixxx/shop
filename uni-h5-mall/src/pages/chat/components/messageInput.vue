<template>
  <view class="send-wrap  between">
    <view class="left   flex1">
      <input class="inputClass" :inputBorder="false" :clearable="false" v-model="message"
        placeholder="Please enter the question "></input>
    </view>
    <view class="ml16">
      <img src="@/static/chat/emjoy.png" class="ww24 hh24" @tap.stop="onTools('emoji')">
      <img src="@/static/chat/pic.png" class=" ml12 ww24 hh24" @tap.stop="onTools('tools')">
    </view>
    <button v-if="message" class="ss-reset-button send-btn" @tap="sendMessage">
      {{t('chat.s_btn')}}
    </button>
  </view>
</template>

<script setup>

import { computed } from 'vue';
import {
  useI18n
} from "vue-i18n";
const {
  locale, t
} = useI18n();
/**
 * 消息发送组件
 */
const props = defineProps({
  // 消息
  modelValue: {
    type: String,
    default: '',
  },
  // 工具模式
  toolsMode: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:modelValue', 'onTools', 'sendMessage']);
const message = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits(`update:modelValue`, newValue);
  }
});


// 打开工具菜单
function onTools(mode) {
  emits('onTools', mode);
}

// 发送消息
function sendMessage() {
  emits('sendMessage');
}
</script>

<style scoped lang="scss">
.send-wrap {
  padding: 12px 16px;
  background: #fff;
  .inputClass {
    background: #f4f4f4;
    padding: 9px 12px;
    border-radius: 2px;
  }
  .left {
    height: 64rpx;
    border-radius: 32rpx;
    background: var(--ui-BG-1);
  }

  .bq {
    font-size: 50rpx;
    margin-left: 10rpx;
  }

  .sicon-edit {
    font-size: 50rpx;
    margin-left: 10rpx;
    transform: rotate(0deg);
    transition: all linear 0.2s;

    &.is-active {
      transform: rotate(45deg);
    }
  }

  .send-btn {
    // width: 100rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 30rpx;
    background: linear-gradient(96deg, #9f58ef 0%, #8730e8 100%);
    font-size: 26rpx;
    color: #fff;
    margin-left: 11rpx;
  }
}
</style>

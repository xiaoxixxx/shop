<template>
  <view class="chat-box pdlr12">
    <!--  消息渲染  -->
    <view class="message-item ss-flex-col scroll-item">
      <view class="ss-flex center  ss-col-center">
        <!-- 日期 -->
        <view v-if="
            message.contentType !== KeFuMessageContentTypeEnum.SYSTEM &&
            showTime(message, messageIndex)
          " class="date-message">
          {{ formatDate(message.createTime) }}
        </view>
        <!-- 系统消息 -->
        <view v-if="message.contentType === KeFuMessageContentTypeEnum.SYSTEM" class="system-message">
          {{ message.content }}
        </view>
      </view>
      <!-- 消息体渲染管理员消息和用户消息并左右展示  -->
      <view v-if="message.contentType !== KeFuMessageContentTypeEnum.SYSTEM" class="ss-flex ss-col-top" :class="[
          message.senderType === UserTypeEnum.ADMIN
            ? `ss-row-left`
            : message.senderType === UserTypeEnum.MEMBER
            ? `ss-row-right`
            : '',
        ]">
        <!-- 客服头像 -->
        <img v-show="message.senderType === UserTypeEnum.ADMIN" class="chat-avatar ss-m-r-24"
          src="@/static/chat/kefu.png" mode="aspectFill"></img>
        <!-- 内容 -->
        <template v-if="message.contentType === KeFuMessageContentTypeEnum.TEXT">
          <view class="message-box mglr8" :class="{ admin: message.senderType === UserTypeEnum.ADMIN }">
            <mp-html :content="replaceEmoji(message.content)" />
          </view>
        </template>
        <template v-if="message.contentType === KeFuMessageContentTypeEnum.IMAGE">
          <view class="message-box" :class="{ admin: message.senderType === UserTypeEnum.ADMIN }"
            :style="{ width: '200px' }">
			
			<van-image :src="message.content" :height="200" width="100%" radius="10" @click="imgClick(message.content)">
			  <template v-slot:loading>
			    <van-loading type="spinner" size="20" />
			  </template>
			</van-image>
			  
          </view>
        </template>
        <template v-if="message.contentType === KeFuMessageContentTypeEnum.PRODUCT">
          <GoodsItem :goodsData="getMessageContent(message)" />
        </template>
        <template v-if="message.contentType === KeFuMessageContentTypeEnum.ORDER">
          <OrderItem :orderData="getMessageContent(message)" />
        </template>
        <!-- user头像 -->
        <img v-if="message.senderType === UserTypeEnum.MEMBER" class="chat-avatar ss-m-l-24"
          :src="userInfo.avatar">
        </img>
      </view>
    </view>
	
  </view>
</template>

<script setup>
import { showImagePreview } from 'vant';
import { computed, unref } from 'vue';
import dayjs from 'dayjs';
import { KeFuMessageContentTypeEnum, UserTypeEnum } from '../util/constants';
import { emojiList } from '../util/emoji';
import { formatDate } from '../../../../comm/useGoods.js';
import GoodsItem from './goods.vue';
import OrderItem from './order.vue';
import mpHtml from '../../../components/mp-html/mp-html.vue'

const props = defineProps({
  // 消息
  message: {
    type: Object,
    default: () => ({}),
  },
  // 用户信息
  userInfo:{
	  type:Object,
	  default:{}
  },
  // 消息索引
  messageIndex: {
    type: Number,
    default: 0,
  },
  // 消息列表
  messageList: {
    type: Array,
    default: () => [],
  },
});
const getMessageContent = computed(() => (item) => JSON.parse(item.content)); // 解析消息内容

//======================= 工具 =======================

const imgClick = item=>{
	showImagePreview({
	  images:[item],
	  startPosition: 0,
	});
}

const showTime = computed(() => (item, index) => {
  if (unref(props.messageList)[index + 1]) {
    let dateString = dayjs(unref(props.messageList)[index + 1].createTime).fromNow();
    return dateString !== dayjs(unref(item).createTime).fromNow();
  }
  return false;
});

// 处理表情
function replaceEmoji(data) {
  let newData = data;
  if (typeof newData !== 'object') {
    let reg = /\[(.+?)]/g; // [] 中括号
    let zhEmojiName = newData.match(reg);
    if (zhEmojiName) {
      zhEmojiName.forEach((item) => {
        let emojiFile = selEmojiFile(item);
        newData = newData.replace(
          item,
          `<img class="chat-img" style="width: 24px;height: 24px;margin: 0 3px;" src="https://file.sheepjs.com/static/img/chat/emoji/${emojiFile}"/>`,
        );
      });
    }
  }
  
  return newData;
}

function selEmojiFile(name) {
  for (let index in emojiList) {
    if (emojiList[index].name === name) {
      return emojiList[index].file;
    }
  }
  return false;
}
</script>

<style  lang="scss" scoped>
.ss-row-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.ss-row-left {
  display: flex;
}
.message-item {
  margin-bottom: 33rpx;
}

.date-message,
.system-message {
  width: fit-content;
  border-radius: 12rpx;
  padding: 8rpx 16rpx;
  margin-bottom: 16rpx;
  // background-color: #fff;
  color: #7f828c;
  font-size: 24rpx;
}

.chat-avatar {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
}

.send-status {
  color: #333;
  height: 80rpx;
  margin-right: 8rpx;
  display: flex;
  align-items: center;

  .loading {
    width: 32rpx;
    height: 32rpx;
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;

    @-webkit-keyframes rotating {
      0% {
        transform: rotateZ(0);
      }

      100% {
        transform: rotateZ(360deg);
      }
    }

    @keyframes rotating {
      0% {
        transform: rotateZ(0);
      }

      100% {
        transform: rotateZ(360deg);
      }
    }
  }

  .warning {
    width: 32rpx;
    height: 32rpx;
    color: #ff3000;
  }
}

.message-box {
  // width: 245px;
  max-width: 50%;
  font-size: 16px;
  line-height: 20px;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
  padding: 12px;
  border-radius: 16px 16px 16px 16px;
  color: #fff;
  // background: linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
  background: linear-gradient(96deg, #9f58ef 0%, #8730e8 100%);
  &.admin {
    background: #fff;
    color: #090909;
  }

  :deep() {
    .imgred {
      width: 100%;
    }

    .imgred,
    img {
      width: 100%;
    }
  }
}

:deep() {
  .goods,
  .order {
    max-width: 500rpx;
  }
}

.message-img {
  width: 100px;
  height: 100px;
  border-radius: 6rpx;
}

.template-wrap {
  // width: 100%;
  padding: 20rpx 24rpx;
  background: #fff;
  border-radius: 10rpx;

  .title {
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 29rpx;
  }

  .item {
    font-size: 24rpx;
    color: var(--ui-BG-Main);
    margin-bottom: 16rpx;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.error-img {
  width: 400rpx;
  height: 400rpx;
}
</style>

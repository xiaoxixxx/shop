<template>
  <view class="chat-wrap ">
    <!-- :title="!isReconnecting ? '连接客服成功' : '会话重连中'" navbar="inner" -->
    <!--  覆盖头部导航栏背景颜色  -->
    <!-- <div class="page-bg" :style="{ height: 50 + 'px' }"></div> -->
    <!--  聊天区域  -->
    <MessageList ref="messageListRef">
      <template #bottom>
        <message-input v-model="chat.msg" @on-tools="onTools" @send-message="onSendMessage"></message-input>
      </template>
    </MessageList>
    <!--  聊天工具  -->
    <tools-popup :show-tools="chat.showTools" :tools-mode="chat.toolsMode" @close="handleToolsClose" @on-emoji="onEmoji"
      @image-select="onSelect" @on-show-select="onShowSelect">
      <message-input v-model="chat.msg" @on-tools="onTools" @send-message="onSendMessage"></message-input>
    </tools-popup>
    <!--  商品订单选择  -->
    <SelectPopup :mode="chat.selectMode" :show="chat.showSelect" @select="onSelect" @close="chat.showSelect = false" />
  </view>
</template>

<script setup>

import MessageList from './components/messageList.vue';
import {
  reactive,
  ref,
  toRefs
} from 'vue';
import ToolsPopup from './components/toolsPopup.vue';
import MessageInput from './components/messageInput.vue';
import SelectPopup from './components/select-popup.vue';
import {
  KeFuMessageContentTypeEnum,
  WebSocketMessageTypeConstants
} from './util/constants';


import FileApi from './api/file.js';
import KeFuApi from './api/kefu.js';
import {
  useWebSocket
} from './util/useWebSocket';


import {
  useI18n
} from 'vue-i18n'
const {
  locale, t
} = useI18n();

const chat = reactive({
  msg: '',
  scrollInto: '',
  showTools: false,
  toolsMode: '',
  showSelect: false,
  selectMode: '',
});

// 发送消息
async function onSendMessage() {
  if (!chat.msg) return;
  try {
    const data = {
      contentType: KeFuMessageContentTypeEnum.TEXT,
      content: chat.msg,
    };
    await KeFuApi.sendKefuMessage(data);
    await messageListRef.value.refreshMessageList();
    chat.msg = '';
  } finally {
    chat.showTools = false;
  }
}

const messageListRef = ref();

//======================= 聊天工具相关 start =======================

function handleToolsClose() {
  chat.showTools = false;
  chat.toolsMode = '';
}

function onEmoji(item) {
  chat.msg += item.name;
}

// 点击工具栏开关
function onTools(mode) {
  if (isReconnecting.value) {
    sheep.$helper.toast(t('chat.c_h8'));
    return;
  }

  if (!chat.toolsMode || chat.toolsMode === mode) {
    chat.showTools = !chat.showTools;
  }
  chat.toolsMode = mode;
  if (!chat.showTools) {
    chat.toolsMode = '';
  }
}




function onShowSelect(mode) {
  chat.showTools = false;
  chat.showSelect = true;
  chat.selectMode = mode;
}

async function onSelect({
  type,
  data
}) {
  let msg;
  switch (type) {
    case 'image':
      uni.chooseImage({
        count: 1,
        success: async (e) => {
          const res = await FileApi.uploadFile(e.tempFilePaths[0]);
          msg = {
            contentType: KeFuMessageContentTypeEnum.IMAGE,
            content: res.data,
          };

          // 发送消息
          // scrollBottom();
          await KeFuApi.sendKefuMessage(msg);
          await messageListRef.value.refreshMessageList();
          chat.showTools = false;
          chat.showSelect = false;
          chat.selectMode = '';
        }
      })
      break;
    case 'goods':
      msg = {
        contentType: KeFuMessageContentTypeEnum.PRODUCT,
        content: JSON.stringify(data),
      };
      break;
    case 'order':
      msg = {
        contentType: KeFuMessageContentTypeEnum.ORDER,
        content: JSON.stringify(data),
      };
      break;
  }
  if (msg) {
    // 发送消息
    // scrollBottom();
    await KeFuApi.sendKefuMessage(msg);
    await messageListRef.value.refreshMessageList();
    chat.showTools = false;
    chat.showSelect = false;
    chat.selectMode = '';
  }
}

//======================= 聊天工具相关 end =======================
const {
  options
} = useWebSocket({
  // 连接成功
  onConnected: async () => { },
  // 收到消息
  onMessage: async (data) => {
    const type = data.type;
    if (!type) {
      console.error('未知的消息类型：' + data.value);
      return;
    }
    // 2.2 消息类型：KEFU_MESSAGE_TYPE
    if (type === WebSocketMessageTypeConstants.KEFU_MESSAGE_TYPE) {
      // 刷新消息列表
      await messageListRef.value.refreshMessageList(JSON.parse(data.content));
      return;
    }
    // 2.3 消息类型：KEFU_MESSAGE_ADMIN_READ
    if (type === WebSocketMessageTypeConstants.KEFU_MESSAGE_ADMIN_READ) {
      console.log('管理员已读消息');
    }
  },
});
const isReconnecting = toRefs(options).isReconnecting; // 重连状态
</script>

<style scoped lang="scss">
:deep(.van-card, .van-card__header) {
  background: #fff;
  border-radius: 16px;
}

.chat-wrap {
  background: #f8f8f8;

  .page-bg {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background-color: var(--ui-BG-Main);
    z-index: 1;
    background: #f8f8f8;
  }

  .status {
    position: relative;
    box-sizing: border-box;
    z-index: 3;
    height: 70rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    font-weight: 400;
  }
}
</style>
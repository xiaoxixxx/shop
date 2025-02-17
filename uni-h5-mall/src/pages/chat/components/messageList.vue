<template>
  <!--  聊天虚拟列表  -->
  <z-paging ref="pagingRef" v-model="messageList" use-chat-record-mode use-virtual-list cell-height-mode="dynamic"
    default-page-size="20" :auto-clean-list-when-reload="false" safe-area-inset-bottom bottom-bg-color="#f8f8f8"
    :back-to-top-style="backToTopStyle" :auto-show-back-to-top="showNewMessageTip" @backToTopClick="onBackToTopClick"
    @scrolltoupper="onScrollToUpper" @query="queryList" style="background:#f8f8f8">
    <template #top>
      <topNavbar :title="'Service'"></topNavbar>
    </template>
    <!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置！！！ -->
    <!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
    <template #cell="{item,index}">
      <view style="transform: scaleY(-1)">
        <!--  消息渲染  -->
        <MessageListItem :message="item" :message-index="index" :message-list="messageList" :userInfo = "userStoreInfo.$state.userInfo"></MessageListItem>
      </view>
    </template>
    <!-- 底部聊天输入框 -->
    <template #bottom>
      <slot name="bottom"></slot>
    </template>
	<view style="height: 50px;"></view>
    <!-- 查看最新消息 -->
    <template #backToTop>
      <text>{{t('add1.a_a5')}}</text>
    </template>

  </z-paging>
</template>

<script setup>
import MessageListItem from './messageListItem.vue';
import { reactive, ref } from 'vue';
import KeFuApi from '../api/kefu';
import { isEmpty } from '../../../../comm/useGoods';
// import sheep from '@/sheep';
import topNavbar from '../../../components/topNavbar/topNavbar.vue';

import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()
// const sys_navBar = sheep.$platform.navbar;
const messageList = ref([]); // 消息列表
const showNewMessageTip = ref(false); // 显示有新消息提示
const backToTopStyle = reactive({
  'width': '100px',
  'background-color': '#fff',
  'border-radius': '30px',
  'box-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
}); // 返回顶部样式
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});
const pagingRef = ref(null); // 虚拟列表
const queryList = async (pageNo, pageSize) => {
  // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
  // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
  queryParams.pageNo = pageNo;
  queryParams.pageSize = pageSize;
  await getMessageList();
};
// 获得消息分页列表
const getMessageList = async () => {
  const res = await KeFuApi.getKefuMessagePage(queryParams);
  if (isEmpty(res)) {
    return;
  }
  pagingRef.value.completeByTotal(res.list, res.total);
};
/** 刷新消息列表 */
const refreshMessageList = (message = undefined) => {
  if (message !== undefined) {
    showNewMessageTip.value = true;
    // 追加数据
    pagingRef.value.addChatRecordData([message], false);
    return;
  }
  pagingRef.value.reload();
};
/** 滚动到最新消息 */
const onBackToTopClick = (event) => {
  event(false); // 禁用默认操作
  pagingRef.value.scrollToBottom();
};
/** 监听滚动到底部事件（因为 scroll 翻转了顶就是底） */
const onScrollToUpper = () => {
  // 若已是第一页则不做处理
  if (queryParams.pageNo === 1) {
    return;
  }
  showNewMessageTip.value = false;
};
defineExpose({ getMessageList, refreshMessageList });
</script>

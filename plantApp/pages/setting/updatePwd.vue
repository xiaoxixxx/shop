<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'
	import { ref} from 'vue'

	import {
		useI18n
	} from "vue-i18n";

	const {
		t
	} = useI18n();

	const username = uni.getStorageSync('username')
	const newPassword = ref("")
	const oldPassword = ref("")
	const confirmHandle = () => {
		request({
			url: '/admin-api/system/user/profile/update-password',
			methods: "PUT",
			data: {
				newPassword: newPassword.value,
				oldPassword: oldPassword.value
			}
		}).then(res => {
			uni.showToast({
				title:t('setting.s_j1'),
				icon:'none'
			})
			newPassword.value = ""
			oldPassword.value = ""
			uni.navigateTo({
				url: '../home/login'
			})
		}).catch(e=>{
			uni.showToast({
				title:e.msg,
				icon:'none'
			})
		})
	}
	
	const goBack = ()=>{
		uni.navigateBack()
	}
</script>


<template>

	<view class="content">
		<view class="pdlr10 pdtb10  between  topNav" >
		  <view class="left">
		    <image src="/static/icons/right.png" class="ww32 hh32"  @click="goBack" />
		  </view>
		  <view class="text_center  f17 ">
		    <van-text-ellipsis rows="1" :content="t('setting.s_t1')" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>

		<view class="mt12 pdlr12">
			<view class="contentBox">
				<view class="setItem between f14 borderB ">
					<view>{{t('setting.s_s7')}}</view>
					<view>{{username}}</view>
				</view>
				<view class="setItem between f14 borderB ">
					<view>{{t('setting.s_s8')}}</view>
					<input type="password" :placeholder="t('setting.s_s9')" v-model="oldPassword">
				</view>
				<view class="setItem between f14  ">
					<view>{{t('setting.s_s10')}}</view>
					<input type="password" :placeholder="t('setting.s_s9')" v-model="newPassword">
				</view>
			</view>

			<view class="btns f14 text_white center" @click="confirmHandle">
				{{t('setting.s_s6')}}
			</view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.btns {
		height: 48px;
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		text-align: center;
		line-height: 48px;
		margin-top: 150px;
	}

	input {
		width: 83px;
	}

	:deep(.uni-input-placeholder) {
		color: #D7D7D7;
	}

	.borderB {
		border-color: #EFEFEF;
	}

	.contentBox {
		background: #fff;
		border-radius: 16px;
		padding: 12px 12px;

		.setItem {
			padding: 24px 0;
		}
	}
</style>
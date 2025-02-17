<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'
	
import {
		useI18n
	} from "vue-i18n";
	import {ref} from 'vue'
	const {
		t
	} = useI18n();


	const changePage = url => {
		uni.navigateTo({
			url
		})
	}

	const showPopCenter = ref(false)

	const popConfirmHandle = () => {
		let curLang = uni.getStorageSync('language')
		uni.clearStorageSync()
		
		uni.setStorageSync('language',curLang)
		uni.navigateTo({
			url: '../home/login'
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
		  <view class="text_center    f17   ">
		    <van-text-ellipsis rows="1" :content="t('setting.s_s1')" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		    <slot></slot>
		  </view>
		</view>
		

		<view class="mt12 pdlr12 ">
			<view class="contentBox">
				<view class="setItem pb28 between borderB" @click="changePage('./updatePwd')">
					<view class="flex col_center">
						<image src="/static/icons/s1.png" alt="" class="ww24 hh24" />
						<view class="ml8">{{t('setting.s_s2')}}</view>
					</view>
					<view>
						<image src="/static/icons/g_right.png" class="ww24 hh24" />
					</view>
				</view>

				<view class="setItem between pt28" @click="showPopCenter = true">
					<view class="flex col_center">
						<image src="/static/icons/s2.png" alt="" class="ww24 hh24" />
						<view class="ml8">{{t('setting.s_s3')}}</view>
					</view>
					<view>
						<image src="/static/icons/g_right.png" class="ww24 hh24" />
					</view>
				</view>
			</view>
		</view>

		<van-popup v-model:show="showPopCenter" round style="width: 280px;">
			<view class="pt30 pdlr26 ">
				<view class="f15   text_center borderB pb24" style="line-height: 18px;">
					{{t('setting.s_s4')}}
				</view>
			</view>
			<view class="  pdlr20 pdtb16">
				<view class="girdBtn">
					<view class="botBtn cancelBtn center color7C" @click="showPopCenter = false">{{t('setting.s_s5')}}</view>
					<view class="botBtn  center text_white confirmBtn" @click="popConfirmHandle">{{t('setting.s_s6')}}</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>



<style lang="scss" scoped>
	.girdBtn {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;

		.botBtn {
			height: 48px;
			border-radius: 48px 48px 48px 48px;
		}

		.confirmBtn {
			background: #3178FC;
			position: relative;
		}

		.cancelBtn {
			background: #F3F3F3;
		}
	}


	.borderB {
		border-bottom: 1px solid #EFEFEF;
	}

	.contentBox {
		background: #FFFFFF;
		border-radius: 16px 16px 16px 16px;
		padding: 30px 17px;
	}
</style>
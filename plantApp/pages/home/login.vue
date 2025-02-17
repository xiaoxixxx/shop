<script setup>
	import request from '../../comm/request.ts'
	import { showToast } from 'vant';
	import { computed ,ref} from 'vue'
import {
  useI18n
} from "vue-i18n";

const {
  locale,t
} = useI18n();

		
		const mobile = ref("")
		const code = ref("")
		const confirmHandle = ()=>{
	
			request({
				url:'/admin-api/system/auth/login',
				methods:'POST',
				data:{
					username:mobile.value,
					password:code.value,
					captchaVerification
					: 
					"iHy+rM5L3CGeqbeRh+Rq73DJkevrD8SZMgKdQOnG/GLnJk9RbJntjMgmmrZM2abW3XejjvmQQw51zFpBOp8oNw=="
				}
			}).then(res=>{
				uni.setStorageSync('token',res.accessToken)
				uni.setStorageSync('refresh-token',res.refreshToken)
				uni.showToast({
					title:'Login success',
					icon:'none'
				})
				uni.setStorageSync('staffType',res.staffType)
				uni.setStorageSync('username',res.username)
				uni.navigateTo({
					url:'../tab/index'
				})
				if(res.staffType == 1){
					locale.value = 'en'
					uni.setStorageSync('language','en')
				}else{
					locale.value = 'zh'
					uni.setStorageSync('language','zh')
				}
				
			}).catch(e=>{
				uni.showToast({
					title:e.msg,
					icon:'none'
				})
			})
		}
	
</script>


<template>
	
	<view class="white_bg">
		<view class="pdlr30 mt40">
			<view class="f34 text_bold">{{t('login.l1')}}</view>
			<view class="f20 mt10">{{t('login.l2')}}</view>
			
			<view class="mt50">
				<view>Account</view>
				<view class="mt12 pb9 borderB f13">
					<input type="text" :placeholder="t('login.l4')" v-model="mobile">
				</view>
			</view>
			
			<view class="mt40">
				<view>{{t('login.l5')}}</view>
				<view class="mt12 pb9 borderB f13">
					<input type="password" :placeholder="t('login.l6')" v-model="code">
				</view>
			</view>
			
			<view class="mt60">
				<view class="btns f14 text_white center" @click="confirmHandle">
					{{t('login.l7')}}
				</view>
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
	}
	.borderB{
		border-color: #EFEFEF;
	}
	
	:deep(.uni-input-placeholder) {
		color: #AFAFAF;
	}
	.white_bg{
		background: #fff;
		min-height: 100vh;
	}
</style>
<script setup>
	import { showToast } from 'vant';
	import request from '../../../comm/request.ts'
	import {
		useI18n
	} from "vue-i18n";

	const {
		locale
	} = useI18n();
	import {
	  userStore
	} from '@/store/user.js';
	const userStoreInfo = userStore()
	

	const showBottom = ref(false)
	

	const chooseTypeInd = ref(userStoreInfo.$state.userInfo?.sex)

	const selectList = [
		{
			name:'Male',
			value:0
		},
		{
			name:'Female',
			value:1
		},
	]

	const confirmSelectHandle = () => {
		uni.showLoading()
			request({
					url:'/app-api/member/user/update',
					data:{
						sex:selectList[chooseTypeInd.value].value
					},
					methods:"PUT"
				}).then(res=>{
					showToast('Update Success')
					userStoreInfo.updateUserInfo()
					showBottom.value = false
				}).finally(()=>{
					uni.hideLoading()
				})
	}
	
	
	defineExpose({
		showBottom
	})
</script>


<template>
	<view>
		<van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true" round>

			<view class="pt20  pb20">
				<view class="pdlr20">
					
					
				<view class="between">
					<view class="ww24"></view>
					<view class=" f16 text_bold">Gender</view>
					<view>
						<img src="../../static/icons/pop_close.png" class="ww24 hh24" @click="showBottom = false">
					</view>
				</view>
				</view>
					
					<view class="line"></view>
				<view class="mt30 f15 text_bold pdlr20">
					<view class="selectItem between" v-for="(item,index) in selectList" @click="chooseTypeInd = index">
						<view>{{ item.name }}</view>
						<view>
							<img src="../../static/icons/choosed_cho.png" class="ww18 hh18"
								v-if="chooseTypeInd == index">
							<img src="../../static/icons/null_cho.png" class="ww18 hh18" v-else>
						</view>
					</view>

				<view class="mt43">
					<view class="btnContent  f14 center text_white" @click="confirmSelectHandle">
						Confirm
					</view>
				</view>
				</view>
			</view>
		</van-popup>
	</view>
</template>


<style lang="scss" scoped>
	.selectItem:not(:last-child) {
		margin-bottom: 30px;
	}
	.btnContent{
		border-radius: 50px;
		height: 44px;
		line-height: 44px;
	}
	.line{
		margin-top: 20px;
		height: 1px;
		background: #EFEFEF;
	}
</style>
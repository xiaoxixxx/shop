<script setup>
	import {
		onMounted
	} from 'vue';
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import {
		showToast
	} from 'vant';
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app';
	const scanVal = ref(0)
	onLoad(e => {
		if (e.code) {
			scanVal.value = e.code
		}
	})

	const changePage = url => {
		uni.navigateTo({
			url
		})
	}

	const changeTabPage = url => {
		uni.switchTab({
			url
		})
	}
	

</script>


<template>

	<view class="content">
		<view class="between pdlr20 pdtb10">
			<view class="ww50"></view>
			<view class="text_bold f17">Receiving</view>
			<view class="color999 f14 ww50"></view>
		</view>

		<view class="pdlr20 mt73">
			<view class="center">
				<image src="@/static/bg/recSuc.png" style="width: 69px;height: 94px;" />
			</view>
			<view class="text_center f20 text_bold mt20">
				Succeeded
			</view>
			<view class="colorAf pdlr35  f12 mt8 text_center" style="line-height: 18px;">
				Warehousing on <span class="colorBlue text_bold"> shelf 1- layer 1</span> is successful Please place the
				goods at this position
			</view>


			<view class="center">
				<view class="center botBtn" @click="changePage('/pages/tab/index')">
					<image src="@/static/icons/r_back.png" class="ww24 hh24" />
					<view class="f14 ml8">
						Return
					</view>
				</view>
			</view>
		</view>

	</view>
</template>



<style lang="scss" scoped>
	.botBtn {
		width: 200px;
		height: 48px;
		background: #3178FC;
		border-radius: 48px 48px 48px 48px;
		color: #fff;
		margin-top: 120px;
	}

	.resBox {
		// height: 75px;
		background: #F6F6F7;
		border-radius: 20px 20px 20px 20px;
		margin-top: 26px;
		padding: 20px;
	}

	.content {
		background: #fff;
		min-height: 100vh;
	}
</style>
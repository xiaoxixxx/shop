<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../../comm/request.ts'
	import { showToast } from 'vant';
	import {
		useI18n
	} from "vue-i18n";
import { onShow } from '@dcloudio/uni-app';
	
	const {t}  = useI18n();
		
	const pageData = ref({
		title:"",
		content:""
	})
	
	const getData = ()=>{
		request({
			url:"/app-api/promotion/article/get",
			data:{
				id:3
			}
		}).then(res=>{
			pageData.value = res
		})
	}
	
	onShow(()=>{
		getData()
	})
</script>


<template>
	
	<view>
		<topNavbar :title="pageData.title"></topNavbar>
		
		<view class="mt20 pdlr10 pdtb20 ">
			<view class="bgF8f8 bbo10  pdlr10 pdtb10 richText">
				<view v-html="pageData.content"></view>
			</view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
</style>
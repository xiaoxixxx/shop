<script setup>
	import request from '../../comm/request.ts'

		import {ref} from 'vue'
	const shelfList = ref([
		
	])
	
	const changePage = url=>{
		uni.navigateTo({
			url
		})
	}
	
	const checkShelf  = item=>{
		uni.navigateTo({
			url:'./deatil?item='+item
		})
	}
	
const dataList = ref([
	])
	
	const paging = ref("")
	const pages = ref({
		pageNo:1,
		pageSize:10
	})
	const queryList = (page)=>{
		pages.value.pageNo = page
		request({
			url:'/admin-api/storage/overseas/goods-location/shelf-page',
			data:pages.value
		}).then(res=>{
			paging.value.complete(res.list)
			pages.value.pageNo++;
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
		    <van-text-ellipsis rows="1" content="Shelf" class="text_bold " style="width: 100%;" />
		  </view>
		  <view class="right" style="min-width: 24px;">
		   <view class="flex col_center" @click="changePage('./add')">
		    <image src="@/static/icons/add.png" class="ww24 hh24" />	 <view class="ml4 f14">Compile</view>
		   </view>
		  </view>
		</view>
		
		<view class="pdlr12 pt12">
				<z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
					:refresher-enabled="false">
					
				<view class="shelfItem  between" v-for="(item,index) in dataList">
					<view class="hasBeforeLine f16 text_bold" :class="index%3 ==0?'borderBlue':index%3 ==1?'borderGreen':'borderOrange'">
					Shelf	{{item}}
					</view>
					
					<view class="color7C f12 flex col_center" @click="checkShelf(item)">
						Check <image src="@/static/icons/g_right.png"  class="ww24 hh24"/>
					</view>
				</view>
				</z-paging>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.shelfItem{
		padding: 26px 12px;
		background: #FFFFFF;
		border-radius: 16px 16px 16px 16px;
		margin-bottom: 12px;
	}
	.hasBeforeLine::before{
		height: 16px;
		width: 4px;
	}
	.borderGreen::before{
		background: #08B171;
	}
	.borderOrange::before{
		background: #ED8C06;
	}
</style>
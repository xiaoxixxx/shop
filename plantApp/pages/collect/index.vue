<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../comm/request.ts'
	import {
		showToast
	} from 'vant';
import {HWHJStore} from '@/store/hwhj.js';
	const HWHJStoreInfo = HWHJStore()

	const noCheck = ref([
	])

	const checkedList = ref([
	])

	const deletePopInd = ref({})
	const showPopCenter = ref(false)
	// 删除
	const deleteHandle = (index) => {
		deletePopInd.value = index
		showPopCenter.value = true
		// layersList.value.splice(index, 1)
	}
	const confirmDeleteHandle = () => {
		checkedList.value.splice(deletePopInd.value, 1)
		showPopCenter.value = false
	}

// 二次验证
	const scanHandle = (code) => {
		HWHJStoreInfo.$state.NOW_VERCODE = code
		uni.navigateTo({
			url: '../home/scanCode?type=5'
		})
	}

	// 出库
	const collectHandle = () => {
		if(checkedList.value.length == 0) return
		uni.navigateTo({
			url:'./collectSuccess'
		})
	}
	
	const pickCode = computed(()=>{
		return HWHJStoreInfo.$state.PICKCODE
	})
	
	onMounted(()=>{
		// pickCode.value = window.location.href.split('pickCode=')[1]
	// 海外提货 checkedList
	noCheck.value = HWHJStoreInfo.$state.USERGOODS.filter(item=>{
		return !item.status
	})
	})
	

</script>


<template>

	<view>
		<topNavbar :title="'Collect'"></topNavbar>

		<view class="mt12 pdlr12">
			<view class="collectItem between" v-for="item in noCheck">
				<view>
					<view class="f20 text_bold colorBlue">{{item.pickupCode}}</view>
					<view class="f13 color7C flex col_center mt4">{{item.categoryName}}
						<view class="ml15">x{{item.num}}</view>
					</view>
				</view>

				<view class="rightBtn colorBlue center f14" @click="scanHandle(item.pickupCode)">
					<image src="@/static/icons/scan_blue.png" class="ww25 hh24" /> Check
				</view>
			</view>


			<view class="mt40" v-if="checkedList.length >0">
				<view class="f16 text_bold mb12">Result</view>
				<view class="collectItem between" v-for="(item,index) in checkedList">
					<view class="flex col_center">
						<view>
							<image src="@/static/icons/che_pass.png" class="ww24 hh24" v-if="item.status " />
							<image src="@/static/icons/che_fail.png" class="ww24 hh24" v-else />
						</view>
						<view class="ml8">
							<view class="f20 text_bold colorBlue">{{item.no}}</view>
							<view class="f13 color7C flex col_center mt4">
								{{item.name}}
								<view class="ml15">x{{item.count}}</view>
							</view>
						</view>
					</view>

					<view class="rightBtn colorBlue center f14"  @click="scanHandle">
						<image src="@/static/icons/scan_blue.png" class="ww25 hh24" /> Check
					</view>

				
				</view>
			</view>
		</view>

		<view class="fixedBtn">
			<view class="pdlr12 pb10">
				<view class="btns center text_white" :class="checkedList.length == 0?'disCollect':''"
					@click="collectHandle">
					Collect
				</view>
			</view>
		</view>


		<van-popup v-model:show="showPopCenter" round style="width: 280px;">
			<view class="pt30 pdlr26 ">
				<view class="f15   text_center borderB pb24">
					The verification for confirming the deletion of the failed product has failed
				</view>
			</view>
			<view class="  pdlr20 pdtb16">
				<view class="girdBtn">
					<view class="botBtn cancelBtn center color7C" @click="showPopCenter = false">Cancel</view>
					<view class="botBtn  center text_white confirmBtn" @click="confirmDeleteHandle">Confirm</view>
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
	}

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

	.deleteIcon {
		position: absolute;
		right: 0;
		top: 0;
	}

	.fixedBtn {
		position: fixed;
		bottom: 0;
		width: 100%;

		.btns {
			height: 48px;
			background: #3178FC;
			border-radius: 48px 48px 48px 48px;
			text-align: center;
			line-height: 48px;
			margin-top: 30px;
			position: relative;
		}

		.disCollect::after {
			position: absolute;
			display: block;
			content: '';
			width: 100%;
			height: 100%;
			background: rgba(255, 255, 255, 0.4);
		}
	}

	.collectItem {
		padding: 26px 12px;
		background: #F6F6F7;
		border-radius: 16px 16px 16px 16px;
		margin-bottom: 10px;
		position: relative;

		.rightBtn {
			background: #FFFFFF;
			border-radius: 50px 50px 50px 50px;
			border: 1px solid #3178FC;
			height: 32px;
			padding: 0 9px;
		}
	}
</style>
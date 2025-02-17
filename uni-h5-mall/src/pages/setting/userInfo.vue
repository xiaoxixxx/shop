<script setup>
	import topNavbar from '../../components/topNavbar/topNavbar.vue';
	import request from '../../../comm/request.ts'
	import {
		showToast
	} from 'vant';
	import {
		useI18n
	} from "vue-i18n";

	const {
		t
	} = useI18n();
</script>


<template>

	<view>
		<topNavbar :title="'测试'"></topNavbar>
	</view>
</template>


<style lang="scss" scoped>
</style>
import { defineStore } from 'pinia'
import request from '../../comm/request'
export const userStore = defineStore('userStoreDeatil', {
	// 推荐使用 完整类型推断的箭头函数
	state: () => {
		return {
			// 所有这些属性都将自动推断其类型
			counter: 0,
			name: 'Eduardo',
			isAdmin: true,

			userInfo: {
				nickname: "",
				point: "",
				avatar:"",
				mobile:""
			},
			userWallet: {

			}
		}
	},

	actions: {
		updateUserInfo(state) {
			if(uni.getStorageSync('token')){
				request({
					url: '/app-api/member/user/get'
				}).then(res => {
					this.$state.userInfo = res
				})
				request({
					url: '/app-api/pay/wallet/get'
				}).then(res => {
					this.$state.userWallet = res
				})
			}
		
		},
	},
	persist: {
	  enabled: true,
	  strategies: [
	    {
	      key: 'userInfo',
	    },
	  ],
	},
})
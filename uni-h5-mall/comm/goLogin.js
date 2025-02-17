import {
	showConfirmDialog
} from "vant";


export const goLoginDialog = (tip, msg, confirmButtonText, cancelButtonText) => {
	if (!uni.getStorageSync('token') && !uni.getStorageSync('refresh-token')) {
		showConfirmDialog({
			title: tip || 'Tips',
			message: msg || 'Login to enjoy complete services',
			confirmButtonText: confirmButtonText || 'Confirm',
			cancelButtonText: cancelButtonText || 'Cancel',
		})
			.then(() => {
				// on confirm
				let lang = uni.getStorageSync('language')
				uni.clearStorageSync()
				uni.setStorageSync('language', lang)
				uni.navigateTo({
					url: '/pages/login/login'
				})
				uni.hideLoading()
			}).finally(() => {
				return false
			})

	} else {
		return true
	}

}
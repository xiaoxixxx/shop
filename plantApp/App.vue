<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
html{
	background: #fff;
	padding-top:60rpx;
}
uni-page{
	background: #fff;
}

:deep(.van-picker__toolbar){
	// background: skyblue;
	position: relative;
	button{
		height: 44px;
		line-height: 44px;
		width: 100px;
	}
	.van-picker__cancel{
		position: absolute;
		left: 0;
	}
	.van-picker__confirm{
		position: absolute;
		right: 0;
	}
}
button::after{
	border: none;
	outline: none;
	box-shadow: none;
}
</style>


<script>
export default {
  onLaunch: function () {
  },

}
</script>

<style lang="scss">
// 去除H5页面滚动有滚动条

	@font-face {
	  font-family: 'interFontBold';
	  src: url('@/font/inter.otf') format('otf');
	  font-weight: normal;
	  font-style: normal;
	  font-display: swap;
	}
	@font-face {
	  font-family: 'semiBold';
	  src: url('@/font/semiBold.otf') format('otf');
	  font-weight: normal;
	  font-style: normal;
	  font-display: swap;
	}
	
	
	@font-face {
	  font-family: 'interFontMid';
	  src: url('@/font/interMid.otf') format('otf');
	  font-weight: Medium;
	  font-style: normal;
	  font-display: swap;
	}
	

/*每个页面公共css */
* {
  font-weight: 500;
  font-style: Medium;
}

.text_bold {
	font-family: 'interFontBold';
	font-weight: bold;
}

.semiBold{
	font-weight: 600;
	font-family: 'semiBold';
}
:deep(.van-tab--active){
	.van-tab__text{
		font-weight: 600 !important;
		font-family: 'semiBold' !important;
	}

}
.btnContent {
    height: 48px;
    background: linear-gradient(91deg, #8D45DD 0%, #8634E2 100%);
    border-radius: 8px 8px 8px 8px;
	line-height: 48px;
	font-family: 'interFontBold';
	font-weight: bold;
}
.g_poster img{
	border-radius: 20px;
}
.van-image__error, .van-image__loading{
	background: #fff !important;
}
.uni-swiper-dots-horizontal {
  bottom: 0rpx !important;
  .uni-swiper-dot {
    width: 6px;
    height: 6px;
  }
}
html {
  background-color: #fff;
  color: #090909;
}
.bgF8f8 {
  background-color: #f8f8f8;
}
uni-image {
  width: 100% !important;
  height: 100% !important;
}

.richText {
  img,
  video {
    width: 100% !important;
  }
}

.textareaContent {
  color: #000 !important;
  font-size: 14px;
}
.uni-textarea-placeholder {
  color: #ccc !important;
}
</style>

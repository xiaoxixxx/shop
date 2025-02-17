import {
	createI18n
} from "vue-i18n";
import en from "./en";
import zh from "./zh";

let lang ;
const lang123 = uni.getStorageSync('language')

try{
	lang= uni.getStorageSync('language')
	if (!uni.getStorageSync('language')) {
		uni.setStorageSync('language', 'en')
	}
}catch(e){
	//TODO handle the exception
}

// 创建i18n
const i18n = createI18n({
	locale:lang || "en", // 语言标识
	globalInjection: true, // 全局注入,可以直接使用$t
	legacy: false,
	messages: {
		en,
		zh
	}
})

uni.$zp = {
	config: {
		//配置分页默认pageSize为15
		"loading-more-default-text": i18n.global.t('paging.lmdt'),
		"loading-more-loading-text": i18n.global.t('paging.lmlt'),
		"loading-more-no-more-text": i18n.global.t('paging.lmnmt'),
		"loading-more-fail-text": i18n.global.t('paging.lmft'),
		"empty-view-text": i18n.global.t('paging.evt'),
		"empty-view-reload-text": i18n.global.t('paging.evrt'),
		"empty-view-error-text": i18n.global.t('paging.evet'),
		"loading-more-loading-icon-type":"circle"
	}
}


export default i18n;
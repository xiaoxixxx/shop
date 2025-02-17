import {
	defineConfig
} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';
import mpliveMainfestPlugin from './comm/mplive-manifest-plugin';
// // 引入等比适配插件
// const px2rem = require('postcss-px2rem')

// // 配置基本大小
// const postcss = px2rem({
// 	// 基准大小 baseSize，需要和rem.js中相同
// 	remUnit: 16,
// })
	const env = loadEnv("", __dirname, 'myApp_');
// https://vitejs.dev/config/
export default defineConfig({
	
	plugins: [
		uni(),
		AutoImport({
			imports: ['vue', 'vue-router'] //自动导入vue 和vue-router相关的函数 
		}),
			mpliveMainfestPlugin(env.SHOPRO_MPLIVE_ON)
	],
	server:{
		open:false
	},
	 css: {
	        preprocessorOptions: {
	            scss: {
					quietDeps: true,
					silenceDeprecations: ['legacy-js-api'],
	                api: 'modern-compiler', // or 'modern'
	            },
	        },
	    },
	   resolve: {
	      alias: {
	        '@': fileURLToPath(new URL('./src', import.meta.url))
	      }
	    },
	
	lintOnSave: true,
	envPrefix: "SHOPRO_",
})

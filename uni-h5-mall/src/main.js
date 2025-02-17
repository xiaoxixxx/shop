import { createApp } from "vue";
import App from "./App.vue";
import '../comm/main.scss'
import Vant from 'vant';
import 'vant/lib/index.css';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from '../locale/index.js';
import { Lazyload } from 'vant';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
import '../comm/animate.css'
// 关闭uni-app自带的路由  
// uni.$router = null  
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/en';

dayjs.locale('en');
dayjs.extend(relativeTime);
dayjs.extend(duration);

createApp(App).use(Vant).use(Lazyload).use(pinia).use(i18n).mount("#app");


	
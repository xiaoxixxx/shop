import App from './App'
import Vant from 'vant';
import 'vant/lib/index.css';

import i18n from './locale/index.js';
import './comm/main.scss';
import './comm/animate.css'
import { createSSRApp } from 'vue';

import { createPinia } from 'pinia'
const pinia = createPinia();
export function createApp() {
  const app = createSSRApp(App)
  app.use(Vant)
  app.use(i18n)
  app.use(pinia)
  return {
    app
  }
}

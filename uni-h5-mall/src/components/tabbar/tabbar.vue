<template>
  <view>

    <van-tabbar v-model="activeName" active-color="#6B34EC" inactive-color="#ccc" @change="tabSwitch" :safe-area-inset-bottom="true">
      <van-tabbar-item v-for="(tabItem,index) in List" :badge="index==2 && doubleCount >0?doubleCount:''" :dot="false"
        :key="index">
        <span class="f10 text_normal">{{tabItem.title}}</span>
        <template #icon="props">
          <img :src="props.active ? tabItem.icon : tabItem.icon2" />
        </template>
      </van-tabbar-item>

    </van-tabbar>
  </view>
</template>

<script>
import { onMounted } from 'vue';
import {
  cartStore
} from '@/store/cart';
import { useI18n } from "vue-i18n";
import { onShow } from '@dcloudio/uni-app';
export default {
  props: ['activeIndex'],
  setup(props) {
    const { t } = useI18n()
    const cartStoreDeatil = cartStore()
    const activeName = ref(0)
    activeName.value = props.activeIndex
    const List = computed(() => {
      return [{
        title: t('tabbar.home'),
        icon: '../../static/tabbar/t1.png',
        icon2: '../../static/tabbar/t11.png',
        href: '/'
      },
      {
        title: t('tabbar.classify'),
        icon: '../../static/tabbar/t2.png',
        icon2: '../../static/tabbar/t22.png',
        href: '/pages/tabbar/classify'
      },
      {
        title: t('tabbar.cart'),
        icon: '../../static/tabbar/t3.png',
        icon2: '../../static/tabbar/t33.png',
        href: '/pages/tabbar/cart'
      },
      {
        title: t('tabbar.account'),
        icon: '../../static/tabbar/t4.png',
        icon2: '../../static/tabbar/t44.png',
        href: '/pages/tabbar/my'
      }
      ]
    })
    const tabSwitch = (e, b) => {
      if (e !== props.activeIndex) {
        uni.navigateTo({
          url: List.value[e].href
        })
      }
    }
    const doubleCount = computed(() => {
      return cartStoreDeatil.$state.cartList.length
    });

    // const getDoubleCount = ()=>{
    // 	if(uni.getStorageSync('token')){
    // 		request({
    // 			url:'/app-api/trade/cart/list',
    // 		}).then(res=>{
    // 			doubleCount.value = res.validList.length
    // 		})
    // 	}
    // }
    onShow(() => {
      // getDoubleCount()
    })
    const icon = {
      active: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png',
      inactive:
        'https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png',
    };
    return {
      List,
      tabSwitch,
      activeName,
      doubleCount,
      icon
      // getDoubleCount
    }
  },
}
</script>


<style lang="scss" scoped>
	.text_normal{
		font-family: 'inter';
	}
:deep(.van-tabbar-item--active img) {
  filter: drop-shadow(2px 2px 10px #6b34ec);
}

:deep(.van-tabbar) {
  // box-shadow: 0px 0px 0px 0px rgba(0,0,0,0.7);
  border-top: 1px solid rgba(0, 0, 0, 0.07);
}
:deep(.van-tabbar){
	z-index: 99;
}
</style>
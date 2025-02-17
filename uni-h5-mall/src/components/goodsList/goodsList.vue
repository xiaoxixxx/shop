<script>
import {
  useI18n
} from "vue-i18n";
import {
  throttle
} from '../../../comm/utils.js';
import { goLoginDialog } from '../../../comm/goLogin.js';
import {
  cartStore
} from '@/store/cart';
import {
  showToast
} from 'vant';
import request from "../../../comm/request.ts";
import {
  fen2yuan
} from '../../../comm/useGoods.js';
	import goodsDeatilsPop from '../../components/pop/goodsDeatilsPop.vue';
export default {
  props: ['activeIndex', 'searchPage', 'isSearch','showTopHandle'],
	components:{
		goodsDeatilsPop
	},
  setup(props) {
    const {
      t
    } = useI18n()

    const dataList = ref([])

    // 刷新数据重新请求
    const reloadSearchData = (data) => {
      paging.value.clear()
      pages.value.pageNo = 1
      queryList(data)
    }

    const pages = ref({
      pageNo: 1,
      pageSize: 10
    })
    const paging = ref("")
    const queryList = (data) => {
      // 此处请求仅为演示，请替换为自己项目中的请求

      request({
        url: props.searchPage.url,
        methods: props.searchPage.methods,
        data: {
          ...pages.value,
          ...props.searchPage.data,
          ...data,
        }
      }).then(res => {
        try {
          paging.value.complete(res.list)
          pages.value.pageNo++;
		  if(props.showTopHandle){
			  props.showTopHandle(res.list.length > 0)
		  }
        } catch { }
      })

    }
    const goDeatil = (item) => {
      uni.navigateTo({
        url: '../goods/goodsDeatils?id=' + item.id
      })
    }

    const addToFav = (item) => {
      const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
      if (!res) return
      request({
        url: '/app-api/product/favorite/create',
        data: {
          spuId: item.id
        },
        methods: "POST"
      }).then(res => {
        item.isCollected = 1
      })
    }
    const removeToFav = (item) => {
      const res = goLoginDialog(t('com.dia_t1'), t('com.dia_t2'), t('all.con'), t('all.can'))
      if (!res) return
      request({
        url: '/app-api/product/favorite/delete',
        data: {
          spuId: item.id
        },
        methods: "DELETE"
      }).then(res => {
        item.isCollected = 0
      })
    }

    const changePage = url => {
      uni.navigateTo({
        url
      })
    }
	const goodsDeatilsPopRef = ref("")
	const deatilPageData = ref({})

	const showDeatil = (item)=>{
		uni.showLoading()
		request({
			url: '/app-api/product/spu/get-detail',
			data: {
				id:item.id
			}
		}).then(res => {
			deatilPageData.value = res
		goodsDeatilsPopRef.value.choosedList = []
			goodsDeatilsPopRef.value.showBottom = true
			uni.hideLoading()
		})
	}
    return {
      queryList,
	  goodsDeatilsPopRef,
	  deatilPageData,
	  goodsDeatilsPop,
      paging,
      dataList,
      t,
	  showDeatil,
      goDeatil,
      addToFav,
      removeToFav,
      reloadSearchData,
      fen2yuan,
      changePage,
    }
  },
}


</script>




<template>
  <view>
    <z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false" :use-page-scroll="true"
      :refresher-enabled="false" empty-view-text=" ">
      <view class="goodsList ">
        <view class="goodsItem bg_whiteGoods" v-for="(item,index) in dataList" :key="index" @click="goDeatil(item)">
			
			<view class="lovedElBox">
			  <img src="@/static/index/loved.png" class="ww24 hh24" v-if="item.isCollected"
			    @click.stop="removeToFav(item)" />
			  <img src="@/static/index/love.png" class="ww24 hh24" v-else @click.stop="addToFav(item)" />
			</view>
          <view class="">
            <view class="g_poster ">
              <van-image width="100%" height="100%" :src="item.picUrl" lazy-load >
                <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                </template>
              </van-image>

            </view>
            <view class="goods_bot">
              <view class="  f14 ">
                <van-text-ellipsis rows="1" :content="item.name" class=" default_hidden_two semiBold" />

              </view>
              <view class="mt4 color5E f10">
                {{t('goods.g_h1')}}:{{item.stock}} | {{t('goods.g_h2')}}:{{item.salesCount}}
              </view>
              <view class="mt5  f14 between">
                <view>
                  <span class="colorContent text_bold">
                    ${{ fen2yuan(item.price) }}
                  </span>
                  <del class="colorDel pl4">
                    ${{ fen2yuan(item.marketPrice) }}
                  </del>
                </view>

                <view class="addToCar text_white center" @click.stop="showDeatil(item)">
				  <img src="@/static/icons/addToCar.png" class="ww18 hh18" />
                </view>
              </view>
            </view>
          </view>

        </view>
      </view>
    </z-paging>

    <view v-if="dataList.length == 0 && isSearch" class="nullDataBoxEl">
      <view class="center flex_col nullDataEl">
        <img src="@/static/index/nullData.png" class="" />
        <view class="mt20 f20 text_bold">{{t('goods.g_h10')}}</view>
        <view class="mt12 f12 colorCCC">
          {{t('goods.g_h11')}}
        </view>
        <view class="feedBackEl center mt60 f14 text_white" @click="changePage('/pages/my/feedback')">
          <img src="@/static/my/update_w.png" class="smallIcon" />
          <view class="ml8">{{t('goods.g_h12')}}</view>
        </view>
      </view>
    </view>
	
	<goodsDeatilsPop ref="goodsDeatilsPopRef" :goodsProperty='deatilPageData'  />
  </view>
</template>


<style lang="scss" scoped>
	
.nullDataBoxEl {
  top: 240px;

  .nullDataEl {
    margin-top: 0;
  }
  .feedBackEl {
    line-height: 44px;
  }
  .smallIcon {
    width: 24px;
    height: 24px;
  }
}




</style>
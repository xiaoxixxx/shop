<script setup>
import topNavbar from '../../components/topNavbar/topNavbar.vue';
import updateHeader from '@/components/setting/updateHeader.vue';
import updateNickname from '@/components/setting/updateNickname.vue';
import updateGender from '@/components/setting/updateGender.vue';
import languagePop from '@/components/pop/languagePop.vue';
import { showToast } from 'vant';
import {
  cartStore
} from '@/store/cart';
import {
  useI18n
} from "vue-i18n";
import {
  userStore
} from '@/store/user.js';
const userStoreInfo = userStore()

const userInfo = computed(() => {
  return userStoreInfo.$state.userInfo
})
console.log(userInfo.value)
import {
  settingPlant
} from '@/store/setting.js';
const settingPlantDeatil = settingPlant();

function findObjectIndex(array, key, value) {
  return array.findIndex(obj => obj[key] === value);
}
const langName = ref("")
// console.log(findObjectIndex(settingPlantDeatil.languageList, 'value', uni.getStorageSync('language')))
langName.value = settingPlantDeatil.languageList[findObjectIndex(settingPlantDeatil.languageList, 'value', uni.getStorageSync('language'))].name
const { t } = useI18n();
const cartStoreDeatil = cartStore();

const isTopFixed = ref(false)
// 吸顶判断
const topChangeHandle = (e) => {
  isTopFixed.value = e
}
const loginOut = () => {
  let lang = uni.getStorageSync('language')
  let version = uni.getStorageSync('version')
  uni.clearStorageSync()
  uni.setStorageSync('language', lang)
  uni.setStorageSync('version', version)
  uni.navigateTo({
    url: '../login/login'
  })
}

const addStarNum = str => {
  str = String(str)
  let q = str.slice(0, 3)
  let h = str.slice(str.length - 3, str.length)
  return q + '***' + h
}

const changePage = url => {
  uni.navigateTo({
    url
  })
}

// 修改头像弹窗
const updateHeaderRef = ref("")
// 修改昵称弹窗
const updateNicknameRef = ref("")
// 修改性别
const updateGenderRef = ref("")
// 修改语言
const languagePopRef = ref("");
const updateLangName = (val) => {
  langName.value = val
}

</script>


<template>

  <view>
    <topNavbar :title="t('set.set_t1')"></topNavbar>

    <view class="pdlr12 mt20 pb12">
      <view class="settingItem pb16 between borderB">
        <view class="f14 ">
          {{t('set.set_h1')}}
        </view>
        <view class="flex col_center" @click="updateHeaderRef.showBottom = true">
          <van-image class="ww44 hh44 " :src="userInfo.avatar?userInfo.avatar:'../../static/my/def_head.png'" lazy-load
            radius="50px">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
          <img src="@/static/my/h_left.png" class="ww24 hh24">
        </view>
      </view>

      <view class="settingItem pb16 between borderB f14 pt16">
        <view class=" ">
          {{t('set.set_h2')}}
        </view>
        <view class=" flex col_center" :class="!userInfo.nickname?'colorAf':''"
          @click="updateNicknameRef.showBottom = true">
          {{userInfo.nickname? userInfo.nickname:'Modify nickname'}}
          <img src="@/static/my/h_left.png" class="ww24 hh24">
        </view>
      </view>
      <!-- 		<view class="settingItem pb16 between borderB f14 pt16">
		  <view class=" ">
		    Gender
		  </view>
		  <view class="flex col_center " @click="updateGenderRef.showBottom = true">
		    {{userInfo.sex? 'Female':'Male'}}
			<img src="@/static/my/h_left.png" class="ww24 hh24">
		  </view>
		</view> -->
      <view class="settingItem pb16 between borderB f14 pt16">
        <view class=" ">
          {{t('login.log_phone_inp')}}
        </view>
        <view class=" flex col_center" @click="changePage('./updateMobile')">
          <!-- {{userInfo.mobile? addStarNum(userInfo.mobile):"---"}} -->
		  {{userInfo.mobile?userInfo.mobile:'---'}}
          <img src="@/static/my/h_left.png" class="ww24 hh24">
        </view>
      </view>

      <view class="settingItem  between  f14 pt16">
        <view class=" ">
          {{t('set.set_h3')}}
        </view>
        <view class="flex col_center " @click="languagePopRef.showBottom = true">
          {{langName}}
          <img src="@/static/my/h_left.png" class="ww24 hh24">
        </view>
      </view>
    </view>

    <view class="bgF8f8 hh8"></view>

    <view class="pdlr12 ">
      <view class="settingItem  between borderB pb23  f14 pt16 " @click="changePage('./updatePwd')">
        <view class=" ">
          {{t('login.log_pwd_inp')}}
        </view>
        <view class="flex col_center ">
          <img src="@/static/my/h_left.png" class="ww24 hh24">
        </view>
      </view>
      <view class="settingItem  between  f14 pt9 ">
        <view class=" ">
          {{t('set.set_h4')}}
        </view>
        <view class="flex col_center ">
          V1.0.0.0
          <!-- <img src="@/static/my/h_left.png" class="ww24 hh24"> -->
        </view>
      </view>
    </view>

    <view class="absBottomBtn ">
      <view class="botBtn f14" @click="loginOut">
        {{t('set.set_h5')}}
      </view>
    </view>

    <updateHeader ref="updateHeaderRef"></updateHeader>
    <updateNickname ref="updateNicknameRef"></updateNickname>
    <updateGender ref="updateGenderRef"></updateGender>
    <languagePop ref="languagePopRef" :updateLangName="updateLangName"></languagePop>
  </view>
</template>



<style lang="scss" scoped>
.absBottomBtn {
  position: absolute;
  width: calc(100% - 24px);
  bottom: 12px;
  left: 12px;
  .botBtn {
    border-radius: 48px 48px 48px 48px;
    border: 1px solid #d7d7d7;
    height: 44px;
    text-align: center;
    line-height: 44px;
  }
}

.borderB {
  border-bottom: 1px solid rgba(239, 239, 239, 0.5);
}
</style>
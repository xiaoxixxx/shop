<template>
  <div class="shelfBox">
    <el-row :gutter="20">
      <el-col :span="20">
        <el-button @click="addNewShelf" type="primary">新增货架</el-button>
      </el-col>
    </el-row>

    <div class="gridBox3">
      <div v-for="(item,index) in shelfList" :key="index" class="gridItem"
        :class="index%3 ==0?'borderBlue':index%3 ==1?'borderGreen':'borderOrange'" @click="changePage(item)">
        <div class="flex" style="display: flex; align-items: center;">
          <img src="@/assets/imgs/icons/hg.png" style="width: 18px;height: 20px;" />
          <div style="margin-left: 10px"> Shelf {{ item }}</div>
        </div>
        <img src="@/assets/imgs/icons/right.png" style="width: 24px;height: 24px;" />
      </div>
    </div>

    <addShelfForm ref="addShelfFormRef" :getList="getList" />
  </div>
</template>



<script setup>
import * as StorageApi from '@/api/erp/index'
import addShelfForm from './addShelfForm.vue'
const route = useRoute() // 路由
const { push } = useRouter() // 路由跳转
const addShelfFormRef = ref("")

const addNewShelf = () => {
  addShelfFormRef.value.open()
}
const shelfList = ref([])
const getList = async () => {
  const res = await StorageApi.getShelfList()
  shelfList.value = res.list
}


const changePage = item => {
  push('./shelfDeatil?id=' + item)
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.shelfBox {
  background: #fff;
  margin: 20px;
  border-radius: 4px;
  padding: 30px 34px;
}
.gridBox3 {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 54px;
  .gridItem {
    padding: 0 20px;
    height: 120px;
    background: #fff;
    border: 1px solid #d6d6d6;
    line-height: 120px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .borderBlue {
    border-top: 4px solid #3178fc;
  }
  .borderGreen {
    border-top: 4px solid #08b171;
  }
  .borderOrange {
    border-top: 4px solid #ed8c06;
  }
}
</style>
<template>
  <div>
    <!-- 搜索工作栏 -->
    <ContentWrap>
      <!-- 采购列表 -->
      货架号：{{deatilsId}}
    </ContentWrap>

    <div class="shelfBox">

      <el-row :gutter="20">
        <el-col :span="12">
          <el-button type="primary" @click="dialogVisible = true">新增层级</el-button>
        </el-col>
      </el-row>

      <div class="layerItem" v-for="(item,index) in layersList" :key="index"> <span>货架层级
          {{ deatilsId +'-'+item }}</span>
        <span class="qrcodeEL" @click="showDiaLog(item)">
          QR Code</span>

        <img src="@/assets/imgs/icons/delete.png" class="deleteIcon" @click="deleteHandle(item)" />
      </div>

    </div>

    <Dialog title="新增货柜" v-model="dialogVisible">
      <el-form :model="form" label-width="auto" style="max-width: 600px">

        <el-form-item label="层级">
          <el-select v-model="addLayers" placeholder="请选择要添加的层级">
            <el-option v-for="item in showLayersList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAddHandle">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Qrcode ref="qrcodeRef" />
  </div>
</template>



<script setup >
const deatilsId = window.location.href.split('id=')[1]
import * as StorageApi from '@/api/erp/index'
import { ElMessage } from 'element-plus';
import Qrcode from './qrcode.vue';
const layersList = ref([])
const deatilData = ref({
  shelf: '',
  floorList: []
})
const layerListStatic = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const showLayersList = ref([])
const getDeatilData = async () => {
  const res = await StorageApi.getFloorList(deatilsId)
  layersList.value = res.floorList.sort((a, b) => a - b)
  showLayersList.value = findDifferentValues(layerListStatic, res.floorList)

  deatilData.value = res
}

function findDifferentValues(arr1, arr2) {
  return [
    ...arr1.filter(item => !arr2.includes(item)),
    ...arr2.filter(item => !arr1.includes(item))
  ];
}
getDeatilData()

const addLayers = ref("")
const dialogVisible = ref(false)
const submitAddHandle = async () => {
  const data = {
    shelf: deatilsId,
    floor: addLayers.value
  }
  await StorageApi.addNewShelfListLayer(data).then(res => {
    dialogVisible.value = false
    ElMessage.success('添加成功')
    addLayers.value = ""
    getDeatilData()
  }).catch(e => {
    ElMessage.error(e.msg)
  })
}

const deleteHandle = async (item) => {
  ElMessageBox.confirm('此操作会删除该货层?', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      let data = {
        shelf: deatilsId,
        floor: item
      }
      StorageApi.deleteLayerItem(data)
        .then(() => {
          ElMessage.success('删除成功')
          getDeatilData()

        })
        .catch((e) => {
          ElMessage.error(e.msg)
        })
    })
    .catch((e) => {
      console.log(e)
      ElMessage.info('取消操作')
    })
}

const qrcodeRef = ref("")
const showDiaLog = (item) => {
  let str = deatilsId + '-' + item
  qrcodeRef.value.initData(str)
}
</script>


<style lang="scss" scoped>
.qrcodeEL {
  font-size: 13px;
  color: #3178fc;
  cursor: pointer;
}
.layerItem {
  width: 360px;
  height: 48px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #d6d6d6;
  margin-top: 20px;
  padding: 0 20px;
  line-height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .deleteIcon {
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}
.shelfBox {
  background: #fff;
  margin-top: 20px;
  border-radius: 4px;
  padding: 30px 34px;
}
</style>
<template>
  <Dialog title="新增货柜" v-model="dialogVisible" v-loading="formLoading">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="货柜">
        <el-select v-model="form.shelf" placeholder="请选择货柜">
          <el-option v-for="item in shelfList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="层级">
        <el-select v-model="form.floorList" multiple placeholder="请选择要添加的层级">
          <el-option v-for="item in layersList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </Dialog>
</template>
<script lang="ts" setup>
const formLoading = ref(false)
const dialogVisible = ref(false)
import * as StorageApi from '@/api/erp/index'
import { ElMessage } from 'element-plus'

const props = defineProps({
  getList: {
    type: Function
  }
})
/** 打开弹窗 */
const shelfList = ref([])
const layersList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  const res = await StorageApi.newShelfList()
  shelfList.value = res
}

const onSubmit = async () => {
  await StorageApi.createShelf(form.value)
    .then((res) => {
      ElMessage.success('添加成功')
      props.getList()
      dialogVisible.value = false
    })
    .catch((e) => {
      dialogVisible.value = false
      form.value.shelf = ''
      form.value.floorList = []
      ElMessage.error(e.msg)
    })
}

const form = ref({
  shelf: '',
  floorList: []
})

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

onMounted(() => {})
</script>

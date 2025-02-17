<template>
  <Dialog title="新增订单" v-model="dialogVisible" v-loading="formLoading">
    <el-descriptions :column="4" border direction="vertical">
      <el-descriptions-item label=" 商品总数">{{descriptionData.totalCount}}</el-descriptions-item>
      <el-descriptions-item label="总售价">{{descriptionData.totalPrice}}</el-descriptions-item>
      <el-descriptions-item label="总支付金额">{{descriptionData.totalPay}}</el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { CommonStatusEnum } from '@/utils/constants'
import * as puchaseApi from '@/api/mall/product/purchase'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'ProductBrandForm' })
const props = defineProps({
  getList: {
    type: Function,
    default: () => {}
  }
})
const dialogVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const descriptionData = ref({
  totalCount: 0,
  totalPrice: 0,
  totalPay: 0
})
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  const res = await puchaseApi.lookPurchase()
  descriptionData.value = res
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const submitForm = async () => {
  if (descriptionData.value.totalCount == 0) {
    ElMessage({
      type: 'error',
      message: '暂无可以生成的订单'
    })
    return
  }
  formLoading.value = true

  puchaseApi.createPurchaseOrder().then((res) => {
    formLoading.value = false
    dialogVisible.value = false
    props.getList()
  })
}
</script>

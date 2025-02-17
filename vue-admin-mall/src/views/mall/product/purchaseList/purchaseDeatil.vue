<template>
  <!-- <doc-alert title="商城手册（功能开启）" url="https://doc.iocoder.cn/mall/build/" /> -->

  <!-- 搜索工作栏 -->
  <ContentWrap>
    <!-- 采购列表 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">

      <el-form-item>
        清单编号：{{topData.purchaseNumber}}
      </el-form-item>

      <el-form-item>
        商品总数：{{topData.totalCount}}
      </el-form-item>
      <el-form-item>
        创建者：{{topData.creator}}
      </el-form-item>
      <el-form-item>
        创建时间：{{topData.createTime}}
      </el-form-item>

    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" row-key="id" default-expand-all border :stripe="true">
      <el-table-column label="商品分类" prop="productCategory" />
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="productSku" align="center" prop="id" />
      <el-table-column label="商品规格" align="center" prop="商品规格" />
      <el-table-column label="采购数量" align="center" prop="purchaseNumber" />
      <el-table-column label="售价" align="center" prop="price" />
      <el-table-column label="平均支付金额" align="center" prop="avgPay" />
      <el-table-column label="入库状态" align="center" prop="purchaseStoreStatus">
        <template #default="scope">
          <span
            :style="{color: WarehouseStatus[scope.row.purchaseStoreStatus||0].color}">{{ WarehouseStatus[scope.row.purchaseStoreStatus||0].name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台收货地址" align="center" prop="address" />
      <el-table-column label="供应商物流单号" align="center" prop="logisticsNumber" />
      <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column label="创建时间" align="center" prop="createTime" />

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openDialog(scope.row)">
            填写单号
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total=" total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <Dialog title="填写单号" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" v-loading="formLoading">
      <el-form-item label="采购项单号" prop="logisticsNumber">
        <el-input v-model="formData.logisticsNumber" placeholder="请输入采购项单号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as puchaseApi from '@/api/mall/product/purchase'
import router from '@/router'

import { ElMessage } from 'element-plus'

const WarehouseStatus = {
  0: {
    name: '未入库',
    color: '#FF7171'
  },
  1: {
    name: '入库完成',
    color: '#409EFF'
  }
}

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  id: window.location.href.split('id=')[1]
})
const queryFormRef = ref() // 搜索的表单

const topData = ref({})
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await puchaseApi.getPurchaseListItem(queryParams)
    const topDeatil = await puchaseApi.getPurchaseListDeatil(queryParams.id)
    topData.value = topDeatil
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const openDialog = (data) => {
  console.log(data)
  formData.value.id = data.id
  formData.value.logisticsNumber = data.logisticsNumber
  dialogVisible.value = true
}
const formLoading = ref(false)
const dialogVisible = ref(false)
const formData = ref({
  logisticsNumber: '',
  id: ''
})
const formRules = reactive({
  logisticsNumber: [{ required: true, message: '采购项单号不能为空', trigger: 'blur' }]
})
const formRef = ref('')
const submitForm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  await puchaseApi.fillPurchaseItemOrder(formData.value).then((res) => {
    ElMessage({
      type: 'success',
      message: '提交成功'
    })

    dialogVisible.value = false
    getList()
  })
  formLoading.value = false
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

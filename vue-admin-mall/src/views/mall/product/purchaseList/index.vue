<template>
  <!-- <doc-alert title="商城手册（功能开启）" url="https://doc.iocoder.cn/mall/build/" /> -->

  <!-- 搜索工作栏 -->
  <ContentWrap>
    <!-- 采购列表 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">

      <el-form-item>

        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['product:brand:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增采购订单
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" row-key="id" default-expand-all>
      <el-table-column label="清单编号" prop="purchaseNumber" />
      <el-table-column label="商品总数" align="center" prop="totalCount" />
      <el-table-column label="总售价" align="center" prop="totalPrice" />
      <el-table-column label="总支付金额" align="center" prop="totalPay" />
      <el-table-column label="采购状态" align="center" prop="id">
        <template #default="scope">
          <span
            :style="{color: purchaseStatus(scope.row.purchaseStatus).color}">{{ purchaseStatus(scope.row.purchaseStatus).name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="入库状态" align="center" prop="id">
        <template #default="scope">
          <span
            :style="{color: WarehouseStatus(scope.row.storeStatus).color}">{{ WarehouseStatus(scope.row.storeStatus).name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="creator" />
      <el-table-column label="创建时间" align="center" prop="createTime" />

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="getDeatilPop( scope.row.id)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total=" total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <PurchaseForm ref="formRef" @success="getList" :getList="getList" />

</template>
<script lang="ts" setup>
import * as puchaseApi from '@/api/mall/product/purchase'
import { purchaseStatus, WarehouseStatus } from './status.ts'
// defineOptions({ name: 'ProductBrand' })
import PurchaseForm from './purchaseForm.vue'
const route = useRoute() // 路由
const { push } = useRouter() // 路由跳转

const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await puchaseApi.getPurchaseList(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const getDeatilPop = (id) => {
  push('purchaseDeatil?id=' + id)
}
/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ProductBrandApi.deleteBrand(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

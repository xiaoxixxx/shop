<template>
  <!-- <doc-alert title="商城手册（功能开启）" url="https://doc.iocoder.cn/mall/build/" /> -->

  <!-- 搜索工作栏 -->
  <ContentWrap>
    <!-- 采购列表 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item>
        <div style="padding-left: 30px; display: flex;">
          <div v-for="(item,index) in typeList" :key="index" class="gridItem"
            :class="activeTypeInd==index?'activeEl':''" @click="handleClick(item,index)">
            <div>{{ item.name }}</div>
          </div>
        </div>

      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" row-key="id" default-expand-all>
      <el-table-column label="订单流水号" prop="orderNo" />
      <el-table-column label="商品名称" align="center" prop="categoryName" />
      <el-table-column label="商品数量" align="center" prop="num" />
      <el-table-column label="货品状态" align="center" prop="statusInfo" />

      <el-table-column label="操作人" align="center" prop="operatorName" />
      <el-table-column label="时间" align="center" prop="time">
        <template #default="scope">
          {{ timestampToTime(scope.row.operateTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="printOrder(scope.row.id)">
            打印面单
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total=" total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->

</template>
<script lang="ts" setup>
import * as StorageApi from '@/api/erp/index'

const route = useRoute() // 路由
const { push } = useRouter() // 路由跳转

const message = useMessage() // 消息弹窗

function timestampToTime(timestamp) {
  var date = new Date(timestamp)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var seconds = date.getSeconds()
  var time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  return time
}

const activeTypeInd = ref(0)
const handleClick = (item, index) => {
  queryParams.status = item.type
  activeTypeInd.value = index
  getList()
}

const typeList = ref([])
const getTypeList = async () => {
  const res = await StorageApi.getHWStatusList()
  typeList.value = res
  typeList.value
  getList()
}
getTypeList()
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  status: 0
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StorageApi.getHWStatusListPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const printOrder = (id) => {
  console.log(id)
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
  // getList()
})
</script>

<style lang="scss" scoped>
.gridItem {
  font-size: 14px;
  margin-right: 100px;
  padding-bottom: 10px;
  cursor: pointer;
}
.activeEl {
  position: relative;
  color: #409eff;
}
.activeEl::after {
  display: block;
  position: absolute;
  content: '';
  bottom: 10px;
  background: #409eff;
  width: 80%;
  height: 3px;
  border-radius: 50px;
}
</style>

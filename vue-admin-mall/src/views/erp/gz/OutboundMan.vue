<template>
  <!-- <doc-alert title="商城手册（功能开启）" url="https://doc.iocoder.cn/mall/build/" /> -->

  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-button type="primary">导出</el-button>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" row-key="id" default-expand-all
      @selection-change="handleSelectionChange">
      <el-table-column label="包装编号" prop="no" type="selection" />
      <el-table-column label="仓储类型" align="center" prop="storageTypeName" />
      <el-table-column label="商品数量" align="center" prop="num" />
      <el-table-column label="操作人" align="center" prop="creatorName" />
      <el-table-column label="时间" align="center" prop="time">
        <template #default="scope">
          {{ timestampToTime(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="getDeatilsInfo(scope.row.id)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total=" total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <Dialog title="出库详情" v-model="dialogVisible" v-loading="formLoading">

    <el-row :gutter="20" style="color: #409EFF;">
      <el-col :span="12">
        <div class="grid-content ep-bg-purple text-center">仓储类型：{{DeatilsData.storageTypeName}} </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple text-center">
          商品总数：{{ DeatilsData.num }}
        </div>
      </el-col>

    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="12">
        <div class="grid-content ep-bg-purple text-center color-primary">商品类目 </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple text-center">
          商品数量
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;color: #7C7C7C" v-for="(item,index) in DeatilsData.itemList" :key="index">
      <el-col :span="12">
        <div class="grid-content ep-bg-purple text-center color-primary">{{item.categoryName}} </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple text-center">
          {{item.num}}
        </div>
      </el-col>
    </el-row>
    <!-- <el-descriptions :column="4" border direction="vertical">
      <el-descriptions-item label=" 商品总数">3</el-descriptions-item>
      <el-descriptions-item label="总售价">2</el-descriptions-item>
      <el-descriptions-item label="总支付金额">1</el-descriptions-item>
    </el-descriptions> -->

    <template #footer>
      <el-button @click="cancelOutbound">取消出库</el-button>
      <el-button @click="printOrderHandle" type="primary" :disabled="formLoading">打印面单</el-button>

    </template>
  </Dialog>

</template>
<script lang="ts" setup>
import * as StorageApi from '@/api/erp/index'

// defineOptions({ name: 'ProductBrand' })
import PurchaseForm from './purchaseForm.vue'
import { ElMessageBox } from 'element-plus'
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

const handleSelectionChange = async (e) => {
  console.log(e)
}

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
    const data = await StorageApi.outboundPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const dialogVisible = ref(false)
const formLoading = ref(false)
const DeatilsData = ref({})
const getDeatilsInfo = async (id) => {
  dialogVisible.value = true
  formLoading.value = true
  const data = await StorageApi.getOutboundDeatil(id)
  DeatilsData.value = data
  formLoading.value = false
}

const cancelOutbound = () => {
  // ElMessageBox.confirm({
  //   title: '提示',
  //   message: '是否取消出库',
  //   success: (e) => {
  //     console.log(e)
  //   }
  // })

  ElMessageBox.confirm('此操作会取消出库?', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async () => {
      let data = {
        outboundId: DeatilsData.value.id
      }
      StorageApi.cancelOutbound(data)
        .then(() => {
          message.success('取消出库成功')
          dialogVisible.value = false
          getList()
        })
        .catch((e) => {
          message.error(e.msg)
        })
    })
    .catch((e) => {
      console.log(e)
      message.info('取消操作')
      dialogVisible.value = false
    })
}

const printOrderHandle = () => {}

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
    await StorageApi.deleteBrand(id)
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

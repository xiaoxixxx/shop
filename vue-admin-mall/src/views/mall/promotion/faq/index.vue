<template>
  <doc-alert title="【营销】内容管理" url="https://doc.iocoder.cn/mall/promotion-content/" />

  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="80px">
      <!-- <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="queryParams.categoryId" class="!w-240px" placeholder="全部" @keyup.enter="handleQuery">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="queryParams.title" class="!w-240px" clearable placeholder="请输入文章标题"
          @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择状态">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime"
          :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" class="!w-240px" end-placeholder="结束日期"
          start-placeholder="开始日期" type="daterange" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />
          搜索
        </el-button> -->
        <!-- <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button> -->
        <el-button v-hasPermi="['promotion:article:create']" plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="ID" min-width="180" prop="id" />
      <el-table-column align="center" label="问题" min-width="180" prop="answer" />
      <el-table-column align="center" label="答案" min-width="180" prop="question" />
      <el-table-column align="center" fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button v-hasPermi="['promotion:article:update']" link type="primary"
            @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button v-hasPermi="['promotion:article:delete']" link type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.pageNo" :total="total"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <FAQForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as QuestionsApi from '@/api/mall/promotion/faq'
import FAQForm from './FAQForm.vue'
import { createImageViewer } from '@/components/ImageViewer'

defineOptions({ name: 'PromotionArticle' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  categoryId: undefined,
  title: null,
  status: undefined,
  spuId: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
/** 文章封面预览 */
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    urlList: [imgUrl]
  })
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await QuestionsApi.getQuestionsPage(queryParams)
    list.value = data
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
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
    await QuestionsApi.deleteQuestions(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

onMounted(async () => {
  await getList()
  // 加载分类、商品列表
})
</script>

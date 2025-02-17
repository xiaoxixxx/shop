<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="70%">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="问题" prop="question">
            <el-input v-model="formData.question" placeholder="请输入问题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="答案" prop="answer">
            <el-input v-model="formData.answer" placeholder="请输入答案" type="textarea" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="问题(英语)" prop="adminQuestionTranslations.questionEn">
            <el-input v-model="formData.adminQuestionTranslations.questionEn" placeholder="请输入问题(英语)" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="答案(英语)" prop="adminAnswerTranslations.answerEn">
            <el-input v-model="formData.adminAnswerTranslations.answerEn" placeholder="请输入答案(英语)" type="textarea" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="问题(法语)" prop="adminQuestionTranslations.questionFr">
            <el-input v-model="formData.adminQuestionTranslations.questionFr" placeholder="请输入问题(法语)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="答案(法语)" prop="adminAnswerTranslations.answerFr">
            <el-input v-model="formData.adminAnswerTranslations.answerFr" placeholder="请输入答案(法语)" type="textarea" />
          </el-form-item>
        </el-col>

        <!-- adminQuestionTranslations -->
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as QuestionsApi from '@/api/mall/promotion/faq'
import { SpuSelect } from '@/views/mall/promotion/components'

defineOptions({ name: 'PromotionArticleForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  answer: '',
  question: '',
  adminQuestionTranslations: {
    questionEn: '',
    questionFr: ''
  },
  adminAnswerTranslations: {
    answerEn: '',
    answerFr: ''
  }
})
const formRules = reactive({
  answer: [{ required: true, message: '答案不能为空', trigger: 'blur' }],
  question: [{ required: true, message: '问题不能为空', trigger: 'blur' }],
  'adminQuestionTranslations.answerEn': [
    { required: true, message: '答案不能为空(英语)', trigger: 'blur' }
  ],

  'adminQuestionTranslations.answerFr': [
    { required: true, message: '答案不能为空(法语)', trigger: 'blur' }
  ],

  'adminAnswerTranslations.questionEn': [
    { required: true, message: '问题不能为空(英语)', trigger: 'blur' }
  ],

  'adminAnswerTranslations.questionFr': [
    { required: true, message: '问题不能为空(法语)', trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await QuestionsApi.getQuestions(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as QuestionsApi.FaqVO
    if (formType.value === 'create') {
      await QuestionsApi.createQuestions(data)
      message.success(t('common.createSuccess'))
    } else {
      await QuestionsApi.updateQuestions(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    answer: '',
    question: '',
    adminQuestionTranslations: {
      questionEn: '',
      questionFr: ''
    },
    adminAnswerTranslations: {
      answerEn: '',
      answerFr: ''
    }
  }
  formRef.value?.resetFields()
}

onMounted(async () => {})
</script>

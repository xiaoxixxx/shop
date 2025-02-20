<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入内容" type="textarea" />
      </el-form-item>

      <el-form-item label="名称(法语)" prop="propertyNameTranslation.nameFr">
        <el-input v-model="formData.propertyNameTranslation.nameFr" placeholder="请输入内容" type="textarea" />
      </el-form-item>

      <el-form-item label="备注(法语) " prop="propertyRemarkTranslation.remarkFr">
        <el-input v-model="formData.propertyRemarkTranslation.remarkFr" placeholder="请输入内容" type="textarea" />
      </el-form-item>

      <el-form-item label="名称(英语)" prop="propertyNameTranslation.nameEn">
        <el-input v-model="formData.propertyNameTranslation.nameEn" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="备注(英语)" prop="propertyRemarkTranslation.remarkEn">
        <el-input v-model="formData.propertyRemarkTranslation.remarkEn" placeholder="请输入名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as PropertyApi from '@/api/mall/product/property'

defineOptions({ name: 'ProductPropertyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  name: '',
  remark: '',
  propertyNameTranslation: {
    nameEn: '',
    nameFr: ''
  },
  propertyRemarkTranslation: {
    remarkEn: '',
    remarkFr: ''
  }
})
const formRules = reactive({
  name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  'propertyNameTranslation.nameEn': [
    { required: true, message: '名称不能为空(英语)', trigger: 'blur' }
  ],
  'propertyNameTranslation.nameFr': [
    { required: true, message: '名称不能为空(法语)', trigger: 'blur' }
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
      formData.value = await PropertyApi.getProperty(id)
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
    const data = formData.value as PropertyApi.PropertyVO
    if (formType.value === 'create') {
      await PropertyApi.createProperty(data)
      message.success(t('common.createSuccess'))
    } else {
      await PropertyApi.updateProperty(data)
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
    name: '',
    remark: '',
    propertyNameTranslation: {
      nameEn: '',
      nameFr: ''
    },
    propertyRemarkTranslation: {
      remarkEn: '',
      remarkFr: ''
    }
  }
  formRef.value?.resetFields()
}
</script>

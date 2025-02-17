<!-- 商品发布 - 基础设置 -->
<template>
  <el-form ref="formRef" :disabled="isDetail" :model="formData" :rules="rules" label-width="180px">
    <el-form-item label="商品名称" prop="name">
      <el-input
v-model="formData.name" :autosize="{ minRows: 2, maxRows: 4 }" :clearable="true" :show-word-limit="true"
        class="w-300!" maxlength="200" placeholder="请输入商品名称" type="textarea" />
    </el-form-item>

    <el-form-item label="商品名称(法语)" prop="nameTranslations.nameFr">
      <el-input
v-model="formData.nameTranslations.nameFr" :autosize="{ minRows: 2, maxRows: 4 }" :clearable="true"
        :show-word-limit="true" class="w-300!" maxlength="200" placeholder="请输入商品名称(法语)" type="textarea" />
    </el-form-item>

    <el-form-item label="商品名称(英语)" prop="nameTranslations.nameEn">
      <el-input
v-model="formData.nameTranslations.nameEn" :autosize="{ minRows: 2, maxRows: 4 }" :clearable="true"
        :show-word-limit="true" class="w-300!" maxlength="200" placeholder="请输入商品名称(英语)" type="textarea" />
    </el-form-item>

    <el-form-item label="商品分类" prop="categoryId">
      <el-cascader
v-model="formData.categoryId" :options="categoryList" :props="defaultProps" class="w-80" clearable
        filterable placeholder="请选择商品分类" />
    </el-form-item>
    <!-- <el-form-item label="商品品牌" prop="brandId">
      <el-select v-model="formData.brandId" class="w-80" placeholder="请选择商品品牌">
        <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id as number" />
      </el-select>
    </el-form-item> -->
    <el-form-item label="商品关键字" prop="keyword">
      <el-input v-model="formData.keyword" class="w-300!" placeholder="请输入商品关键字" />
    </el-form-item>

    <el-form-item label="商品关键字(法语)" prop="keywordTranslations.keywordFr">
      <el-input v-model="formData.keywordTranslations.keywordFr" class="w-300!" placeholder="请输入商品关键字(法语)" />
    </el-form-item>
    <el-form-item label="商品关键字(英语)" prop="keywordTranslations.keywordEn">
      <el-input v-model="formData.keywordTranslations.keywordEn" class="w-300!" placeholder="请输入商品关键字(英语)" />
    </el-form-item>

    <el-form-item label="仓储类型" prop="storageType">
      <el-select v-model="formData.storageType" class="w-80!" placeholder="请选择商品类型">
        <el-option v-for="item in ckTypeList" :key="item.value" :label="item.name" :value="item.value as number" />
      </el-select>
    </el-form-item>
    <el-form-item label="商品简介" prop="introduction">
      <el-input
v-model="formData.introduction" :autosize="{ minRows: 2, maxRows: 4 }" :clearable="true"
        :show-word-limit="true" class="w-300!" maxlength="200" placeholder="请输入商品简介" type="textarea" />
    </el-form-item>

    <el-form-item label="商品简介(法语)" prop="introduction">
      <el-input
v-model="formData.introductionTranslations.introductionFr" :autosize="{ minRows: 2, maxRows: 4 }"
        :clearable="true" :show-word-limit="true" class="w-300!" maxlength="200" placeholder="请输入商品简介(法语)"
        type="textarea" />
    </el-form-item>
    <el-form-item label="商品简介(英语)" prop="introductionTranslations.introductionEn">
      <el-input
v-model="formData.introductionTranslations.introductionEn" :autosize="{ minRows: 2, maxRows: 4 }"
        :clearable="true" :show-word-limit="true" class="w-300!" maxlength="200" placeholder="请输入商品简介(英语)"
        type="textarea" />
    </el-form-item>

    <el-form-item label="商品重量(计算运费的重量 单位千克)" prop="spuWeight">
      <el-input v-model="formData.spuWeight" class="w-80!" placeholder="请输入商品重量(计算运费的重量 kg)" />
    </el-form-item>
    <el-form-item label="商品体积(计算运费的体积 单位厘米)" prop="spuVolume">
      <el-input v-model="formData.spuVolume" class="w-80!" placeholder="请输入商品体积(计算运费的体积 cm)" />
    </el-form-item>
    <el-form-item label="商品来源链接" prop="sourceUrl">
      <el-input v-model="formData.sourceUrl" class="w-80!" placeholder="请输入商品商品来源链接" />
    </el-form-item>
  
    <el-form-item label="是否授权" prop="authorized">
      <el-radio-group v-model="formData.authorized">
        <el-radio :value="1">已授权</el-radio>
        <el-radio :value="0">未授权</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="多少份起售" prop="startSale">
      <el-input-number v-model="formData.startSale" :min="1" />
    </el-form-item>

    <el-form-item label="规格/材质（）" prop="proIntro">
    
      <div >
        <el-tag 
        class="mr-2"
      v-for="tag in formData.proIntro"
      :key="tag"
      closable
      size="large"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="large"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="large" @click="showInput">
      + 添加
    </el-button>
    <div>
      <div>
        <el-alert :closable="false">
          例如:品牌:华为 输入(品牌-华为 )
        </el-alert>
      </div>
    </div>
        </div>
    </el-form-item>
    <el-form-item label="商品封面图" prop="picUrl">
      <UploadImg v-model="formData.picUrl" :disabled="isDetail" height="80px" />
    </el-form-item>
    <el-form-item label="商品轮播图" prop="sliderPicUrls">
      <UploadImgs v-model="formData.sliderPicUrls" :disabled="isDetail" />
    </el-form-item>

    <el-form-item label="商品视频轮播" prop="sliderVideoUrls">
      <UploadVideo v-model="formData.sliderVideoUrls" :disabled="isDetail" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'
import { copyValueToTarget } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import { defaultProps, handleTree } from '@/utils/tree'
import type { Spu } from '@/api/mall/product/spu'
import * as ProductCategoryApi from '@/api/mall/product/category'
import type { InputInstance } from 'element-plus'
import { CategoryVO } from '@/api/mall/product/category'
import * as ProductBrandApi from '@/api/mall/product/brand'
import { BrandVO } from '@/api/mall/product/brand'

defineOptions({ name: 'ProductSpuInfoForm' })
const props = defineProps({
  propFormData: {
    type: Object as PropType<Spu>,
    default: () => {}
  },
  isDetail: propTypes.bool.def(false) // 是否作为详情组件
})

const message = useMessage() // 消息弹窗
let proIntroArr = ref([])
const InputRef = ref<InputInstance>()
const inputVisible = ref(false)

const inputValue = ref('')
const handleClose = (tag: string) => {
  formData.proIntro.splice(formData.proIntro.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {

  if (inputValue.value.length > 1) {
    if(!inputValue.value.includes('-')){
    ElMessage.info('请输入 - 来区分字段')
    return 
  }
  formData.proIntro.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}



const formRef = ref() // 表单 Ref
const formData = reactive<Spu>({
  name: '', // 商品名称
  categoryId: undefined, // 商品分类
  keyword: '', // 关键字
  picUrl: '', // 商品封面图
  sliderPicUrls: [], // 商品轮播图
  introduction: '', // 商品简介
  // brandId: undefined, // 商品品牌
  storageType: undefined,
  spuWeight: 0,
  spuVolume: 0,
  sourceUrl: '',
  authorized: 1,
  sliderVideoUrls: [],
  proIntro:[],
  startSale: 1, //多少份起售
  nameTranslations: {
    nameEn: '',
    nameFr: ''
  },
  keywordTranslations: {
    keywordEn: '',
    keywordFr: ''
  },
  introductionTranslations: {
    introductionEn: '',
    introductionFr: ''
  }
})
const rules = reactive({
  name: [required],
  categoryId: [required],
  picUrl: [required],
  sliderPicUrls: [required],
  storageType: [required],
  authorized: [required],
  startSale: [required],
  'nameTranslations.nameEn': [required],
  'nameTranslations.nameFr': [required],
  spuWeight: [required],
  spuVolume: [required],
  sourceUrl: [required]
})

const ckTypeList = [
  {
    name: '危险品',
    value: 0
  },
  {
    name: '电池',
    value: 1
  },
  {
    name: '粉末',
    value: 2
  },
  {
    name: '液体',
    value: 3
  },
  {
    name: '易碎/不能压',
    value: 4
  },
  {
    name: '普货',
    value: 5
  }
]

/** 将传进来的值赋值给 formData */
watch(
  () => props.propFormData,
  (data) => {
    if (!data) {
      return
    }
    copyValueToTarget(formData, data)
  },
  {
    immediate: true
  }
)

/** 表单校验 */
const emit = defineEmits(['update:activeName'])
const validate = async () => {
  if (!formRef) return

  // formData.proIntro = formData.proIntro
  try {
    await unref(formRef)?.validate()
    // 校验通过更新数据
    Object.assign(props.propFormData, formData)
  } catch (e) {
    message.error('【基础设置】不完善，请填写相关信息')
    emit('update:activeName', 'info')
    throw e // 目的截断之后的校验
  }
}
defineExpose({ validate })

/** 初始化 */
const brandList = ref<BrandVO[]>([]) // 商品品牌列表
const categoryList = ref<CategoryVO[]>([]) // 商品分类树
onMounted(async () => {
  // 获得分类树

  const data = await ProductCategoryApi.getCategoryList({})
  categoryList.value = handleTree(data, 'id')
  // 获取商品品牌列表
  brandList.value = await ProductBrandApi.getSimpleBrandList()
})
</script>

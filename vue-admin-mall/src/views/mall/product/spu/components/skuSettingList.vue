<template>
  <div>

    <el-table border :data="tableData" class="tabNumWidth" max-height="500" style="width: 100%;">
      <el-table-column align="center" label="图片" min-width="65">
        <template #default="{ row }">
          <UploadImg v-model="row.picUrl" height="50px" width="50px" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品条码" min-width="168">
        <template #default="{ row }">
          <el-input v-model="row.barCode" class="w-100%" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售价" min-width="168">
        <template #default="{ row }">
          <el-input-number v-model="row.price" :min="0" :precision="2" :step="0.1" class="w-100%"
            controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="市场价" min-width="168">
        <template #default="{ row }">
          <el-input-number v-model="row.marketPrice" :min="0" :precision="2" :step="0.1" class="w-100%"
            controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="成本价" min-width="168">
        <template #default="{ row }">
          <el-input-number v-model="row.costPrice" :min="0" :precision="2" :step="0.1" class="w-100%"
            controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" min-width="168">
        <template #default="{ row }">
          <el-input-number v-model="row.stock" :min="0" class="w-100%" controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量(kg)" min-width="168">
        <template #default="{ row }">
          <el-input-number v-model="row.weight" :min="0" :precision="2" :step="0.1" class="w-100%"
            controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="体积(m^3)" min-width="195">
        <template #default="{ row }">
          <el-input-number v-model="row.volume" :min="0" :precision="2" :step="0.1" class="w-100%"
            controls-position="right" />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="80">
        <template>
          <el-tag>占位字符</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-form label-width="120px" :inline="true" style="margin-top: 10px;">
      <el-form-item v-for="(item,index) in setPropertyList" :key="index" :label="item.name">
        <el-select v-model="item.selected" multiple :placeholder="`请选择`+item.name" style="width: 240px">
          <el-option v-for="ite in item.values" :key="ite.id" :label="ite.name" :value="ite.id" multiple />
        </el-select>

      </el-form-item>
      <el-button type="primary" size="large" @click="confirmHandle" min-width="150">确认修改</el-button>

    </el-form>
  </div>
</template>


<script setup>
import { ElMessage } from 'element-plus';
import generateCombinations from './skuSettingListUtil.js'
const props = defineProps({
  updateOneSelectVal: {
    type: Function
  },
  propertyList: {
    type: Array
  }
})

const tableData = ref([
  {
    price: 0, // 商品价格
    marketPrice: 0, // 市场价
    costPrice: 0, // 成本价
    barCode: '', // 商品条码
    picUrl: '', // 图片地址
    stock: 0, // 库存
    weight: 0, // 商品重量
    volume: 0, // 商品体积
  }
])

const imgUrl = ref("")
const selectionList = ref([
  {
    title: '商品条码',
    name: 'barCode',
    value: 0
  },
  {
    title: '商品销售价格',
    name: 'price',
    value: 0
  },
  {
    title: '商品市场价格',
    name: 'marketPrice',
    value: 0
  },
  {
    title: '商品成本价格',
    name: 'costPrice',
    value: 0
  },
  {
    title: '商品库存',
    name: 'stock',
    value: 0
  },
  {
    title: '商品重量(kg)',
    name: 'weight',
    value: 0
  },
  {
    title: '商品体积(m^3)',
    name: 'volume',
    value: 0
  },

])

const confirmHandle = () => {
  const updateTo = setPropertyList.value.filter(item => item.selected && item.selected.length > 0);
  if (updateTo.length === 0) {
    ElMessage.error('请选择要修改的属性');
    return;
  }

  // 检查是否有有效的值输入
  const firstRow = tableData.value[0];
  const valuesObj = Object.keys(firstRow).reduce((obj, key) => {
    const value = firstRow[key];
    if (value > 0 || value) {
      obj[key] = value;
    }
    return obj;
  }, {});

  if (Object.keys(valuesObj).length === 0) {
    ElMessage.error('请输入要修改的值');
    return;
  }

  // 构建结果数组
  const result = updateTo.map(item => {
    const tempObj = {
      name: item.name,
      selectTemp: item.selected.map(ite => {
        const valueItem = item.values.find(v => v.id === ite);
        return valueItem ? { propertyId: item.id, valueId: ite } : null;
      }).filter(Boolean) // 移除null值
    };
    return tempObj;
  });

  // 转换结果格式
  const result2 = result.map(item => item.selectTemp.map(temp => ({
    propertyName: item.name,
    propertyId: temp.propertyId,
    valueId: temp.valueId
  })));

  // 假设generateCombinations函数是已定义的，用于生成组合
  const result3 = generateCombinations(result2);

  // 每次成功清空值
  // selectionList.value.forEach(item => item.value = 0)
  // setPropertyList.value.forEach(item => item.selected = [])


  props.updateOneSelectVal({
    selectedArr: result3,
    valuesObj
  })
}
const setPropertyList = ref([])
watch(props.propertyList, val => {
  setPropertyList.value = val
}, {
  deep: true,
  immediate: true
})

defineExpose({
  setPropertyList
})
</script>
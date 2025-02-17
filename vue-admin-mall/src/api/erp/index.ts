import request from '@/config/axios'

/**
 * 商品属性
 */
export interface PropertyVO {
  id?: number
  /** 名称 */
  name: string
  /** 备注 */
  remark?: string
}

/**
 * 属性值
 */
export interface StatusValueVO {
  /** 属性项的编号 */
  type?: number
  /** 名称 */
  name: string
}

// ------------------------ 属性项 -------------------

// 状态列表
export const getStatusList = (data: StatusValueVO) => {
  return request.get({ url: '/storage/local/goods/status-list' })
}

// 货品列表
export const getStorageGoodsList = (data: PropertyVO) => {
  return request.get({ url: '/storage/local/goods/page', params:data })
}

// 出库列表
export const outboundPage = (data:Object) => {
  return request.get({ url: `/storage/local/goods/outbound/page`,params:data  })
}

// 获取出库详情
export const getOutboundDeatil = (id: number): Promise<PropertyVO> => {
  return request.get({ url: `/storage/local/goods/outbound/detail/${id}` })
}

// 取消出库
export const cancelOutbound = (data: Object) => {
  return request.put({ url: '/storage/local/goods/outbound/cancel', data })
}



// 获得货柜列表
export const getShelfList = () => {
  return request.get({ url: '/storage/overseas/goods-location/shelf-page' })
}

// 创建货柜
export const createShelf = (data) => {
  return request.post({ url: '/storage/overseas/goods-location/create-shelf',data })
}

// 获取可创建货柜详情
export const newShelfList = () => {
  return request.get({ url: '/storage/overseas/goods-location/new-shelf-list/' })
}

// 添加单个货层
export const addNewShelfListLayer = (data) => {
  return request.post({ url: '/storage/overseas/goods-location/create-floor',data })
}


// 获取可用货层
export const getFloorList = (data) => {
  return request.get({ url: '/storage/overseas/goods-location/floor-list/'+data, })
}

// 删除单个货层
export const deleteLayerItem = (data) => {
  return request.delete({ url: '/storage/overseas/goods-location/delete-floor?shelf='+data.shelf+'&floor='+data.floor })
}


// 海外仓获取状态列表
export const getHWStatusList = () => {
  return request.get({ url: '/storage/overseas/goods/status-list'})
}

// 海外仓获取数据
export const getHWStatusListPage = (data) => {
  return request.get({ url: '/storage/overseas/goods/page',params:data})
}
// ------------------------ 属性值 -------------------

// 获得属性值分页
export const getPropertyValuePage = (params: PageParam & any) => {
  return request.get({ url: '/product/property/value/page', params })
}

// 获得属性值
export const getPropertyValue = (id: number): Promise<PropertyValueVO> => {
  return request.get({ url: `/product/property/value/get?id=${id}` })
}

// 创建属性值
export const createPropertyValue = (data: PropertyValueVO) => {
  return request.post({ url: '/product/property/value/create', data })
}

// 更新属性值
export const updatePropertyValue = (data: PropertyValueVO) => {
  return request.put({ url: '/product/property/value/update', data })
}

// 删除属性值
export const deletePropertyValue = (id: number) => {
  return request.delete({ url: `/product/property/value/delete?id=${id}` })
}

// 获得属性值精简列表
export const getPropertyValueSimpleList = (propertyId: number): Promise<PropertyValueVO[]> => {
  return request.get({ url: '/product/property/value/simple-list', params: { propertyId } })
}



import request from '@/config/axios'

/**
 * 商品品牌
 */
export interface BrandVO {
  /**
   * 品牌编号
   */
  id?: number
  /**
   * 品牌名称
   */
  name: string
  /**
   * 品牌图片
   */
  picUrl: string
  /**
   * 品牌排序
   */
  sort?: number
  /**
   * 品牌描述
   */
  description?: string
  /**
   * 开启状态
   */
  status: number
}


// 获得采购订单列表
export const getPurchaseList = (params: PageParam) => {
  return request.get({ url: '/purchase/page', params })
}
// 获得采购订单列表
export const getPurchaseListDeatil = (id: number) => {
  return request.get({ url: `/purchase/getPurchaseOrderById?id=${id}` })
}

// 创建预览采购订单
export const lookPurchase = () => {
  return request.get({ url: '/purchase/look' })
}


// 创建采购订单
export const createPurchaseOrder = () => {
  return request.get({ url: '/purchase/createPurchaseOrder' })
}


// 获得采购订单下的采购项
export const getPurchaseListItem = (data: number) => {
  return request.get({ url: `/purchase/get`,params:data })
}
// 填写单号
export const fillPurchaseItemOrder = (data:Object) => {
  return request.post({ url: '/purchase/fill',data })
}

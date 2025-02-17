// 定义枚举
 enum PurchaseStatusEnum {
  NOT = 0, // 未采购
  SOME = 1, // 部分采购
  FIN = 2, // 采购完成
}
 
 const purchaseStatusObj: { [key in PurchaseStatusEnum]: { name: string; color: string } } = {
  [PurchaseStatusEnum.NOT]: {
    name: '未采购',
    color: '#FF7171'
  },
  [PurchaseStatusEnum.SOME]: {
    name: '部分采购',
    color: '#FFAA00'
  },
  [PurchaseStatusEnum.FIN]: {
    name: '采购完成',
    color: '#409EFF'
  }
 };


 const WarehouseStatusObj: { [key in PurchaseStatusEnum]: { name: string; color: string } } = {
  [PurchaseStatusEnum.FIN]: {
    name: '入库完成',
    color: '#409EFF'
  },
  [PurchaseStatusEnum.SOME]: {
    name: '部分入库',
    color: '#FFAA00'
  },
  [PurchaseStatusEnum.NOT]: {
    name: '未入库',
    color: '#FF7171'
  }
};

 
// 类型安全的获取状态函数
 export const purchaseStatus = (status: PurchaseStatusEnum): { name: string; color: string } | undefined => {
  return purchaseStatusObj[status];
 }

// 类型安全的获取状态函数
export const WarehouseStatus = (status: PurchaseStatusEnum): { name: string; color: string } | undefined => {
  return WarehouseStatusObj[status];
 }

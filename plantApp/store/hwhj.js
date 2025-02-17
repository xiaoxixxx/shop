import { defineStore } from 'pinia'
export const HWHJStore = defineStore('HWHJStore', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => {
        return {
            // 所有这些属性都将自动推断其类型
            LAYERSLIST: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			default_shelf:[],
			warehouseList:[],
			PICKCODE:"",
			USERGOODS:[],
			NOW_VERCODE:"",
			USERSUCCESSGOODS:[]  //用户成功收货的列表
        }
    },
    actions: {
	
    },
})
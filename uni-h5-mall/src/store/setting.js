import { defineStore } from 'pinia'
export const settingPlant = defineStore('settingPlant', {
	// 推荐使用 完整类型推断的箭头函数
	state: () => {
		return {
			// 所有这些属性都将自动推断其类型
			languageList: [
				{
					  name:"English",
					  value:'en',
					  areaCode:"44",
					  ind:0
				},
				{
					  name:"Française",
					  value:'fr',
					  areaCode:"33",
					  ind:1
				}
			],
		}
	},
	actions: {
	},
})
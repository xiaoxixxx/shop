import { defineStore } from 'pinia';
import request from '../../comm/request'
	import { showToast } from 'vant';
export const cartStore = defineStore('cartStoreDeatilId', {
	// 推荐使用 完整类型推断的箭头函数
	state: () => {
		return {
			// 所有这些属性都将自动推断其类型
			cartList: [
				
			],
			invalidList:[],//失效的列表
			cartDeatils:{},
			classifyList:[],
			chooseTag:[''],
			orderInfo:"",
			chooseAddress:false,
			chooseAddressId:0
		}
	},
	actions: {
		addToCart(obj) {
			this.cartList.push(obj)
		},
		celByCart(obj) {
			this.cartList.shift(obj)
		},
		getCarList(){
			request({
				url:'/app-api/trade/cart/list'
			}).then(res=>{
				this.$state.cartList = res.validList
				this.$state.invalidList = res.invalidList
			})
		},
		addToCar(data){
			request({
				url:'/app-api/trade/cart/add',
				methods:'POST',
				data
			}).then(res=>{
				showToast('Added successfully')
				this.getCarList()
			})
		}
	},
	persist: {
	  enabled: true,
	  strategies: [
	    {
	      key: 'cartStoreDeatil',
	    },
	  ],
	},
})
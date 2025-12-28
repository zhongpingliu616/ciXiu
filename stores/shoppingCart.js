import { defineStore } from 'pinia';
export const shoppingCartStore = defineStore('shoppingCart',() => {
	let commodityList = reactive([
			{
				id:6546516212651,
				title: "古韵民族丝绸非遗刺绣1" ,
				tags:['假一赔四','7天无理由退换'],
				price: "￥666.66",
				count: "3" ,
				image: '/static/images/index/logo.png'
			},{
				id:6546516212652,
				title: "古韵民族丝绸非遗刺绣2" ,
				tags:['假一赔四','7天无理由退换'],
				price: "￥666.66", 
				count: "3" ,
				image: '/static/images/index/logo.png'
			},{
				id:6546516212653,
				title: "古韵民族丝绸非遗刺绣3" , 
				tags:['假一赔四','7天无理由退换'], 
				price: "￥666.66",
				count: "3" ,
				image: '/static/images/index/logo.png'
			},{
				id:6546516212654,
				title: "古韵民族丝绸非遗刺绣4" ,
				tags:['假一赔四','7天无理由退换'], 
				price: "￥666.66",
				count: "3" ,
				image: '/static/images/index/logo.png'
			},{
				id:6546516212655,
				title: "古韵民族丝绸非遗刺绣5" ,
				tags:['假一赔四','7天无理由退换'],
				price: "￥666.66",
				count: "3" ,
				image: '/static/images/index/logo.png'
			},
	]);
	function increment(item) {
			this.commodityList.push(item);
		}
	function reduce(id=1234567890) {
		  const rdIndex = this.commodityList.findIndex(item => item.id === id);
		  if (index !== -1) {
		    this.commodityList.splice(rdIndex, 1);
		  }
		}
	return { commodityList, reduce, increment };
});
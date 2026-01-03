<template>
<view class="work-all">
	<BaseProductList
	:col-num="2"
	:enableLoadMore="true"
	@click="handleProductItem"
	:api="fetchProductList"
	>
	</BaseProductList>
 </view>	
</template>

<script setup name="WorkAllXn">


const handleProductItem = ({index,item})=>{
		console.log("点击绣娘全部产品",index, item);
	};
const fetchProductList = async (page, pageSize) => {
	  await new Promise(resolve => setTimeout(resolve, 800))
	
	  const mockData = Array.from({ length: pageSize }, (_, i) => ({
		id: (page - 1) * pageSize + i + 1,
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		artist: '李柳柳',
		title: '东方美学 | 绣春花',
		price: 666.66
	  }))
	
	  const hasMore = page < 3 // 模拟第3页后无更多
	
	  return {
		list: mockData,
		hasMore
	  }
	}
</script>

<style lang="scss" scoped>
</style>
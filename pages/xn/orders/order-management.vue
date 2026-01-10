<template>
	<view class="page-wrap order-management">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<CxTabs
			 :tabItems="ordersTabLabel"
			 :scrollable="true"
			 lineHeight="5"
			 lineWidth="56rpx"
			 :itemStyle="{
				 padding:'2rpx 25rpx'
			 }"
			 :activeStyle="{
				 color: '#fff'
			 }"
			 :lineBg="lineBg"
			 v-model="currentWorkIndex"
			 class="order-management-tabs"
			 />
		  <view class="orders-list">
			  <keep-alive>
			    <XnOrdersOrderListComponent :status="currentStatus" :key="currentWorkIndex" />
			  </keep-alive>
		  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="orderManagement">
let title = ref("订单管理");	
let currentWorkIndex = ref(0);

const tabsConfig = [
	{ name: '全部', status: null },
	{ name: '待支付', status: 10 },
	{ name: '待发货', status: 20 },
	{ name: '待收材料', status: 30 },
	{ name: '待发成品', status: 40 },
	{ name: '待接收成品', status: 50 },
	{ name: '待验收', status: 60 },
	{ name: '验收成功', status: 70 },
	{ name: '验收失败', status: 80 },
	{ name: '已取消', status: 90 }
];

let ordersTabLabel = ref(tabsConfig.map(item => ({ name: item.name })));

let lineBg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAICAMAAACMAFxIAAAAzFBMVEUAAAD4KBv/gFf5eVn4Kxz4LB35LB38elf8fVj8fVr7elj4Kx38fFn8elf8fVn4Khz4LR78elf8fVn4LR74Kx34LB74LR74Lh/4MCD4MSH4MiL4NCP5NST5Nyb5OSf5Oij5PCn5Piv5QCz5Qi75RC/5RjD5SDL5SjP6TDX6Tjb6UDj6Ujr6VDv6Vj36WD76WkD6XEH6XkP7YET7Ykb7ZEf7Zkn7aEr7akv7bE37bk77b0/7cVH7c1L8dFP8dlT8d1X8eFb8elf8e1j8fFlwxwMgAAAAFHRSTlMAJiYora2tra2tru7u8fHz8/Pz9A5jUGUAAABISURBVBgZlcFBDoAgDATAbW00QnyP/z9qvPAYawhU/QI7IxDLi4wq3kMkJWGcrtMKyj5rBikpWF1vkJrGA8pR7fO2GUZdUd8fzbgT1C1Y/jMAAAAASUVORK5CYII='

const currentStatus = computed(() => {
	return tabsConfig[currentWorkIndex.value].status;
});

onLoad((options) => {
	if (options.tabIndex) {
		currentWorkIndex.value = Number(options.tabIndex);
	}
});
</script>

<style lang="scss" scoped>
:deep(.order-management-tabs){
	width: 100%;
	overflow: hidden;
}
.orders-list{
	overflow: hidden;
}
.page-content {
  height: 100%; 
  display: grid;
  grid-template-rows: auto 1fr;
  box-sizing: border-box;
}
.page-wrap{
	grid-template-rows: 80rpx 1fr 0rpx;
}
</style>
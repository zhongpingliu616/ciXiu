<template>
	<view class="page-wrap recharge-record">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="withdrawal-list">
				<u-cell-group :border="false">
					<u-cell
						v-for="(item, index) in withdrawalList"
						:key="index"
						:title="item.type_name"
						:label="item.create_time"
						:border-bottom="true"
						:titleStyle="{ fontSize: '18rpx', fontWeight: 'bold' }"
						:custom-style="{ padding: '16rpx 24rpx' }"
					>
						<!-- 右侧状态标签 -->
						<template #right-icon>
							<view class="refund-amount" @click="handleClick(item)">
								<view class="status-type">
									{{ item.amount }}
								</view> 
								<view class="status-type" :style="{ color: getStatusColors(item.status),fontSize:'12rpx' }">
									{{ getStatusType(item.status) }}
								</view>
							</view>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
			
				<u-empty
				v-if="!withdrawalList.length" 
				image="/static/images/common/empty.png" 
				text="暂无提现记录~" 
				:icon-size="150"
				></u-empty>
		</view>
	 <view>	</view>
	</view>
</template>


<script setup name="withdrawal-record">
import { depositOrderLists } from '@/api/xn.js'
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
let title = ref("充值记录");	
// 模拟数据
const withdrawalList = ref([
//   {
//     "id": 2,
// 	"order_no": "emd2026011223061322954",
// 	"amount": "5000.00",
// 	"status": 0,
// 	"create_time": "2026-01-12 23:06:13",
// 	"remark": "",
// 	"type_name": "微信"
//   }
])
const getStatusColors = (status) => {
  if (status == 0) return '#036BF2'
  if (status == 1) return '#666666'
  if (status.includes(2)) return '#CA3C3B'
  return '#CA3C3B'
};
const statusColors = {
  'warning': '#036BF2',
  'success': '#666666',
  'error': '#CA3C3B'
}
// 根据状态返回 tag 类型
const getStatusType = (status) => {
  if (status === 0) return '交易进行中'
  if (status === 1) return '已完成'
  if (status.includes(2)) return '失败'
  return '失败'
}
// 点击事件处理函数
const handleClick = (item) => {
		return;
   uni.navigateTo({
    url: `/pages/xn/income/withdraw-cash-detail?id=${item.id}&order_no=${item.order_no}`
  })
}
onMounted(async () => {
  const {code,data={},msg} = await depositOrderLists({
    page_no: 1,
    page_size: 10,
  });
  if(code === 200){
    withdrawalList.value = data.lists || []
  } else {
    uni.showToast(msg)
  }
})
</script>

<style lang="scss" scoped>
.withdrawal-list {
  background-color: #fff;
  border-radius: 20rpx;
}
.refund-amount{
	text-align: right;
}
/* 自定义金额颜色 */
.u-cell__value {
  color: #e60000; /* 负金额用红色 */
  font-weight: bold;
}

/* 时间样式 */
.u-cell__label {
  font-size: 24rpx;
  color: #999;
}
.page-wrap{
	grid-template-rows: v-bind(safeTopValue) 1fr 0rpx;
}		
	
</style>
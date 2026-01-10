<template>
	<view class="page-wrap withdrawal-record">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="withdrawal-list">
				<u-cell-group :border="false">
				<u-cell
					v-for="(item, index) in withdrawalList"
					:key="index"
					:title="item.title"
					:label="item.time"
					:border-bottom="true"
					:titleStyle="{ fontSize: '18rpx', fontWeight: 'bold' }"
					:custom-style="{ padding: '16rpx 24rpx' }"
				>
					<!-- 右侧状态标签 -->
					<template #right-icon>
					<view class="refund-amount">
						{{ item.amount }}
						<br/>
						<view class="status-type" :style="{ color: statusColors[item.statusColor] }">
							{{ item.status }}
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
	 <view>	</view>>
	</view>
</template>


<script setup name="withdrawal-record">
let title = ref("提现记录");	
// 模拟数据
const withdrawalList = ref([
  {
    title: '余额提现到银行卡',
    amount: '-10.00',
    time: '2025-12-29 21:49:37',
    status: '交易进行中',
	statusColor: 'warning'
  },
  {
    title: '余额提现到微信',
    amount: '-10.00',
    time: '2025-12-29 21:49:37',
    status: '已完成',
	statusColor: 'success'
  },
  {
    title: '余额提现到支付宝',
    amount: '-10.00',
    time: '2025-12-29 21:49:37',
    status: '打款失败，请检查收款方式',
	statusColor: 'error'
  }
])
const statusColors = {
  'warning': '#036BF2',
  'success': '#666666',
  'error': '#CA3C3B'
}
// 根据状态返回 tag 类型
const getStatusType = (status) => {
  if (status === '交易进行中') return 'warning'
  if (status === '已完成') return 'success'
  if (status.includes('失败')) return 'error'
  return 'info'
}	
</script>

<style lang="scss" scoped>
.withdrawal-list {
  background-color: #fff;
  border-radius: 20rpx;
}
.refund-amount{
	text-align: right;
	color: #117D5B;
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
	grid-template-rows: 80rpx 1fr 0rpx;
}		
	
</style>
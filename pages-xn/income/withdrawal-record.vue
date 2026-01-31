<template>
	<view class="page-wrap withdrawal-record">
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
							{{ item.amount }}
							<br/>
							<view class="status-type" :style="{ color: getStatusColors(item.status),fontSize:'12rpx' }">
								{{ getStatusText(item.status) }}
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
import { withdrawalOrderLists } from '@/api/xn'
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
let title = ref("提现记录");	
// 模拟数据
const withdrawalList = ref([
//   {
//     type_name: '余额提现到银行卡',
//     amount: '-10.00',
//     create_time: '2025-12-29 21:49:37',
//     status: 0,
// 	statusColor: 'warning'
//   }
])
const getStatusColors = (status) => {
  if (status == 0) return '#036BF2'
  if (status == 1) return '#666666'
  if (status == 2) return '#CA3C3B'
  return '#CA3C3B'
};
// 根据状态返回 tag 类型
const getStatusType = (status) => {
  if (status == 0) return 'warning'
  if (status == 1) return 'success'
  if (status == 2) return 'error'
  return 'error'
}
// 点击提现详情
const handleClick = (item) => {
  uni.navigateTo({
    url: `/pages-xn/income/withdraw-cash-detail?id=${item.id}&order_no=${item.order_no}`
  })
}
// 根据状态返回 状态文本
const getStatusText = (status) => {
  if (status == 0) return '交易进行中'
  if (status == 1) return '已完成'
  if (status == 2) return '打款失败，请检查收款方式'
  return '打款失败'
}

onMounted(() => {
  getWithdrawalOrderLists()
})
// 获取提现订单列表
const getWithdrawalOrderLists = async()=>{
  const { code=9999, data,msg } = await withdrawalOrderLists();
  if (code === 200) {
    if(data?.lists.length>0){
      withdrawalList.value = data.lists;
  } else {
    uni.showToast({
      title: msg || '获取提现记录失败',
      icon: 'none'
    });
  }
}
};
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
<template>
	<view class="page-wrap withdraw-cash-detail">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="detail-item">
				<view class="label">提现订单号</view>
				<view class="value">{{ detailData.order_no }}</view>
			</view>
			<view class="detail-item">
				<view class="label">提现金额</view>
				<view class="value">{{ detailData.amount }}</view>
			</view>
			<view class="detail-item">
				<view class="label">提现时间</view>
				<view class="value">{{ detailData.create_time }}</view>
			</view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="withdrawDashDetail">
import { depositOrderDetails } from '@/api/index'
let title = ref('提现订单详情')
let detailData = ref({})
onLoad(async (options) => {
  const { id, order_no } = options
  const { code, data } = await depositOrderDetails({ id, order_no })
  if (code == 200) {
    title.value = data.order_no
    detailData.value = data.lists
  }
})
</script>

<style lang="scss" scoped>
	
.page-wrap{
	grid-template-rows: 80rpx 1fr 0rpx;
}		
	
</style>
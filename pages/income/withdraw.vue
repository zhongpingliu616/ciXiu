<template>
	<view class="page-wrap withdraw-page">
		<LayoutNavigation title="提现" />
		<view class="page-content">
			<view class="section-title">到账银行卡</view>
			<view class="bank-card-select">
				<view class="bank-info">
					<u-icon name="rmb-circle-fill" color="#E60012" size="50rpx" customStyle="margin-right: 20rpx"></u-icon>
					<text class="bank-name">中国银行</text>
				</view>
				<view class="arrival-time">
					<text>1-3个工作日到账</text>
					<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
				</view>
			</view>
			<view class="withdraw-amount-card">
				<view class="card-title">提现金额</view>
				<view class="amount-tips">
					<view class="amount-tips-left">
						
						<view class="input-row">
							<text class="currency-symbol">￥</text>
							<!-- <input 
								class="amount-input" 
								type="digit" 
								v-model="amount" 
								placeholder="0.00"
								placeholder-style="color: #ccc; font-size: 32rpx;"
							/> -->
							<up-input
							  class="amount-input"
							  type="digit" 
							  v-model="amount"
							  placeholder="0.00"
							  placeholder-style="color: #ccc; font-size: 32rpx;"
							  border="none"
						  ></up-input>
						</view>
					</view>
					<view class="amount-tips-right">
						<view class="withdraw-all" @click="handleWithdrawAll">全部提现</view>
						<view class="available">可用余额 ￥3000.00</view>
					</view>
				</view>
			</view>

			<view class="submit-btn">
				<CxComfirmBtn 
					text="提现" 
					:btnStyle="{
						background: '#FF4D4F', 
						color: '#fff', 
						height: '90rpx',
						fontSize: '32rpx',
						borderRadius: '100rpx'
					}"
					@click="handleSubmit"
				></CxComfirmBtn>
			</view>
		</view>
	</view>
</template>

<script setup>
const amount = ref('6666');

const handleWithdrawAll = () => {
	amount.value = '3000.00';
};

const handleSubmit = () => {
	if (!amount.value || parseFloat(amount.value) <= 0) {
		uni.showToast({
			title: '请输入有效金额',
			icon: 'none'
		});
		return;
	}
	// 提交提现逻辑
	uni.showLoading({ title: '处理中...' });
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '提现申请已提交',
			icon: 'success'
		});
		setTimeout(() => {
			uni.navigateTo({
				url:'/pages/income/refund-detail'
			})
			// uni.navigateBack();
		}, 1500);
	}, 1500);
};
</script>

<style lang="scss" scoped>
.withdraw-page {
}
.amount-tips-right{
	white-space: nowrap;
	text-align: right;
}
.page-content {
	padding: 30rpx;
}

.section-title {
	font-size: 30rpx;
	color: #fff;
	margin-bottom: 20rpx;
}
.bank-info {
	display: flex;
	align-items: center;
	
	.bank-name {
		font-size: 30rpx;
		color: #333;
		font-weight: bold;
	}
}

.arrival-time {
	display: flex;
	align-items: center;
	
	text {
		font-size: 26rpx;
		color: #999;
		margin-right: 10rpx;
	}
}
.bank-card-select {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.card-title {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 40rpx;
}
.currency-symbol {
	font-size: 48rpx;
	color: #333;
	font-weight: bold;
	margin-right: 10rpx;
}
:deep(.uni-input-input){
	font-size: 42rpx;
}
:deep(.u-input__content__field-wrapper__field){
	height: 62rpx;
}
.amount-input {
  height: 62rpx;
  font-size: 88rpx;
  font-weight: bold;
  color: #333;
}
.input-row {
	display: flex;
	align-items: baseline;
	border-bottom: 1px solid #eee;
}

.amount-tips {
	display: flex;
	justify-content: space-between;
	font-size: 26rpx;
	
	.available {
		color: #999;
	}
	
	.withdraw-all {
		color: #1F5994; // 蓝色链接色
	}
}
.withdraw-amount-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 60rpx;
}

.submit-btn {
	margin-top: 40rpx;
}
</style>

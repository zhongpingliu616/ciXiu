<template>
	<view class="page-wrap withdraw-page">
		<LayoutNavigation title="提现" />
		<view class="page-content">
			<view class="section-title">提现方式</view>
			<view class="bank-card-select" @click="handleShowWithdrawMethod">
				<view class="bank-info">
					<template v-if="selectedMethod">
						<template v-if="selectedMethod.id === 'alipay' || selectedMethod.id === 'wechat'">
							<u-icon :name="selectedMethod.icon" :color="selectedMethod.color" size="50rpx" customStyle="margin-right: 20rpx"></u-icon>
						</template>
						<template v-else>
							<image :src="selectedMethod.icon" mode="aspectFit" style="width: 50rpx; height: 50rpx; margin-right: 20rpx;"></image>
						</template>
						<text class="bank-name">{{ selectedMethod.name }}</text>
					</template>
					<template v-else>
						<text class="bank-name">请选择提现方式</text>
					</template>
				</view>
				<view class="arrival-time">
					<text v-if="selectedMethod">1-3个工作日到账</text>
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
	<CxModal
		v-model:show="showMethodModal"
		title="选择提现方式"
	>
		<view class="method-list">
			<view 
				class="method-item" 
				v-for="(item, index) in withdrawMethods" 
				:key="index"
				@click="handleSelectMethod(item)"
			>
				<view class="method-info">
					<u-icon :name="item.icon" :color="item.color" :size="item.size || '50rpx'" customStyle="margin-right: 20rpx"></u-icon>
					<text class="method-name">{{ item.name }}</text>
				</view>
				<view class="method-check" v-if="selectedMethod && selectedMethod.id === item.id">
					<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="40rpx"></u-icon>
				</view>
			</view>
		</view>
	</CxModal>
</template>

<script setup neme="withdrawXn">
import zhongguoIcon from '@/static/images/bankLogo/zhongguo.svg';
import jiansheIcon from '@/static/images/bankLogo/jianshe.svg';
import gongshangcon from '@/static/images/bankLogo/gongshang.svg';
import zhaoshangIcon from '@/static/images/bankLogo/zhaoshang.svg';
import nongyeIcon from '@/static/images/bankLogo/nongye.svg';
const amount = ref('600.00');
const showMethodModal = ref(false);

const withdrawMethods = ref([
	{ id: 'alipay', name: '支付宝', icon: 'zhifubao-circle-fill', color: '#1296db' },
	{ id: 'wechat', name: '微信', icon: 'weixin-fill', color: '#07c160' },
	{ id: 'zhongguo', name: '中国银行', icon: zhongguoIcon, color: '#07c160', size: '40rpx' },
	{ id: 'jianshe', name: '建设银行', icon: jiansheIcon, color: '#07c160', size: '40rpx' },
	{ id: 'gongshang', name: '工商银行', icon: gongshangcon, color: '#07c160', size: '30rpx' },
	{ id: 'zhaoshang', name: '招商银行', icon: zhaoshangIcon, color: '#07c160', size: '30rpx' },
	{ id: 'nongye', name: '农业银行', icon: nongyeIcon, color: '#07c160', size: '40rpx' }
]);

const selectedMethod = ref(withdrawMethods.value[0]); // 默认选中第一个

const handleShowWithdrawMethod = () => {
	showMethodModal.value = true;
};

const handleSelectMethod = (item) => {
	selectedMethod.value = item;
	showMethodModal.value = false;
};

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
				url:'/pages/xn/income/refund-detail'
			})
			// uni.navigateBack();
		}, 1500);
	}, 1500);
};
</script>

<style lang="scss" scoped>
:deep(.modal-btn){
	display: none;
}
.method-list{
	max-height: 500rpx;
	overflow-y: auto;
}
.method-info{
	display: flex;
	align-items: center;
}
.method-item{
	display: flex;
    justify-content: space-between;
    align-items: center;
	margin-bottom: 20rpx;
}
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

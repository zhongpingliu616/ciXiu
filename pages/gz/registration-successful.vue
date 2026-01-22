<template>
	<view class="page-wrap registration-successful">
		<LayoutNavigationGz title="报名成功" />
		
		<!-- Top Section with Icon and Success Text -->
		<view class="status-header">
			<!-- Placeholder for the Gift Icon -->
			<view class="icon-placeholder">
				<uni-icons type="checkbox-filled" size="100" color="#fff"></uni-icons>
			</view>
			<text class="status-text success-text">恭喜！报名成功</text>
			<!-- <up-text type="error" align="center" size="32rpx" text="报名失败，活动已结束"></up-text> -->
			<text class="status-text fail-text">报名失败，活动已结束</text>
		</view>

		<view class="page-content">
			<view class="info-card">
				<view class="card-title">
					<view class="red-bar"></view>
					<text class="title-text">报名信息</text>
				</view>
				
				<view class="info-list">
					<view class="info-item">
						<text class="label">活动名称</text>
						<view class="value-wrap">
							<text class="value">双十二 · 线下展会</text>
							<uni-icons type="right" size="14" color="#999"></uni-icons>
						</view>
					</view>
					<view class="info-item">
						<text class="label">姓名</text>
						<text class="value">{{ info.name }}</text>
					</view>
					<view class="info-item">
						<text class="label">手机号</text>
						<text class="value">{{ maskPhone(info.phone) }}</text>
					</view>
					<view class="info-item">
						<text class="label">报名时间</text>
						<text class="value">{{ registrationTime }}</text>
					</view>
					<view class="info-item border-none">
						<text class="label">身份证号</text>
						<text class="value">{{ maskIdCard(info.idCard) }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-btn">
			<CxComfirmBtn
				text="返回首页"
				@click="goHome"
			/>
				<!-- <view class="footer-fail-group">
					<CxComfirmBtn
						:btnStyle="{
							background:'transparent',
							color:'#F3D89E'
						}"
						text="返回首页"
						@click="goHome"
					/> &nbsp;&nbsp; 
					<CxComfirmBtn
						text="看看其他"
						@click="goHome"
					/>
				</view> -->
		</view>
	</view>
</template>

<script setup name="registrationSuccessful">
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const info = reactive({
	name: '',
	phone: '',
	idCard: ''
})

const registrationTime = ref('')

onLoad((options) => {
	if (options) {
		info.name = decodeURIComponent(options.name || '')
		info.phone = options.phone || ''
		info.idCard = options.idCard || ''
	}
	// Set current time as registration time
	const now = new Date()
	registrationTime.value = formatTime(now)
})

const goHome = () => {
	uni.reLaunch({
		url: '/pages/index'
	})
}

// Helper to mask phone number: 183******88
const maskPhone = (phone) => {
	if (!phone) return ''
	return phone.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2')
}

// Helper to mask ID card: 530**********2221
const maskIdCard = (idCard) => {
	if (!idCard) return ''
	if (idCard.length === 18) {
		return idCard.replace(/(\d{3})\d{11}(\d{4})/, '$1***********$2')
	}
	return idCard // Fallback for non-standard length
}

// Helper to format time: YYYY-MM-DD HH:mm:ss
const formatTime = (date) => {
	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hour = date.getHours().toString().padStart(2, '0')
	const minute = date.getMinutes().toString().padStart(2, '0')
	const second = date.getSeconds().toString().padStart(2, '0')
	return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
</script>

<style lang="scss" scoped>
.page-wrap {
	/* Blue top background and Red pattern bottom background */
	background-image: url("/static/images/collection-detail/collection-detail-top-bg.png"), url("/static/images/index/bg.png");
	background-repeat: no-repeat, no-repeat;
	background-position: top center, center;
	background-size: 100% 600rpx, cover;
	background-color: #f5f5f5; /* Fallback */
	
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.status-header {
	padding-top: 40rpx;
	padding-bottom: 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	
	.icon-placeholder {
		margin-bottom: 30rpx;
		/* You can add a background image here if you have the gift box asset */
	}
	.fail-text {
		display: none;
		color: #FF4141;
	}
	.status-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
		letter-spacing: 2rpx;
	}
}

.page-content {
	flex: 1;
	padding: 0 30rpx;
	margin-top: -20rpx; /* Slight overlap if needed, or just standard spacing */
}

.info-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
	
	.red-bar {
		width: 8rpx;
		height: 32rpx;
		background: #FF4141;
		margin-right: 16rpx;
		border-radius: 4rpx;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
}

.info-list {
	width: 100%;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center; /* Center align for arrow consistency */
	padding: 30rpx 0;
	font-size: 28rpx;
	border-bottom: 1rpx solid #eee;
	
	&.border-none {
		border-bottom: none;
	}
	
	.label {
		color: #999;
		flex-shrink: 0;
	}
	
	.value-wrap {
		display: flex;
		align-items: center;
	}
	
	.value {
		color: #333;
		font-weight: 500;
		text-align: right;
	}
}
.footer-fail-group {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.footer-btn {
	padding: 20rpx 30rpx 80rpx;
}
</style>

<template>
	<view class="page-wrap customer-service">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="card-container">
				<!-- Stack Layers -->
				<view class="stack-layer layer-2"></view>
				<view class="stack-layer layer-1"></view>
				
				<!-- Main Card -->
				<view class="service-card">
					<view class="avatar-wrapper">
						<image class="avatar" :src="configStore.config.kefu_avatar || '/static/images/public_logo.png'" mode="aspectFill" />
					</view>
					
					<view class="info-content">
						<view class="service-name">客服人员：{{ configStore.config.kefu_name || '李老师' }}</view>
						
						<view class="qr-section">
							<view class="blur-bg"></view>
							<!-- Use a placeholder QR code if none provided in config -->
							<image 
								class="qr-code" 
								:src="configStore.config.kefu_qrcode || 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example'" 
								mode="widthFix" 
								@click="previewImage"
							/>
						</view>
						
						<view class="scan-hint">扫描二维码识别添加客服微信</view>
						
						<view class="phone-row" @click="makeCall">
							<text class="label">客服电话：</text>
							<text class="number">{{ configStore.config.kefu_phone || '0871-6666666' }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="fixed-bottom">
			<CxComfirmBtn 
				text="拨打电话" 
				@click="makeCall"
				:btnStyle="{
					background: 'rgba(255, 255, 255, 0.25)',
					border: '1px solid rgba(255, 255, 255, 0.3)',
					backdropFilter: 'blur(10px)',
					color: '#FFFFFF',
					height: '88rpx',
					borderRadius: '44rpx',
					fontSize: '32rpx'
				}"
			/>
		</view>
	 <view></view>
	</view>
</template>

<script setup name="customerService">
import { useConfigStore } from '@/stores/configStore'

const title = ref('帮助与客服')
const configStore = useConfigStore()

const makeCall = () => {
	const phoneNumber = configStore.config.kefu_phone || '0871-6666666'
	uni.makePhoneCall({
		phoneNumber: phoneNumber
	})
}

const previewImage = () => {
	const url = configStore.config.kefu_qrcode
	if (url) {
		uni.previewImage({
			urls: [url]
		})
	}
}
</script>

<style lang="scss" scoped>
.page-wrap {
	grid-template-rows: 80rpx 1fr 0rpx;
}

.page-content {
	flex: 1;
	display: flex;
	justify-content: center;
	padding-top: 120rpx; // Space for avatar overlap
	padding-bottom: 200rpx;
}

.card-container {
	position: relative;
	width: 630rpx;
	margin: 0 auto;
}

.service-card {
	position: relative;
	z-index: 10;
	background: linear-gradient(135deg, #F3EAFF 30%, #fff 50%, #EDEBFD 70%);
	border-radius: 30rpx;
	padding: 0 40rpx 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
}

.stack-layer {
	position: absolute;
	width: 100%;
	height: calc(100% - 140rpx);
	background: rgba(255, 255, 255, 0.3);
	border-radius: 30rpx;
}

.layer-1 {
	z-index: 9;
	top: 0rpx;
	left: 20rpx;
	width: calc(100% - 40rpx);
}

.layer-2 {
	z-index: 8;
	top: 22rpx;
	left: 40rpx;
	width: calc(100% - 80rpx);
	background: rgba(255, 255, 255, 0.15);
}

.avatar-wrapper {
	margin-top: -60rpx;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 6rpx solid #fff;
	overflow: hidden;
	box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
	background: #fff;
	position: relative;
	z-index: 11;
}

.avatar {
	width: 100%;
	height: 100%;
}

.info-content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 30rpx;
}

.service-name {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 50rpx;
}

.qr-section {
	position: relative;
	width: 340rpx;
	height: 340rpx;
	margin-bottom: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.qr-code {
	width: 300rpx;
	height: 300rpx;
	position: relative;
	z-index: 2;
}

.blur-bg {
	position: absolute;
	width: 120%;
	height: 120%;
	background: radial-gradient(circle, rgba(135, 206, 250, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
	z-index: 1;
	filter: blur(20px);
	top: -10%;
	left: -10%;
}

.scan-hint {
	font-size: 24rpx;
	color: #9F8CEB;
	margin-bottom: 60rpx;
}

.phone-row {
	display: flex;
	align-items: center;
	justify-content: center;
}

.label {
	font-size: 34rpx;
	color: #7B68EE;
	font-weight: bold;
}

.number {
	font-size: 38rpx;
	color: #7B68EE;
	font-weight: bold;
	margin-left: 10rpx;
}

.fixed-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 30rpx 60rpx calc(40rpx + constant(safe-area-inset-bottom));
	padding: 30rpx 60rpx calc(40rpx + env(safe-area-inset-bottom));
	z-index: 100;
}
</style>
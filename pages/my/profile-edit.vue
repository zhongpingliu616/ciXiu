<template>
	<view class="page-wrap profile-edit">
		<LayoutNavigation title="编辑资料" />
		<view class="page-content">
			<view class="form-card">
				<u-cell-group :border="false">
					<u-cell title="头像" :isLink="true" @click="handleAvatarClick" :border="false" :titleStyle="{
					fontSize: '28rpx',
					color: '#333',
					fontWeight: '500'
				  }" customStyle="padding: 30rpx 0;">
						<template #value>
							<view class="avatar-wrap">
								<image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
							</view>
						</template>
					</u-cell>
				</u-cell-group>
			</view>

			<view class="form-card mt-20">
				<u-cell-group :border="false">
					<u-cell title="ID" :border="false" :titleStyle="{
					fontSize: '28rpx',
					color: '#333',
					fontWeight: '500'
				  }" customStyle="padding: 30rpx 0;">
						<template #value>
							<text class="id-text">{{ userInfo.id }}</text>
						</template>
					</u-cell>
				</u-cell-group>
			</view>

			<view class="form-card mt-20">
				<u-cell-group :border="false">
					<u-cell title="昵称" :isLink="true" @click="handleNicknameClick" :border="true" :titleStyle="{
						fontSize: '28rpx',
						color: '#333',
						fontWeight: '500'
					  }" customStyle="padding: 30rpx 0;">
						<template #value>
							<text class="nickname-text">{{ userInfo.nickname }}</text>
						</template>
					  </u-cell>
					  <u-cell title="我的二维码" :isLink="true" @click="handleQrCodeClick" :border="false" :titleStyle="{
						fontSize: '28rpx',
						color: '#333',
						fontWeight: '500'
					  }" customStyle="padding: 30rpx 0;">
					  </u-cell>
				</u-cell-group>
			</view>

			<view class="form-card mt-20 signature-card">
				<view class="signature-title">个性签名</view>
				<u-textarea 
					v-model="userInfo.signature" 
					placeholder="这里是个性签名..." 
					border="none"
					:maxlength="100"
					height="200"
					customStyle="background: transparent; padding: 0;"
				></u-textarea>
			</view>
		</view>
		<CxModal
			v-model:show="showNicknameModal"
			title="修改昵称"
			@confirm="confirmNicknameChange"
		>
			<view class="input-wrap">
				<u-input
					v-model="tempNickname"
					placeholder="请输入昵称"
					border="surround"
					clearable
					:customStyle="{
						height: '52rpx',
						borderRadius: '10rpx'
					}"
				></u-input>
			</view>
		</CxModal>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';

const userInfo = reactive({
	avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
	id: '56205620000',
	nickname: '会吃人的饭',
	signature: ''
});

const showNicknameModal = ref(false);
const tempNickname = ref('');

const handleAvatarClick = () => {
	uni.chooseImage({
		count: 1,
		success: (res) => {
			userInfo.avatar = res.tempFilePaths[0];
			// 这里可以添加上传图片的逻辑
		}
	});
};

const handleNicknameClick = () => {
	tempNickname.value = userInfo.nickname;
	showNicknameModal.value = true;
};

const confirmNicknameChange = () => {
	if (!tempNickname.value.trim()) {
		uni.showToast({
			title: '昵称不能为空',
			icon: 'none'
		});
		return;
	}
	userInfo.nickname = tempNickname.value;
	uni.showToast({
		title: '修改成功',
		icon: 'success'
	});
};

const handleQrCodeClick = () => {
	// 这里可以跳转到二维码页面
	console.log('查看二维码');
};

</script>

<style lang="scss" scoped>
.profile-edit {
	background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
	min-height: 100vh;
}

.page-content {
	padding: 30rpx;
}

.form-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 0 30rpx;
	overflow: hidden;
}

.mt-20 {
	margin-top: 20rpx;
}

.avatar-wrap {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	overflow: hidden;
	
	.avatar {
		width: 100%;
		height: 100%;
	}
}
.nickname-text{
	color: #999;
	font-size: 28rpx;
}
.id-text {
	color: #999;
	font-size: 28rpx;
}

.signature-card {
	padding: 30rpx;
	min-height: 300rpx;
}

.signature-title {
	font-size: 30rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.input-wrap {
	padding: 20rpx 0;
}
</style>

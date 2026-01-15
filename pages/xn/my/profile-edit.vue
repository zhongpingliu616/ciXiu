<template>
	<view class="page-wrap profile-edit">
		<LayoutNavigation title="编辑资料" />
		<view class="page-content">
			<view class="form-card">
				<u-cell-group :border="false">
					<u-cell title="头像" :isLink="true" :border="false" :titleStyle="{
					fontSize: '28rpx',
					color: '#333',
					fontWeight: '500'
				  }" customStyle="padding: 30rpx 0;">
						<template #value>
							<view class="avatar-wrap">
								<image class="avatar" :src="userInfo.avatar" mode="aspectFill" @click="handleAvatarClick"></image>
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
							<text class="id-text">{{ userInfo.reg_ip }}</text>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
			
			<view class="form-card mt-20">
				<u-cell-group :border="false">
					<u-cell title="昵称" :isLink="true" :border="true" :titleStyle="{
						fontSize: '28rpx',
						color: '#333',
						fontWeight: '500'
					  }" customStyle="padding: 30rpx 0;">
						<template #value>
							<u-input
							  v-model="userInfo.nickname"
							  placeholder="请输入昵称"
							  input-align="right"
							  border="none"
							  class="nickname-text"
							/>
							<!-- <text class="nickname-text" @click="handleNicknameClick">{{ userInfo.nickname }}</text> -->
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
			<view class="mt-20 save-profile">
				<CxComfirmBtn text="保存" :disabled="!canSaveProfile" @click="handleSubmit" />
			</view>
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
</template>

<script setup>
import { updateUserInfo, uploadImage } from '@/api/index'
const { proxy } = getCurrentInstance();
let eventChannel = proxy.getOpenerEventChannel();
let originProfile = ref(null)
let pageLoaded = ref(false)
let avatarRes = {
		data: {
			url: ''
		},
		code: -999,
		msg: ''
};
let userInfo = reactive({
	avatar: '',
	reg_ip: '',
	nickname: '',
	signature: ''
});

let showNicknameModal = ref(false);
let tempNickname = ref('');

const handleAvatarClick = () => {
	uni.chooseImage({
		count: 1,
		success: async (res) => {
			avatarRes = await uploadImage(res.tempFilePaths[0]);
			const { code=9999, data={},msg='' } = avatarRes;
			if (code === 200) {
				uni.showToast({
					title: '上传成功，等待审核',
					icon: 'success'
				});
				userInfo.avatar = data.url;
			} else {
				uni.showToast({
					title: msg || '上传失败，请重试',
					icon: 'none'
				});
			}
			// 这里可以添加上传图片的逻辑
		}
	});
};
const handleSubmit = async () => {
	try {
		// 1. 提交更新信息
		const res = await updateUserInfo({
			avatar: userInfo.avatar || "",
			nick_name: userInfo.nickname || "",
			signature: userInfo.signature || ""
		});
		
		const { code=9999, data,msg } = res;
		if (code === 200) {
			uni.showToast({
				title: '已提交',
				icon: 'success'
			});
			// 更新用户信息中的昵称和签名
			userInfo.nickname = tempNickname.value || userInfo.nickname;
			userInfo.signature = userInfo.signature || "";
			// 延迟跳转
			setTimeout(() => {
				uni.navigateBack({ delta: 1 });
			}, 1500);
		} else {
				uni.showToast({
					title: msg || '更新失败，请重试',
					icon: 'none'})
				}
			} catch (error) {
				uni.showToast({
					title: '更新失败，请重试',
					icon: 'none'
				});
			}
};


const canSaveProfile = computed(() => {
  if (!pageLoaded.value || !originProfile.value) {
    return false
  }
  return (
    userInfo.avatar !== originProfile.value.avatar ||
    userInfo.nickname !== originProfile.value.nickname ||
    userInfo.signature !== originProfile.value.signature
  )
})

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
	// uni.showToast({
	// 	title: '修改成功',
	// 	icon: 'success'
	// });
};

const handleQrCodeClick = () => {
	// 这里可以跳转到二维码页面
	console.log('查看二维码');
};
onLoad(() => {
	// 从事件通道接收用户数据
  originProfile.value = {
    avatar: userInfo.avatar,
    nickname: userInfo.nickname,
    signature: userInfo.signature
  }
  pageLoaded.value = true
	eventChannel.on('sendUserData', (data) => {
		userInfo.reg_ip = data.reg_ip;
		userInfo.avatar = data.avatar;
		userInfo.nickname = data.nick_name;
		userInfo.signature = data.signature;
		originProfile.value = {
			avatar: userInfo.avatar,
			nickname: userInfo.nickname,
			signature: userInfo.signature
		}
		pageLoaded.value = true
	});
});
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

<template>
	<view class="page-wrap">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<image class="logo" src="@/static/images/public_logo.png"></image>
			<view class="text-area">
				<text class="title">传统刺绣xxx数字资产</text>
			</view>
			<view class="login-box">
				<image src="@/static/images/user/login-box-bg.png"></image>
				<view class="login-content">
					 <CxTabs />
					  <view v-show="tabActiveIndex === 0">
					    <UserLoginXn ref="xiuliangFormRef" />
					  </view>
					  
					  <view v-show="tabActiveIndex === 1">
					    <UserLoginGz ref="gongzhongFormRef" />
					  </view>
				</view>
			</view>
			<view class="login-btn-wrap">
				<CommonComfirmBtn text="登录" :loading="loading" @click="handleLogin" />				
			</view>
			<view class="regist-tost">				
				<text> 还没有账号？ <text class="immediately-regist">立即注册</text></text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { useLoginStore } from '@/stores/userLogin'
import { login } from '@/api/index'

	const xiuliangFormRef = ref(null);
	const gongzhongFormRef = ref(null);
	const loading = ref(false);
	let title = ref("login");
	let tabActiveIndex = ref(0);
	const userStore = useLoginStore()
	const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAASCAMAAAA0cZ07AAABSlBMVEUAAAD/VQD/VVX/QED/KgD/Kir/VSr/VVX/f1X/TTPoRi7/Ri7tNyTtWzf5STH5Tzf5VTf5Wz3/STH/VTf/W0P4TDT4Uzn4Uzv4XD/7TDT7XD/4Kxz6Qi76Qy77Y0f7ZUf9fFn4Khz4Qy76ZEb7e1j7fVj6UTn6Tzf6Vjz6Vz76UDn6VTz6WT/5Tjb5Ujn5VDz7Tjb7Wj/4LB35QC35Qy/7Zkj8e1j8fFn4LB35Kxz5QC35Qy/7Y0b7Zkn8fFn8fVr4Kx34LB34LB74LR/4Lh/4LyD4MCH4MSL4MyL4NCP5NST5NiX5OCb5OSf5Oij5PCn5PSr5Pyv5QC35Qi76Tzf6UTn6Ujr6VDv6Vjz6Vz77ZUf7Zkj7aEr7aUv7a0z7bE37bk77b0/7cFD7clH7c1L8dFP8dVT8dlX8eFX8eVb8elf8e1j8fFj8fFlFVbOBAAAAQHRSTlMAAwMEBgYGBgYKCwsODioqKioqKip1dXV1dXWQkJCQkJCRkZGRkaChoaGiouLj4+Pj4+7u7u7u7u/v7+/v7+/vJ9rf/wAAANxJREFUOMtjYMALmJkZKAGcnBRpZ2OjSDu/AEXaxcQp0c2tp8+NXwWLtJGTs4urm7uHp5e3j6+ff0CgsQwrVFItLFwDymSXN42JjYtPSExKTklNS8/IzMo2U+BgkHZwRNceFCwL1sGlHhoWHqHJBebIRUWja8/JVWCwxKbdmpGTlU9UNwSkPVJHQpCNk8kGm3Z77NpNGHlYhSQNINoNpUTYeLFrN2dQxKZdCRJwyI5XxqZdFRh0FujarZRgQacVFq4NDzpbdO12KhyURhwtkw0Dv/BAZhkKMyyh4gIA26VeW8woj3cAAAAASUVORK5CYII=";
	const loginTabs = reactive([  
	    { name: '我是绣娘' },  
	    { name: '我是公众', badge: { isDot: true } }
	]);  
	onMounted(() => {
	  console.log('is tab page my', title)
	});
	function loginChange(e){
		// console.log("切换了", e);
		tabActiveIndex.value  = e.index;
	};
	const handleLogin = () => {
		tabActiveIndex.value == 0 ? xiuNiangLogin() : gongzhongLogin();
	}
	const xiuNiangLogin = () => {
		if(xiuliangFormRef.value.greetment[0]!="hasAgreed"){
				 uni.showToast({
				 	title: '请勾选同意条款',
					icon: 'error',
				 	duration: 2000
				 });
				 return ;
		};
		 xiuliangFormRef.value.validateLoginForm(valid => {
		   if (!valid) return;
				loading.value = true;
				// const loginResult = await login()
				setTimeout(() => {
				  loading.value = false;
				  Object.assign(userStore.userInfoXn, {token: '777888'});
				  uni.setStorageSync('tokenXn', '777888');
				  uni.navigateBack();
				  uni.showToast({
					title: '登录成功',
					icon: 'success'
				  })
				}, 3000);
		 })
	};
	const gongzhongLogin = () => {
		if(gongzhongFormRef.value.greetment[0]!="hasAgreed"){
				 uni.showToast({
				 	title: '请勾选同意条款',
					icon: 'error',
				 	duration: 2000
				 });
				 return ;
		};
		 gongzhongFormRef.value.validateLoginForm(valid => {
		   if (!valid) return;
				loading.value = true;
				// const loginResult = await login()			
				setTimeout(() => {
				  loading.value = false;
				  Object.assign(userStore.userInfoGz, {token: '777888'});
				  uni.setStorageSync('tokenGz', '777888');
				  uni.navigateBack();
				  uni.showToast({
					title: '登录成功',
					icon: 'success'
				  })
				}, 3000);
		 })
	};
</script>

<style lang="scss" scoped>
	.page-wrap{
		background: url("/static/images/user/login-bg.png") no-repeat;
		background-size: cover;
	}
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 100rpx auto;
		margin-bottom: 20rpx;
		display: block;
		text-align: center;
	}
	.login-box{
		position: relative;
		margin: 0 auto;
		uni-image{
			display: block;
			width: 90%;
			height: auto;
			aspect-ratio: 7 / 5;
			margin: 0 auto;
		}
	}
	.login-content{
		position: absolute;
		inset:40rpx 80rpx;
	}
	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #fff;
	}
	.login-btn-wrap{
		width: 90%;
		margin: 0 auto;
		margin-top: 80rpx;
	}
	.regist-tost{
		color: #fff;
		text-align: center;
		margin-top: 24rpx;
		
	}
.immediately-regist{
			text-decoration: underline;
		}
</style>

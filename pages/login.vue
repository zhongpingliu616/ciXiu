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
					 <CxTabs
					  v-model="tabActiveIndex"
					  :tabItems="loginTabs"
					  />
					  <view v-show="tabActiveIndex === 1" class="xiuliang-form">
					    <XnUserLogin ref="xiuliangFormRef"
						 v-model="mentStatusXn"
						 />
					  </view>
					  
					  <view v-show="tabActiveIndex === 0" class="gongzhong-form">
					    <GzUserLogin ref="gongzhongFormRef"
						 v-model="mentStatusGz" />
					  </view>
				</view>
			</view>
			<view class="login-btn-wrap">
				<CxComfirmBtn text="登录" :loading="loading" @click="handleLogin" />
			</view>
			<!-- <view class="regist-tost">				
				<text> 还没有账号？ <text class="immediately-regist">立即注册</text></text>
			</view> -->
			<view class="login-container">
			    <!-- 标题 -->
			    <view class="title-wrapper">
			      <view class="line"></view>
			      <text class="title-text">第三方登录</text>
			      <view class="line"></view>
			    </view>
			
			    <!-- 登录按钮 -->
			    <view class="login-buttons">
			      <!-- 支付宝按钮 -->
			      <view class="login-button" @click="handleAlipayLogin">
			        <u-image
			          src="/static/images/user/alipay.png"
			          mode="aspectFit"
			          width="80rpx"
			          height="80rpx"
			          class="icon"
			        ></u-image>
			        <text class="button-text">支付宝</text>
			      </view>
			
			      <!-- 微信按钮 -->
			      <view class="login-button" @click="handleWechatLogin">
			        <u-image
			          src="/static/images/user/wechat.png"
			          mode="aspectFit"
			          width="80rpx"
			          height="80rpx"
			          class="icon"
			        ></u-image>
			        <text class="button-text">微信</text>
			      </view>
			    </view>
			  </view>
		</view>
	<view></view>
	</view>
</template>

<script setup>
import { useLoginStore } from '@/stores/userLogin'
import { login } from '@/api/index'

	const xiuliangFormRef = ref(null);
	const gongzhongFormRef = ref(null);
	let mentStatusXn = ref(false);
	let mentStatusGz = ref(false);
	const loading = ref(false);
	let title = ref("login");
	let tabActiveIndex = ref(0);
	const userStore = useLoginStore()
	const lineBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAASCAMAAAA0cZ07AAABSlBMVEUAAAD/VQD/VVX/QED/KgD/Kir/VSr/VVX/f1X/TTPoRi7/Ri7tNyTtWzf5STH5Tzf5VTf5Wz3/STH/VTf/W0P4TDT4Uzn4Uzv4XD/7TDT7XD/4Kxz6Qi76Qy77Y0f7ZUf9fFn4Khz4Qy76ZEb7e1j7fVj6UTn6Tzf6Vjz6Vz76UDn6VTz6WT/5Tjb5Ujn5VDz7Tjb7Wj/4LB35QC35Qy/7Zkj8e1j8fFn4LB35Kxz5QC35Qy/7Y0b7Zkn8fFn8fVr4Kx34LB34LB74LR/4Lh/4LyD4MCH4MSL4MyL4NCP5NST5NiX5OCb5OSf5Oij5PCn5PSr5Pyv5QC35Qi76Tzf6UTn6Ujr6VDv6Vjz6Vz77ZUf7Zkj7aEr7aUv7a0z7bE37bk77b0/7cFD7clH7c1L8dFP8dVT8dlX8eFX8eVb8elf8e1j8fFj8fFlFVbOBAAAAQHRSTlMAAwMEBgYGBgYKCwsODioqKioqKip1dXV1dXWQkJCQkJCRkZGRkaChoaGiouLj4+Pj4+7u7u7u7u/v7+/v7+/v7+/vJ9rf/wAAANxJREFUOMtjYMALmJkZKAGcnBRpZ2OjSDu/AEXaxcQp0c2tp8+NXwWLtJGTs4urm7uHp5e3j6+ff0CgsQwrVFItLFwDymSXN42JjYtPSExKTklNS8/IzMo2U+BgkHZwRNceFCwL1sGlHhoWHqHJBebIRUWja8/JVWCwxKbdmpGTlU9UNwSkPVJHQpCNk8kGm3Z77NpNGHlYhSQNINoNpUTYeLFrN2dQxKZdCRJwyI5XxqZdFRh0FujarZRgQacVFq4NDzpbdO12KhyURhwtkw0Dv/BAZhkKMyyh4gIA26VeW8woj3cAAAAASUVORK5CYII=";
	const loginTabs = reactive([  
	    { name: '公众端' },  
	    { name: '绣娘端', badge: { isDot: false } }
	]);  
	onMounted(() => {
	  console.log('is tab page my', title)
	});
const handleAlipayLogin = () => {
  console.log('点击了支付宝登录');
  // 这里可以调用 uView Plus 的 API 或者原生的支付/登录接口
};
const handleWechatLogin = () => {
  console.log('点击了微信登录');
  // 这里可以调用 uView Plus 的 API 或者原生的支付/登录接口
}
	function loginChange(e){
		// console.log("切换了", e);
		tabActiveIndex.value  = e.index;
	};
	const handleLogin = () => {
		tabActiveIndex.value == 1 ? xiuNiangLogin() : gongzhongLogin();
	}
	const xiuNiangLogin = () => {
		if(!xiuliangFormRef.value.greetment){
				 uni.showToast({
				 	title: '请勾选同意条款',
					icon: 'error',
				 	duration: 2000
				 });
				 return ;
		};
		 xiuliangFormRef.value.validateLoginForm(async (valid, formData={}) => {
		   if (!valid) return;
				loading.value = true;
				try {
					const { accoutName, password } = formData;
					const res = await login({
						username: accoutName,
						password: password
					});
					
					if (res.code === 200) {
						const { token, info } = res.data;
						console.log('登录成功，用户信息：', info);
						// 更新用户信息 (store + storage)
						userStore.updateUserInfo('XN', {
							token: token,
							user: info.username,
							id: info.id || '', 
							phone: info.phone,
							avatar: info.avatar,
							nick_name: info.nick_name,
							real_name_check: info.real_name_check,
							level: info.level,
							is_buy: info.is_buy
						});
						
						// 清除另一个角色的 token
						uni.removeStorageSync('tokenGz');
						userStore.userInfoGz.token = '';
						userStore.setRole('XN');

						// 登录成功后的逻辑判断
						// 1. 检查是否有等级 (level == 0 表示无等级)
						if (info.level === 0) {
							uni.reLaunch({
								url: '/pages/xn/level/index'
							});
							uni.showToast({
								title: '请先选择等级',
								icon: 'none'
							});
						} 
						// 2. 检查是否实名认证 (real_name_check == 2 表示未实名)
						else if (info.real_name_check === 2) {
							uni.reLaunch({
								url: '/pages/xn/my/identity-authentication'
							});
							uni.showToast({
								title: '请先完成实名认证',
								icon: 'none'
							});
						} 
						// 3. 一切正常，进入首页
						else {
							uni.reLaunch({
								url: '/pages/index'
							});
							uni.showToast({
								title: '绣娘登录成功',
								icon: 'success'
							});
						}
					} else {
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: error.msg || '登录请求失败',
						icon: 'none'
					});
				} finally {
					loading.value = false;
				}
		 })
	};
	const gongzhongLogin = () => {
		if(!gongzhongFormRef.value.greetment){
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
				  
				  // 更新用户信息 (store + storage)
				  userStore.updateUserInfo('GZ', { 
					  token: 'Gz777888' 
				  });
				  
				  // 清除另一个角色的 token
				  uni.removeStorageSync('tokenXn');
				  userStore.userInfoXn.token = '';
				  userStore.setRole('gz');

				  uni.reLaunch({
					  url: '/pages/index'
				  });
				  uni.showToast({
					title: '公众登录成功',
					icon: 'success'
				  })
				}, 3000);
		 })
	};
onLoad((query) => {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  // 如果传递了 role 参数，根据 role 设置 tabActiveIndex
  // role: 'XN' -> 1, 'GZ' -> 0
  if (query.role) {
	  tabActiveIndex.value = query.role === 'XN' ? 1 : 0;
  } else {
	  // 如果没有传 role，默认逻辑或保持不变
	  tabActiveIndex.value = 0;
  }
  
  if(query.role=='XN'){
	  mentStatusXn.value = JSON.parse(query.consentStatus || false);
  }else{
	 mentStatusGz.value = JSON.parse(query.consentStatus || false);
  };
})
</script>

<style lang="scss" scoped>
.page-wrap{
	background: url("@/static/images/user/login-bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
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
		width: 98%;
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
.login-container {
	padding-top: 60rpx;

  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;

    .line {
      width: 100rpx;
      height: 2rpx;
      background-color: #FFFFFF;
      opacity: 0.6;
      margin: 0 20rpx;
    }

    .title-text {
      font-size: 32rpx;
      color: #FFFFFF;
      font-weight: bold;
    }
  }

  .login-buttons {
    display: flex;
    justify-content: center;
    gap: 120rpx; 

    .login-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;

      .icon {
        border-radius: 50%;
      }

      .button-text {
        font-size: 24rpx;
        color: #FFFFFF;
        margin-top: 10rpx;
      }
    }
  }
}
</style>

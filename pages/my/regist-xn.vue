<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="container">
			    <!-- 手机号输入 -->
			    <view class="input-item">
			      <u-icon name="account" size="36" color="#999"></u-icon>
			      <u-input
			        v-model="phone"
			        placeholder="请输入您的手机号码"
			        type="number"
			        :border="false"
			        maxlength="11"
			        input-align="left"
			        placeholder-style="color: #999; font-size: 28rpx;"
			      />
			    </view>
			
			    <!-- 验证码输入 -->
			    <view class="input-item">
			      <u-icon name="shield-check" size="36" color="#999"></u-icon>
			      <u-input
			        v-model="code"
			        placeholder="请输入验证码"
			        type="text"
			        :border="false"
			        input-align="left"
			        placeholder-style="color: #999; font-size: 28rpx;"
			      />
			      <u-text
			        @click="getVerifyCode"
			        class="verify-btn"
			        :style="{ color: isCounting ? '#ccc' : '#ff4d4d' }"
			      >
			        {{ isCounting ? `${countdown}s后重试` : '获取验证码' }}
			      </u-text>
			    </view>
			
			    <!-- 设置密码 -->
			    <view class="input-item">
			      <u-icon name="lock" size="36" color="#999"></u-icon>
			      <u-input
			        v-model="password"
			        placeholder="请设置密码"
			        :type="showPassword ? 'text' : 'password'"
			        :border="false"
			        input-align="left"
			        placeholder-style="color: #999; font-size: 28rpx;"
			      />
			      <u-icon
			        :name="showPassword ? 'eye' : 'eye-slash'"
			        size="36"
			        color="#999"
			        @click="togglePassword"
			      ></u-icon>
			    </view>
			
			    <!-- 确认密码 -->
			    <view class="input-item">
			      <u-icon name="lock" size="36" color="#999"></u-icon>
			      <u-input
			        v-model="confirmPassword"
			        placeholder="请再次输入密码"
			        :type="showConfirmPassword ? 'text' : 'password'"
			        :border="false"
			        input-align="left"
			        placeholder-style="color: #999; font-size: 28rpx;"
			      />
			      <u-icon
			        :name="showConfirmPassword ? 'eye' : 'eye-slash'"
			        size="36"
			        color="#999"
			        @click="toggleConfirmPassword"
			      ></u-icon>
			    </view>
			  </view>
		</view>
	 <LayoutBottom></LayoutBottom> />
	</view>
</template>


<script setup name="registXn">
let title = ref("注册绣娘");	
const phone = ref('')
const code = ref('')
const password = ref('')
const confirmPassword = ref('')

// 密码显示开关
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 验证码倒计时
const isCounting = ref(false)
const countdown = ref(60)

const getVerifyCode = () => {
  if (isCounting.value) return
  if (!phone.value || phone.value.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  // 模拟发送验证码
  uni.showToast({ title: '验证码已发送', icon: 'success' })

  isCounting.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCounting.value = false
      countdown.value = 60
    }
  }, 1000)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}	
</script>

<style lang="scss" scoped>
.container {
  padding: 60rpx 40rpx;
  background-color: #7a2b2b;
  min-height: 100vh;

  // 可选：添加背景花纹
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8cGF0aCBkPSJNMTAgMGMwIDUuNSA0LjUgMTAgMTAgMTBzMCA1LjUgLTEwIDEwIC0xMCAtMTAgLTEwLTExIDAtMTBzMC01LjUgMTAtMTBzMCA1LjUgMTAgMTAiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=');
  background-repeat: repeat;
}

.input-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 90rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .u-input {
    flex: 1;
    margin-left: 20rpx;
    font-size: 28rpx;
    color: #333;
  }

  .verify-btn {
    font-size: 28rpx;
    font-weight: bold;
    padding: 0 10rpx;
  }
}
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 120rpx;
}		
	
</style>
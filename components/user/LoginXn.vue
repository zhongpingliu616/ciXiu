<template>
	<up-form
	      ref="formRef"
	      :model="form"
	      :rules="rules"
	      label-position="top"
	    >
	  <!-- 手机号 -->
	  <up-form-item prop="mobile">
			<up-input
			  ref="mobileRef"
			  v-model="form.mobile"
			  placeholder="请输入手机号"
			  clearable
			  type="number"
			  class="login-item"			  
			  placeholderStyle="color: #999999; font-size: 20rpx;"
			>
		
			<template #prefix>&nbsp;&nbsp;&nbsp;&nbsp;
			  <image
				class="input-icon"
				src="/static/images/user/shouji.png"
				mode="aspectFit"
			  />
			</template>
		</up-input>
	  </up-form-item>

	  <!-- 密码 -->
	  <up-form-item prop="password">
		<up-input
			ref="passwordRef"
			  v-model="form.password"
			  :password="!showPwd"
			  placeholder="请输入密码"
			  clearable
			  class="login-item"
			  placeholderStyle="color: #999999; font-size: 20rpx;"
			>
		  <template #prefix>&nbsp;&nbsp;&nbsp;&nbsp;
		    <image
				class="input-icon"
				src="/static/images/user/mima.png"
				mode="aspectFit"
		    />
		  </template>

		  <!-- 右侧显示/隐藏 -->
		  <template #suffix>
			<up-icon
			  :name="showPwd ? 'eye-off' : ''"
			  size="40rpx"
			  color="#999"
			  @click="showPwd = !showPwd"
			/>
		  </template>
		</up-input>
	  </up-form-item>
	</up-form>
	 <view class="register-forgot-container">
	    <view class="left-text" @click="goToPhoneRegister">
	      手机号注册 >
	    </view>
	
	    <view class="right-text" @click="goToForgotPassword">
	      忘记密码？
	    </view>
	  </view>
	<view class="agreement">
		<view class="agreement-wrap">
			<CxCheckbox
			 v-model="greetment"
			 @change="changeAgree"
			/>   &nbsp;<span>我已阅读并同意</span> 
			<up-text
			    text="《用户协议条款》"
				:customStyle="{
				    fontWeight: 'bold',
					color:'#fff',
					fontSize: '24rpx'
				  }"
				  @tap="userAgreement"
			></up-text>
		</view>
	</view>
</template>

<script setup name="login">
const formRef = ref(null)
const mobileRef = ref(null)
const passwordRef = ref(null)
const loading = ref(false)
const showPwd = ref(false)
const form = ref({
  mobile: '',
  password: ''
})
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
let greetment = ref(props.modelValue.value);
const emit = defineEmits(['update:modelValue']);
watch(
  () => props.modelValue,
  (val) => {
	  greetment.value = val;
  },{
	  immediate: true
  }
);
const changeAgree = () => {
	emit('update:modelValue', greetment);
};
const rules = {
  mobile: [
	{ required: true, message: '请输入手机号', trigger: 'blur' },
	{
	  // pattern: /^1[3-9]\d{9}$/,
	  pattern: /^1[34578]\d{9}$/,
	  message: '手机号格式不正确',
	  trigger: 'blur'
	}
  ],
  password: [
	{ required: true, message: '请输入密码', trigger: 'blur' },
	{ min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}
const userAgreement = () => {
	uni.navigateTo({ url: '/pages/my/user-agreement?role=xn' });
};
const goToPhoneRegister = () => {
  uni.navigateTo({
    url: '/pages/my/regist-xn?role=xn'
  });
};

const goToForgotPassword = () => {
  uni.navigateTo({
    url: '/pages/my/reset-psd-xn'
  });
};
const validateLoginForm = async (cb) => {
  try {
	const valid = await formRef.value.validate()
	cb && cb(valid)
  } catch (err) {
	cb && cb(false)
  }
}
defineExpose({
  validateLoginForm,
  greetment
})
</script>

<style scoped lang="scss">


.agreement-wrap{
	display: flex;
	justify-content: center;
}
.agreement{
	margin-top: 82rpx;
	color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
}
.register-forgot-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
margin-top: 12rpx;
  .left-text {
    font-size: 24rpx;
    color: #333;
    &:active {
      opacity: 0.7;
    }
  }

  .right-text {
    font-size: 24rpx;
    color: #F82B1D;
    &:active {
      opacity: 0.7;
    }
  }
}
.login-item{
	border-radius: 64rpx;
	border: 4rpx solid #F3D89E;
	border-color: #F3D89E;
	line-height: 64rpx;
	background-color: #fff;
}
.input-icon {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-right: 12rpx;
}
</style>

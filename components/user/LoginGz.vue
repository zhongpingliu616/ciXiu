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
			>
		
			<template #prefix>
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
		>
		  <template #prefix>
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
			  size="20"
			  color="#999"
			  @click="showPwd = !showPwd"
			/>
		  </template>
		</up-input>
	  </up-form-item>
	</up-form>
	<view class="agreement">
		<up-checkbox-group v-model="greetment">
			<up-checkbox
			  name="hasAgreed"
			  shape="circle"
			  activeColor="#F83021"
			>
			
			</up-checkbox>我已阅读并同意<up-text
			    type="error"
			    text="《用户协议条款》"
				:customStyle="{
				    fontWeight: 'bold'
				  }"
			></up-text>
		</up-checkbox-group>
	</view>
</template>

<script setup name="login">
	const formRef = ref(null)
	const mobileRef = ref(null)
	const passwordRef = ref(null)
	const loading = ref(false)
	const showPwd = ref(false)
	let greetment = ref([]);
	const form = ref({
	  mobile: '',
	  password: ''
	})
	
	const rules = {
	  mobile: [
	    { required: true, message: '请输入手机号', trigger: 'blur' },
	    {
	      pattern: /^1[3-9]\d{9}$/,
	      message: '手机号格式不正确',
	      trigger: 'blur'
	    }
	  ],
	  password: [
	    { required: true, message: '请输入密码', trigger: 'blur' },
	    { min: 6, message: '密码至少6位', trigger: 'blur' }
	  ]
	}
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
.login-item{
	border-radius: 64rpx;
	border: 4rpx solid #F3D89E;
	border-color: #F3D89E;
	line-height: 54rpx;
	background-color: #F6F6F6;
}
.input-icon {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-right: 12rpx;
}
</style>

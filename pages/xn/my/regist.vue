<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="container">
				<!-- 账户名 -->
				<view class="input-item">
				  <image
				  	class="input-icon"
				  	src="/static/images/user/zhanghao.png"
				  	mode="aspectFit"
				  />
				  <u-input
				    v-model="form.accoutName"
				    placeholder="账户名字母开头6-20非中文字符"
				    type="text"
				    :border="'none'"
				    maxlength="11"
				    input-align="left"
					@update:modelValue="clearError('accoutName')"
				    placeholder-style="color: #999; font-size: 24rpx;"
				  />
				  <text class="error-text" v-if="errors.accoutName">{{errors.accoutName}}</text>
				</view>
			    <!-- 手机号输入 -->
			    <view class="input-item">
			      <image
			      	class="input-icon"
			      	src="/static/images/user/shouji.png"
			      	mode="aspectFit"
			      />
			      <u-input
			        v-model="form.phone"
			        placeholder="请输入您的手机号码"
			        type="number"
			        :border="'none'"
			        maxlength="11"
			        input-align="left"
					@update:modelValue="clearError('phone')"
			        placeholder-style="color: #999; font-size: 24rpx;"
			      />
				  <text class="error-text" v-if="errors.phone">{{errors.phone}}</text>
			    </view>
			
			    <!-- 验证码输入 -->
			    <view class="input-item">
					<image
						class="input-icon"
						src="/static/images/user/emiyanzhengma.png"
						mode="aspectFit"
					/>
			      <u-input
			        v-model="form.code"
			        placeholder="请输入验证码"
			        type="text"
			        :border="'none'"
			        input-align="left"
					@update:modelValue="clearError('code')"
			        placeholder-style="color: #999; font-size: 24rpx;"
			      />
			      <text
			        @click="getVerifyCode"
			        class="verify-btn"
					 v-if="!errors.code"
			        :style="{ color: isCounting ? '#ccc' : '#ff4d4d', fontWeight: 'normal' }"
			      >
			        {{ isCounting ? `${countdown}s后重试` : '获取验证码' }}
			      </text>
				  <text class="error-text" v-if="errors.code">{{errors.code}}</text>
			    </view>
			    <!-- 设置密码 -->
			    <view class="input-item">
			      <image
			      	class="input-icon"
			      	src="/static/images/user/mima.png"
			      	mode="aspectFit"
			      />
			      <u-input
			        v-model="form.password"
			        placeholder="字母开头,必须包含特殊字符6-20位"
			        :type="showPassword ? 'text' : 'password'"
			        :border="'none'"
			        input-align="left"
					@update:modelValue="clearError('password')"
			        placeholder-style="color: #999; font-size: 24rpx;"
			      />
			      <u-icon
			        :name="showPassword ? 'eye' : ''"
			        size="36"
			        color="#999"
			        @click="togglePassword"
			      ></u-icon>
				  <text class="error-text" v-if="errors.password">{{errors.password}}</text>
			    </view>
			
			    <!-- 确认密码 -->
			    <view class="input-item">
			      <image
			      	class="input-icon"
			      	src="/static/images/user/mima.png"
			      	mode="aspectFit"
			      />
			      <u-input
			        v-model="form.confirmPassword"
			        placeholder="请再次输入密码"
			        :type="showConfirmPassword ? 'text' : 'password'"
			        :border="'none'"
			        input-align="left"
					@update:modelValue="clearError('confirmPassword')"
			        placeholder-style="color: #999; font-size: 24rpx;"
			      />
			      <u-icon
			        :name="showConfirmPassword ? 'eye' : ''"
			        size="36"
			        color="#999"
			        @click="toggleConfirmPassword"
			      ></u-icon>
				  <text class="error-text" v-if="errors.confirmPassword">{{errors.confirmPassword}}</text>
			    </view>

          <!-- 邀请码输入 -->
			    <view class="input-item">
            <uni-icons custom-prefix="iconfont" type="icon-yaoqingma" size="40rpx" color="#6a4445"></uni-icons>
			      <u-input
			        v-model="form.invitationCode"
			        placeholder="请输入邀请码"
			        type="text"
			        :border="'none'"
			        input-align="left"
			        placeholder-style="color: #999; font-size: 24rpx;"
			      />
				  <text class="error-text" v-if="errors.invitationCode">{{errors.invitationCode}}</text>
			    </view>
			  </view>
			  
			  <view class="regist-btn-wrap">
			  	<CxComfirmBtn text="确认注册" :loading="loading" @click="handleRegister" />
			  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="registXn">
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
import { register, sendSms } from '@/api/index'

let title = ref("注册用户");	
let loading = ref(false);
const form = reactive({
	accoutName:"",
	phone:"",
	code:"",
  invitationCode:'',
	password:"",
	confirmPassword:""
});
const errors = reactive({
  accoutName:"",
  phone:"",
  code:"",
  password:"",
  confirmPassword:""
});

// 清除单个字段错误
const clearError = (field) => {
  errors[field] = '';
  loading.value = false;
};

// 校验方法
const validateForm = () => {
  let isValid = true
  const name = form.accoutName?.trim()
  if (!name) {
    errors.accoutName = '用户名不能为空'
    isValid = false;
  } else if (name.length < 6 || name.length > 20) {
    errors.accoutName = '账户名字母开头6-20位';
    isValid = false;
  } else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name)) { // 字母开头，只包含字母数字
    errors.accoutName = '字母开头且仅包含字母数字';
    isValid = false;
  }
  // 手机号校验
  if (!form.phone) {
    errors.phone = '手机号不能为空';
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '手机号格式不正确';
    isValid = false;
  };
  // 验证码校验
  if (!form.code) {
    errors.code = '验证码不能为空';
    isValid = false;
  } else if ((`${form.code.length}`).trim()!= 6) { // 假设验证码是6位
    errors.code = '验证码格式不正确'; 
    isValid = false;
  }

  // 密码校验
  const pwd = form.password
  if (!pwd) {
    errors.password = '密码不能为空';
    isValid = false;
  } else if (pwd.length < 6 || pwd.length > 20) {
    errors.password = '密码长度6-20位';
    isValid = false;
  } else if (!/^[A-Za-z]/.test(pwd)) {
      errors.password = '密码必须字母开头';
      isValid = false;
  }
  // else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?])/.test(pwd)) {
  //   errors.password = '密码必须包含特殊字符';
  //   isValid = false;
  // }

  // 确认密码
  if (!form.confirmPassword) {
    errors.confirmPassword = '请再次输入密码';
    isValid = false;
  } else if (form.confirmPassword !== pwd) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  };
    // 邀请码检验
  if (proxy.$globalConfig?.reg_invite_check == 1 && !form.invitationCode) {
    errors.invitationCode = '邀请码不能为空';
    isValid = false;
  } else if (proxy.$globalConfig?.reg_invite_check == 1 && (`${form.invitationCode.length}`).trim() < 6) { // 假设邀请码是大于6位
    errors.invitationCode = '邀请码格式不正确'; 
    isValid = false;
  }

  return isValid;
};



// 注册提交
const handleRegister = async () => {
  if (validateForm()) {
	loading.value = true;
    try {
        const res = await register({
            username: form.accoutName,
            password: form.password,
            phone: form.phone,
            sms_code: form.code,
			      confirm_password: form.confirmPassword
        });
        if (res.code === 200) {
            uni.showToast({ title: '注册成功！', icon: 'success' });
            setTimeout(() => {
              uni.reLaunch({
                 url: `/pages/login?role=XN`
               })
               //  uni.navigateBack();
            }, 1500);
        } else {
            uni.showToast({ title: res.msg || '注册失败', icon: 'none' });
        }
    } catch (error) {
        console.error('注册失败', error);
        uni.showToast({ title: error.msg || '注册失败', icon: 'none' });
    } finally {
        loading.value = false;
    }
  };
 } 
// 密码显示开关
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 验证码倒计时
const isCounting = ref(false);
const countdown = ref(60);

const getVerifyCode = async () => {
  if (isCounting.value) return;
  if (!form.phone) {
      errors.phone = '请输入手机号';
      return;
  }
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号';
    return;
  };
  
  try {
      const res = await sendSms({
          phone: form.phone,
          type: 1 // type字段 短信类1注册，2找回密码
      });
      if (res.code === 200) {
          uni.showToast({ title: '验证码已发送', icon: 'success' });
          isCounting.value = true;
          form.code = res.data.sms_code;
          const timer = setInterval(() => {
            countdown.value--
            if (countdown.value <= 0) {
              clearInterval(timer);
              isCounting.value = false;
              countdown.value = 60;
            };
          }, 1000);
      } else {
          uni.showToast({ title: res.msg || '发送失败', icon: 'none' });
      };
  } catch (error) {
      console.error('发送验证码失败', error);
      uni.showToast({ title: error.msg || '发送失败', icon: 'none' });
  };
};

const togglePassword = () => {
  showPassword.value = !showPassword.value
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
};
</script>

<style lang="scss" scoped>
.regist-btn-wrap{
	width: 90%;
	margin: 0 auto;
	margin-top: 80rpx;
}
.container {
	margin-top: 32rpx;
}
.input-icon {
  width: 36rpx;
  height: 36rpx;
  vertical-align: middle;
  margin-right: 12rpx;
}
.input-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 90rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  .error-text{
    font-size: 24rpx;
    color: #ff4d4d;
  }
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
	grid-template-rows: v-bind(safeTopValue) 1fr 120rpx;
}		
	
</style>
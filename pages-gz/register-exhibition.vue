<template>
	<view class="page-wrap register-exhibition">
		<LayoutNavigationGz :title="title" />
		<view class="page-content">
			<view class="form-card">
				<u-form :model="form" ref="uForm">
					<u-form-item label="活动名称" label-width="150">
						<view class="activity-name">双十二 · 线下展会</view>
					</u-form-item>
					<u-form-item label="姓名" label-width="150" prop="name">
						<u-input v-model="form.name" placeholder="请输入姓名" :border="'false'" input-align="right" />
					</u-form-item>
					<u-form-item label="手机号" label-width="150" prop="phone">
						<u-input v-model="form.phone" placeholder="请输入手机号" type="number" :border="'false'" input-align="right" />
					</u-form-item>
					<u-form-item label="验证码" label-width="150" prop="code">
						<view class="code-wrap">
							<u-input v-model="form.code" placeholder="请输入验证码" type="number" :border="'false'" input-align="right" />
							<view class="code-btn">
								<u-button size="mini" type="error" :disabled="codeDisabled" @click="getCode" :custom-style="{background: '#FF4141', color: '#fff', border: 'none'}">{{ codeText }}</u-button>
							</view>
						</view>
					</u-form-item>
					<u-form-item label="身份证号码" label-width="180" prop="idCard" :border-bottom="'false'">
						<u-input v-model="form.idCard" placeholder="请输入身份证号码" :border="'false'" input-align="right" />
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="footer-btn">
			<CxComfirmBtn
				text="立即报名"
				@click="submit"
			/>
		</view>
	</view>
</template>

<script setup name="registerExhibition">
import { ref, reactive } from 'vue'

const title = ref('双十二 · 线下展会')
const form = reactive({
	name: '',
	phone: '',
	code: '',
	idCard: ''
})
const codeText = ref('获取验证码')
const codeDisabled = ref(false)
const timer = ref(null)

const getCode = () => {
	if (!/^1[3-9]\d{9}$/.test(form.phone)) {
		uni.showToast({
			title: '请输入正确的手机号',
			icon: 'none'
		})
		return
	}
	
	if (codeDisabled.value) return
	
	uni.showToast({
		title: '验证码已发送',
		icon: 'success'
	})
	
	// Mock sending code
	let count = 60
	codeDisabled.value = true
	codeText.value = `${count}s`
	
	timer.value = setInterval(() => {
		count--
		if (count > 0) {
			codeText.value = `${count}s`
		} else {
			clearInterval(timer.value)
			codeText.value = '获取验证码'
			codeDisabled.value = false
		}
	}, 1000)
}

const submit = () => {
	if (!form.name) {
		return uni.showToast({ title: '请输入姓名', icon: 'none' })
	}
	if (!/^1[3-9]\d{9}$/.test(form.phone)) {
		return uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
	}
	if (!form.code) {
		return uni.showToast({ title: '请输入验证码', icon: 'none' })
	}
	// Simple ID card validation (15 or 18 digits)
	if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(form.idCard)) {
		return uni.showToast({ title: '请输入正确的身份证号码', icon: 'none' })
	}
	
	uni.showLoading({ title: '提交中' })
	
	setTimeout(() => {
		uni.hideLoading()
		// Navigate to success page with data
		uni.navigateTo({
			url: `/pages-gz/registration-successful?name=${encodeURIComponent(form.name)}&phone=${form.phone}&idCard=${form.idCard}`
		})
	}, 1000)
}
</script>

<style lang="scss" scoped>
.page-wrap {
	background: url("/static/images/index/bg.png") no-repeat center/cover;
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.page-content {
	flex: 1;
	padding: 30rpx;
}

.form-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 0 30rpx;
}

.activity-name {
	font-size: 28rpx;
	color: #333;
	text-align: right;
	width: 100%;
}

.code-wrap {
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: flex-end;
	
	.code-btn {
		margin-left: 20rpx;
		flex-shrink: 0;
	}
}

.footer-btn {
	padding: 20rpx 30rpx 60rpx;
}

:deep(.u-form-item--left__content__label) {
	font-size: 28rpx;
	color: #333;
}
</style>
<template>
	<view class="page-wrap edit-address">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="form-container">
				<!-- 收货人 -->
				<view class="form-item">
					<text class="label">收货人</text>
					<input 
						class="input" 
						type="text" 
						v-model="form.contact_person" 
						placeholder="请填写收货人姓名" 
						placeholder-class="placeholder"
					/>
				</view>
				
				<!-- 手机号 -->
				<view class="form-item">
					<text class="label">手机号</text>
					<input 
						class="input" 
						type="number" 
						v-model="form.contact_phone" 
						placeholder="请填写手机号码" 
						placeholder-class="placeholder"
						maxlength="11"
					/>
				</view>
				
				<!-- 选择区域 -->
				<view class="form-item" @click="handleSelectRegion">
					<view class="label-col">
						<text class="label">选择区域</text>
						<text class="value" :class="{ 'placeholder': !form.resolvedAddress }">{{ form.resolvedAddress || '省、市、区/县' }}</text>
					</view>
					<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
				</view>
				
				<!-- 详细地址 -->
				<view class="form-item align-top">
					<view class="label-col">
						<text class="label">详细地址</text>
						<textarea 
							class="textarea" 
							v-model="form.detail_address" 
							placeholder="街道、楼牌号等" 
							placeholder-class="placeholder"
							auto-height
						/>
					</view>
				</view>
				
				<!-- 设为默认 -->
				<view class="form-item switch-item">
					<text class="label">设为默认</text>
					<u-switch :disabled="form.is_default_address" v-model="form.is_default_address" activeColor="#FF4D4F" size="20"></u-switch>
				</view>
			</view>
			
			<view class="submit-btn">
				<CxComfirmBtn 
					text="提交" 
					:btnStyle="{
						background: 'linear-gradient(90deg, #FF6034 0%, #EE0A24 100%)',
						color: '#fff',
						borderRadius: '44rpx',
						height: '88rpx',
						fontSize: '32rpx',
						border: 'none'
					}"
					@click="handleSubmit"
				></CxComfirmBtn>
			</view>
		</view>
		
		<!-- 地区选择器 -->
		<CxAreaPicker
			:show="showRegionPicker"
			@update:show="showRegionPicker = $event"
			@confirm="handleRegionConfirm"
		/>
	</view>
</template>

<script setup name="editAddress">
import { addAddress, editAddress } from '@/api/index.js';

let title = ref("编辑收货地址");
let showRegionPicker = ref(false);

let form = ref({
	id: null,
	contact_person: '',
	contact_phone: '',
	address: '',
	detail_address: '',
	is_default: 2,
	is_default_address: false,
	resolvedAddress: '' // 用于回显已解析的地址名称
});

const eventChannel = ref(null);

onLoad((options) => {
	const instance = getCurrentInstance().proxy;
	eventChannel.value = instance.getOpenerEventChannel();
	if (options && options.title) {
		title.value = options.title;
	};
	eventChannel.value.on('acceptDataFromOpenerPage', function(data) {
		// console.log('接收到上一页数据:', data);
		if (data && data.data) {
			const {id=null, contact_person='', contact_phone='', detail_address='' ,address='', resolvedAddress='',is_default=2,is_default_address } = data.data;
			form.value = {id, contact_person, contact_phone, detail_address,address, resolvedAddress,is_default,is_default_address};
		}
	});
});

const handleSelectRegion = () => {
	showRegionPicker.value = true;
};

const handleRegionConfirm = (e) => {
	const { value } = e;
	if (!value || !Array.isArray(value)) {
		console.warn('Picker value is invalid:', value);
		return;
	}
	
	// value 是选中的对象数组 [省, 市, 区, 镇]
	const regionText = value
		.map(item => (item && item.name) ? item.name : '')
		.join('');
		
	if (regionText) {
		form.value.resolvedAddress = regionText;
	}
	
	// 打印 PID 组合
	// 格式：省ID - 市PID - 区PID - 镇PID
	// 注意：市PID通常等于省ID，区PID等于市ID，镇PID等于区ID
	if (value.length === 4) {
		const prov = value[0] || {};
		const city = value[1] || {};
		const county = value[2] || {};
		const town = value[3] || {};
		
		// 按照用户要求的格式打印: '27466-27466-28589-28590'
		// 对应: prov.id / city.pid / county.pid / town.pid
		const pidString = `${prov.id || 0}/${city.pid || 0}/${county.pid || 0}/${town.pid || 0}`;
		form.value.address = pidString;
		console.log(pidString);
	};	
	showRegionPicker.value = false;
};

const handleSubmit = async () => {
	if (!form.value.contact_person) return uni.showToast({ title: '请填写收货人', icon: 'none' });
	if (!form.value.contact_phone) return uni.showToast({ title: '请填写手机号', icon: 'none' });
	if (!/^1[3-9]\d{9}$/.test(form.value.contact_phone)) return uni.showToast({ title: '手机号格式错误', icon: 'none' });
	if (!form.value.address) return uni.showToast({ title: '请选择区域', icon: 'none' });
	if (!form.value.detail_address) return uni.showToast({ title: '请填写详细地址', icon: 'none' });
	
	uni.showLoading({ title: '提交中...' });
	
	try {
		const params = {
			contact_person: form.value.contact_person,
			contact_phone: form.value.contact_phone,
			address: form.value.address,
			detail_address: form.value.detail_address,
			is_default: form.value.is_default_address ? 1 : 2
		};
		
		let res;
		if (form.value.id) {
			// 编辑模式
			params.id = form.value.id;
			res = await editAddress(params);
		} else {
			// 新增模式
			res = await addAddress(params);
		}
		
		uni.hideLoading();
		
		if (res.code === 200) {
			uni.showToast({ title: '保存成功', icon: 'success' });
			
			// 通过 eventChannel 返回数据给上一页
			if (eventChannel.value) {
				eventChannel.value.emit('acceptAddressUpdate', form.value);
			};		
			// 返回上一页
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
		} else {
			uni.showToast({ title: res.msg || '保存失败，请重试', icon: 'none' });
		}
	} catch (error) {
		uni.hideLoading();
		console.error(error);
	}
};
</script>

<style lang="scss" scoped>
.edit-address {
	background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.page-content {
	padding: 30rpx;
	flex: 1;
}

.form-container {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}
.label {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	width: 180rpx;
	flex-shrink: 0;
}

.input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}

.placeholder {
	color: #999;
}
.value {
	font-size: 28rpx;
	color: #333;
	margin-top: 16rpx;
	
	&.placeholder {
		color: #999;
	}
}

.textarea {
	width: 100%;
	font-size: 28rpx;
	color: #333;
	margin-top: 16rpx;
	min-height: 80rpx;
	line-height: 1.5;
}
.label-col {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.form-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	min-height: 100rpx;
	box-sizing: border-box;
	
	&.align-top {
		align-items: flex-start;
	}
	
	&.switch-item {
		margin-top: 10rpx;
	}
}
.submit-btn {
	margin-top: 60rpx;
}
</style>
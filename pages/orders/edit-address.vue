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
						v-model="form.name" 
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
						v-model="form.phone" 
						placeholder="请填写手机号码" 
						placeholder-class="placeholder"
						maxlength="11"
					/>
				</view>
				
				<!-- 选择区域 -->
				<view class="form-item" @click="handleSelectRegion">
					<view class="label-col">
						<text class="label">选择区域</text>
						<text class="value" :class="{ 'placeholder': !form.region }">{{ form.region || '省、市、区/县' }}</text>
					</view>
					<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
				</view>
				
				<!-- 详细地址 -->
				<view class="form-item align-top">
					<view class="label-col">
						<text class="label">详细地址</text>
						<textarea 
							class="textarea" 
							v-model="form.detail" 
							placeholder="街道、楼牌号等" 
							placeholder-class="placeholder"
							auto-height
						/>
					</view>
				</view>
				
				<!-- 设为默认 -->
				<view class="form-item switch-item">
					<text class="label">设为默认</text>
					<u-switch v-model="form.isDefault" activeColor="#FF4D4F" size="20"></u-switch>
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
		<up-picker
			:show="showRegionPicker"
			:columns="regionColumns"
			keyName="text"
			@confirm="handleRegionConfirm"
			@cancel="showRegionPicker = false"
			@change="handleRegionChange"
		></up-picker>
	</view>
</template>

<script setup name="editAddress">
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import regionData from '@/utils/regionData.js';

const title = ref("编辑收货地址");
const showRegionPicker = ref(false);
const regionColumns = ref([]);

// 初始化列数据
const initColumns = () => {
	// 确保数据存在，避免初始化错误
	if (regionData && regionData.length > 0) {
		const province = regionData;
		const city = province[0].children;
		const area = city[0].children;
		// 必须是响应式的数组结构
		regionColumns.value = [province, city, area];
	} else {
		console.warn('regionData is empty or invalid');
		regionColumns.value = [[], [], []];
	}
};

initColumns();

const form = reactive({
	name: '',
	phone: '',
	region: '',
	detail: '',
	isDefault: false
});

const eventChannel = ref(null);

onLoad(() => {
	const instance = getCurrentInstance().proxy;
	eventChannel.value = instance.getOpenerEventChannel();
	
	eventChannel.value.on('acceptDataFromOpenerPage', function(data) {
		console.log('接收到上一页数据:', data);
		if (data && data.data) {
			const { name, phone, address } = data.data;
			form.name = name;
			form.phone = phone;
			// 这里简单拆分一下地址演示，实际应该有更完善的地址结构
			// 假设 address 是完整地址，这里简单赋给 detail，region 留空或解析
			form.detail = address; 
			// 实际项目中可能需要解析 region
			form.region = ''; 
		}
	});
});

const handleSelectRegion = () => {
	showRegionPicker.value = true;
};

const handleRegionChange = (e) => {
	const { columnIndex, value, indexs } = e;
	
	// 安全获取省份索引
	const provinceIndex = indexs[0] || 0;
	
	if (columnIndex === 0) {
		// 省变动，更新市和区
		const cityList = regionData[provinceIndex]?.children || [];
		const areaList = cityList[0]?.children || [];
		
		// 必须重新赋值整个数组以触发响应式更新（部分框架要求）
		// 但 Vue3 Ref 内部属性修改通常可以。为了保险，保持现有方式或使用 set
		regionColumns.value[1] = cityList;
		regionColumns.value[2] = areaList;
	} else if (columnIndex === 1) {
		// 市变动，更新区
		const cityIndex = indexs[1] || 0;
		// 确保 cityIndex 不越界
		const currentProvince = regionData[provinceIndex];
		if (currentProvince && currentProvince.children && currentProvince.children[cityIndex]) {
			const areaList = currentProvince.children[cityIndex].children || [];
			regionColumns.value[2] = areaList;
		} else {
			regionColumns.value[2] = [];
		}
	}
};

const handleRegionConfirm = (e) => {
	const { value } = e;
	if (!value || !Array.isArray(value)) {
		console.warn('Picker value is invalid:', value);
		return;
	}
	// value 是选中的对象数组 [省对象, 市对象, 区对象]
	// 增加空值检查，防止 text 读取错误
	const regionText = value
		.map(item => (item && item.text) ? item.text : '')
		.join('');
		
	if (regionText) {
		form.region = regionText;
	}
	showRegionPicker.value = false;
};

const handleSubmit = () => {
	if (!form.name) return uni.showToast({ title: '请填写收货人', icon: 'none' });
	if (!form.phone) return uni.showToast({ title: '请填写手机号', icon: 'none' });
	if (!/^1[3-9]\d{9}$/.test(form.phone)) return uni.showToast({ title: '手机号格式错误', icon: 'none' });
	if (!form.region) return uni.showToast({ title: '请选择区域', icon: 'none' });
	if (!form.detail) return uni.showToast({ title: '请填写详细地址', icon: 'none' });
	
	uni.showLoading({ title: '提交中...' });
	
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({ title: '保存成功', icon: 'success' });
		
		// 通过 eventChannel 返回数据给上一页
		if (eventChannel.value) {
			eventChannel.value.emit('acceptAddressUpdate', {
				name: form.name,
				phone: form.phone,
				address: (form.region || '') + form.detail
			});
		}
		
		// 返回上一页
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}, 1000);
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
	
	.label-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		
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
	}
}

.submit-btn {
	margin-top: 60rpx;
}
</style>

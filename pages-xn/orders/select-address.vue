<template>
	<view class="page-wrap select-address">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="address-list">
				<view class="address-item" v-for="(item, index) in addressList" :key="item.id" @click="handleSelect(item)">
					<view class="info-row">
						<u-icon name="map" size="32rpx" color="#34332E" style="margin-right: 20rpx;"></u-icon>
						<text class="name">{{ item.contact_person }}</text>&nbsp;&nbsp;
						<text class="phone">{{ item.contact_phone }}</text>
						<view v-if="item.is_default_address" class="default-tag">默认</view>
					</view>
					<view class="address-detail">
						{{ item.resolvedAddress }}{{ item.detail_address }}
					</view>
				</view>
			</view>
			
			<view class="add-btn-wrap">
				<CxComfirmBtn 
					text="添加地址"
					@click="handleAdd"
				></CxComfirmBtn>
			</view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="selectAddress">
import { memberAddress } from '@/api/xn.js';
import { getRegionName } from '@/utils/public.js';
import { ref, getCurrentInstance } from 'vue';
import { onShow } from '@dcloudio/uni-app';

let title = ref("选择收货地址");
let addressList = ref([]);
const { proxy } = getCurrentInstance();

const fetchAddressList = async () => {
	try {
		const res = await memberAddress();
		if (res.code === 0 || res.code === 200) {
			const list = Array.isArray(res.data.lists) ? res.data.lists : (res.data && res.data.data.lists ? res.data.data.lists : []);
			if (Array.isArray(list)) {
				addressList.value = list.map(item => {
					return {
						id: item.id,
						contact_person: item.name || item.consignee || item.contact_person || '',
						contact_phone: item.phone || item.mobile || item.contact_phone || '',
						address: item.address || '',
						resolvedAddress: getRegionName(item.address),
						detail_address: item.detail || item.address_detail || item.detail_address || '',
						is_default: item.is_default,
						is_default_address: item.is_default == 1 ? true : false
					};
				});
			}
		}
	} catch (e) {
		console.error('获取地址列表失败', e);
	}
};

onShow(() => {
	fetchAddressList();
});

const handleSelect = (item) => {
	const eventChannel = proxy.getOpenerEventChannel();
	eventChannel.emit('selectAddress', item);
	uni.navigateBack();
};

const handleAdd = () => {
	uni.navigateTo({
		url: `/pages-xn/orders/edit-address?title=新增收货地址`,
	});
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background: url("/static/images/index/bg.png") no-repeat center/cover;
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.page-content {
	padding: 24rpx;
	flex: 1;
	overflow-y: auto;
	padding-bottom: 140rpx;
}

.address-item {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	position: relative;
}

.info-row {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	
	.name {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.phone {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
}

.default-tag {
	margin-left: auto;
	background: #EDD7A1;
	color: #7A5632;
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
}

.address-detail {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	padding-left: 52rpx; // Align with text start (icon width + margin)
}

.add-btn-wrap {
	position: fixed;
	bottom: 40rpx;
	left: 40rpx;
	right: 40rpx;
	z-index: 100;
}
</style>
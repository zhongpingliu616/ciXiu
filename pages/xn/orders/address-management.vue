<template>
	<view class="page-wrap address-management">
		<LayoutNavigation title="收货地址" />
		<view class="page-content">
			<view class="address-list">
				<view class="address-item" v-for="(item, index) in addressList" :key="item.id" :class="{ 'checked': item.is_default_address }">
					<view class="info-row">
						<u-icon name="map" size="32rpx" color="#34332E" style="margin-right: 20rpx;"></u-icon>
						<text class="name">{{ item.contact_person }}</text>&nbsp;&nbsp;
						<text class="phone">{{ item.contact_phone }}</text>
					</view>
					<view class="address-detail">
						{{ item.resolvedAddress }}{{ item.detail_address }}
					</view>
					<view class="action-row">
						<view class="default-wrap" @click.stop="handleSetDefault(index)">
							<view class="radio-icon">
								<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="30rpx" v-if="item.is_default_address"></u-icon>
								<uni-icons type="circle" color="#ccc" size="30rpx" v-else></uni-icons>
								 &nbsp;
							</view>

							<text class="default-text">默认地址</text>
						</view>
						<view class="btn-group">
							<view class="btn-item">
								<CxComfirmBtn 
									text="删除" 
									@click.stop='handleDelete(index)'
									:btnStyle="{
										height: '60rpx',
										padding: '0rpx 50rpx',
										background: 'none',
										color: '#ccc',
										borderColor: '#ccc',
									}"/>
							</view>
							<view class="btn-item">
								<!-- <u-icon name="edit-pen" color="#666" size="28rpx"></u-icon>
								<text>编辑</text> -->
								<CxComfirmBtn 
									text="修改"
									 @click.stop="handleEdit(item)" 
									:btnStyle="{
										height: '60rpx',
										padding: '0rpx 50rpx',
									}" />
							</view>
							<!-- <view class="btn-item" @click.stop="handleDelete(index)">
								<u-icon name="trash" color="#666" size="28rpx"></u-icon>
								<text>删除</text>
							</view> -->
							
						</view>
					</view>
				</view>
			</view>
			
			<view class="add-btn-wrap">
				<CxComfirmBtn 
					text="新增收货地址" 
					:btnStyle="{
						height: '88rpx',
					}"
					@click="handleAdd"
				></CxComfirmBtn>
			</view>
		</view>
	</view>
	<CxModal
	  v-model:show="showDeleteModal"
	  content="确定删除该地址吗？"
	  @confirm="confirmDelete"
	/>
</template>

<script setup>
import { memberAddress, editAddress, deleteAddress } from '@/api/xn.js';
import { getRegionName } from '@/utils/public.js';
import CxComfirmBtn from '../../../components/CxComfirmBtn.vue';

let showDeleteModal = ref(false);
let deleteIndex = null;
let addressList = ref([]);

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
						// 将原始 ID 串转换为中文区域
						address: item.address || '',
						// 保存原始 ID 串，以便编辑时使用（如果需要）
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

const handleSetDefault = async (index) => {
	const item = addressList.value[index];
	if (item.is_default_address) return;
	uni.showLoading({ title: '设置中...' });
	try {
		const params = {
			id: item.id,
			contact_person: item.contact_person,
			contact_phone: item.contact_phone,
			address: item.address,
			detail_address: item.detail_address,
			is_default: 1
		};
		
		const res = await editAddress(params);
		
		if (res.code === 200 || res.code === 0) {
			uni.showToast({ title: '设置成功', icon: 'success' });
			// 更新本地列表状态
			addressList.value.forEach((addr, idx) => {
				if(idx === index){
					addr.is_default = 1;
					addr.is_default_address = true;
				} else {
					addr.is_default = 2;
					addr.is_default_address = false;
				}
			});
		} else {
			uni.showToast({ title: res.msg || '设置失败', icon: 'none' });
		}
	} catch (e) {
		console.error(e);
		uni.showToast({ title: '设置失败', icon: 'none' });
	} finally {
		uni.hideLoading();
	}
};

const handleEdit = (item) => {
	uni.navigateTo({
		url: '/pages/xn/orders/edit-address',
		success: (res) => {
			res.eventChannel.emit('acceptDataFromOpenerPage', {
				data: {
					id: item.id,
					contact_person: item.contact_person,
					contact_phone: item.contact_phone,
					detail_address: item.detail_address, 
					address: item.address,
					is_default: item.is_default,
					is_default_address: item.is_default_address,
					resolvedAddress: item.resolvedAddress
				}});
		}
	});
};
const confirmDelete = async () => {
	const item = addressList.value[deleteIndex];
	if(item.is_default_address) return uni.showToast({ title: '默认地址不能删除', icon: 'none' });
	try {
		const res = await deleteAddress({ id: item.id });
		if (res.code === 200 || res.code === 0) {
			addressList.value.splice(deleteIndex, 1);
			uni.showToast({ title: '地址已删除', icon: 'none' });
		} else {
			uni.showToast({ title: res.msg || '删除失败', icon: 'none' });
		}
	} catch (e) {
		console.error(e);
		uni.showToast({ title: '删除失败', icon: 'none' });
	}
};
const handleDelete = (index) => {
	showDeleteModal.value = true;
	deleteIndex = index;
};

const handleAdd = () => {
	uni.navigateTo({
		url: `/pages/xn/orders/edit-address?title=新增收货地址&addressLength=${addressList.value.length}`,
	});
};
</script>

<style lang="scss" scoped>
::v-deep {
	uni-text{
			white-space: nowrap;
		}
}
.address-management {
	display: flex;
	flex-direction: column;
}

.page-content {
	padding: 24rpx;
	flex: 1;
	padding-bottom: 120rpx; // 留出底部按钮空间
}
.radio-icon{
	display: flex;

}
.default-wrap{
	display: flex;
	align-items: center;
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

.address-detail {
	font-size: 28rpx;
	color: #666;
	line-height: 1.5;
	margin-bottom: 30rpx;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #eee;
}
.btn-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	
	text {
		font-size: 26rpx;
		color: #666;
	}
}
.btn-group {
		display: flex;
		gap: 30rpx;
	}
.action-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.address-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	&.checked {
		position: relative;
		&::after {
			content: ' 默认 ';
			padding: 12rpx 30rpx;
			position: absolute;
			top: 10rpx;
			right: 10rpx;
			background: linear-gradient(135deg, #EDD7A1, #F0ECCF);
			border-radius: 10rpx;
			border-top-right-radius: 20rpx;
			border-bottom-left-radius: 20rpx;
			pointer-events: none;
			color: #7A5632;
			font-size: 18rpx;
		}
	}
}

.add-btn-wrap {
	position: fixed;
	bottom: 40rpx;
	left: 24rpx;
	right: 24rpx;
	z-index: 100;
}
</style>
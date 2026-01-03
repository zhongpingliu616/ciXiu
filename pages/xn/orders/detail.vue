<template>
	<view class="page-wrap order-detail">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- 商品卡片 -->
			<view class="goods-card">
				<view class="shop-info">
					<view class="shop-left">
						<u-avatar src="https://cdn.uviewui.com/uview/album/1.jpg" size="40"></u-avatar>
						<text class="shop-name">古韵民族丝绸非遗刺绣</text>
						<u-icon name="arrow-right" color="#999" size="24rpx"></u-icon>
					</view>
					<text class="order-status-text" :style="{ color: statusColor }">{{ statusText }}</text>
				</view>
				
				<view class="goods-info">
					<image class="goods-img" src="https://cdn.uviewui.com/uview/album/1.jpg" mode="aspectFill"></image>
					<view class="goods-detail">
						<view class="goods-row">
							<text class="goods-title">丝绸非遗刺绣</text>
							<text class="goods-price">￥165.00</text>
						</view>
						<view class="goods-sku">款号UKMEG 2569A</view>
						<view class="goods-sku">2023最新款</view>
						<view class="goods-num">X1</view>
					</view>
				</view>
			</view>

			<!-- 订单详情列表 -->
			<view class="detail-card">
				<view class="detail-item">
					<text class="label">收货人：</text>
					<text class="value">{{ addressInfo.name }}</text>
				</view>
				<view class="detail-item">
					<text class="label">联系电话：</text>
					<text class="value">{{ addressInfo.phone }}</text>
				</view>
				<view class="detail-item align-top" @click="handleEditAddress">
					<text class="label">收货地址：</text>
					<view class="value-wrap">
						<text class="value address">{{ addressInfo.address }}</text>
						<u-icon name="arrow-right" color="#999" size="24rpx" style="margin-left: 10rpx;"></u-icon>
					</view>
				</view>
				<view class="divider"></view>
				<view class="detail-item">
					<text class="label">订单编号：</text>
					<text class="value">15115115101</text>
				</view>
				<view class="detail-item">
					<text class="label">创建时间：</text>
					<text class="value">2023-10-30 10:32:17</text>
				</view>
				<view class="detail-item">
					<text class="label">付款时间：</text>
					<text class="value">2023-10-30 10:32:17</text>
				</view>
				<view class="detail-item">
					<text class="label">发货时间：</text>
					<text class="value">2023-10-30 10:32:17</text>
				</view>
				<view class="detail-item">
					<text class="label">发货时间：</text>
					<text class="value">2023-10-30 10:32:17</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-btns">
			<!-- 待支付: 取消订单, 去支付 -->
			<template v-if="orderInfo.status === 10">
				<view class="btn-item">
					<CxComfirmBtn 
						text="取消订单" 
						:btnStyle="cancelBtnStyle"
						@click="handleCancel"
					></CxComfirmBtn>
				</view>
				<view class="btn-item">
					<CxComfirmBtn 
						text="去支付" 
						:btnStyle="primaryBtnStyle"
						@click="handlePay"
					></CxComfirmBtn>
				</view>
			</template>

			<!-- 待发货: 提醒发货 -->
			<template v-else-if="orderInfo.status === 20">
				<view class="btn-item">
					<CxComfirmBtn 
						text="提醒发货" 
						:btnStyle="cancelBtnStyle"
						@click="handleRemind"
					></CxComfirmBtn>
				</view>
			</template>

			<!-- 已交付: 查看物流 -->
			<template v-else-if="orderInfo.status === 30">
				<view class="btn-item">
					<CxComfirmBtn 
						text="查看物流" 
						:btnStyle="cancelBtnStyle"
						@click="handleLogistics"
					></CxComfirmBtn>
				</view>
			</template>

			<!-- 待验收: 查看物流, 确认收货 -->
			<template v-else-if="orderInfo.status === 40">
				<view class="btn-item">
					<CxComfirmBtn 
						text="查看物流" 
						:btnStyle="cancelBtnStyle"
						@click="handleLogistics"
					></CxComfirmBtn>
				</view>
				<view class="btn-item">
					<CxComfirmBtn 
						text="确认收货" 
						:btnStyle="primaryBtnStyle"
						@click="handleConfirm"
					></CxComfirmBtn>
				</view>
			</template>
			
			<!-- 验收成功: 评价, 退货 -->
			<template v-else-if="orderInfo.status === 50">
				<view class="btn-item">
					<CxComfirmBtn 
						text="退货" 
						:btnStyle="cancelBtnStyle"
						@click="handleReturn"
					></CxComfirmBtn>
				</view>
				<view class="btn-item">
					<CxComfirmBtn 
						text="评价订单" 
						:btnStyle="primaryBtnStyle"
						@click="handleEvaluate"
					></CxComfirmBtn>
				</view>
			</template>
			
			<!-- 验收失败/已取消: 删除订单 -->
			<template v-else-if="[51, 60].includes(orderInfo.status)">
				<view class="btn-item">
					<CxComfirmBtn 
						text="删除订单" 
						:btnStyle="cancelBtnStyle"
						@click="handleDelete"
					></CxComfirmBtn>
				</view>
			</template>
		</view>
	</view>
</template>

<script setup name="detail">
const title = ref("订单详情");
const orderId = ref('');

// 模拟订单数据，实际应根据 orderId 请求
const orderInfo = ref({});

const statusMap = {
	10: { text: '待支付', color: '#F9402C' },
	20: { text: '待发货', color: '#D1A156' },
	30: { text: '已交付', color: '#8F8F8F' }, 
	40: { text: '待验收', color: '#F9402C' },
	50: { text: '验收成功', color: '#00C853' }, 
	51: { text: '验收失败', color: '#F9402C' },
	60: { text: '已取消', color: '#8F8F8F' }
};

const statusText = computed(() => {
	return statusMap[orderInfo.value.status]?.text || '未知状态';
});

const statusColor = computed(() => {
	return statusMap[orderInfo.value.status]?.color || '#333';
});

// 按钮样式
const primaryBtnStyle = {
	background: 'linear-gradient(90deg, #FF6034 0%, #EE0A24 100%)',
	color: '#fff',
	borderRadius: '40rpx',
	height: '80rpx',
	fontSize: '30rpx',
	border: 'none'
};

const cancelBtnStyle = {
	background: 'rgba(255,255,255,0.1)',
	color: '#fff',
	borderRadius: '40rpx',
	height: '80rpx',
	fontSize: '30rpx',
	border: '1px solid rgba(255,255,255,0.3)',
	backgroundColor: 'rgba(100, 100, 100, 0.4)'
};

const handleEvaluate = () => {
	uni.showToast({ title: '评价功能开发中', icon: 'none' });
};

const handleReturn = () => {
	uni.showToast({ title: '退货申请已提交', icon: 'none' });
};

const handleEditAddress = () => {
	// 实际开发中可以将当前地址信息通过 eventChannel 或 query 传递
	uni.navigateTo({
		url: '/pages/xn/orders/edit-address',
		events: {
			acceptAddressUpdate: function(data) {
				console.log('接收到地址更新:', data);
				// 更新页面上的地址信息
				// 注意：这里需要确保 orderInfo 中有对应的字段，或者我们直接更新页面展示的变量
				// 假设我们增加了一些响应式变量来存储展示用的地址信息，或者更新 orderInfo
				// 为了演示，这里假设 orderInfo 有 address 等字段，或者我们单独定义
				
				// 更好的方式是将页面上展示的地址信息绑定到变量
				addressInfo.value = data;
			}
		},
		success: function(res) {
			// 通过eventChannel向被打开页面传送数据
			res.eventChannel.emit('acceptDataFromOpenerPage', { 
				data: addressInfo.value
			})
		}
	});
};

const addressInfo = ref({
	name: 'wwww',
	phone: '15115115101',
	address: '北京市昌平区苏家坨地区北京凤凰岭自然风景公园东北'
});

const handleCancel = () => {
	uni.showToast({ title: '取消订单成功', icon: 'none' });
	orderInfo.value.status = 60; // 模拟取消后更新状态
};

const handlePay = () => {
	uni.showToast({ title: '支付成功', icon: 'success' });
	orderInfo.value.status = 20; // 模拟支付后变为待发货
};

const handleRemind = () => {
	uni.showToast({ title: '已提醒商家发货', icon: 'success' });
};

const handleLogistics = () => {
	uni.showToast({ title: '查看物流', icon: 'none' });
};

const handleConfirm = () => {
	uni.showToast({ title: '已确认收货', icon: 'success' });
	orderInfo.value.status = 50; // 模拟确认后变为验收成功
};

const handleDelete = () => {
	uni.showToast({ title: '删除订单', icon: 'none' });
	uni.navigateBack();
};

onLoad((options) => {
	if (options.id) {
		orderId.value = options.id;
		console.log('订单详情ID:', orderId.value);
		// 模拟获取详情，这里简单根据 ID 或随机生成一个状态来演示动态效果
		// 实际项目中应调用 API：fetchOrderDetail(options.id).then(res => orderInfo.value = res)
		
		// 模拟逻辑：如果 id 包含某些特征，赋予特定状态，否则随机
		// 为了演示方便，这里随机生成一个状态
		const statuses = [10, 20, 30, 40, 50, 60];
		const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
		
		orderInfo.value = {
			id: options.id,
			status: randomStatus, // 使用随机状态
			// status: 10, // 固定为待支付用于测试
			title: '丝绸非遗刺绣',
			price: '165.00',
			image: 'https://cdn.uviewui.com/uview/album/1.jpg'
		};
	}
});
</script>

<style lang="scss" scoped>
.order-detail {
	background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.page-content {
	padding: 30rpx;
	flex: 1;
}

.goods-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	
	.shop-name {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin: 0 10rpx 0 20rpx;
	}
	.shop-left {
		display: flex;
		align-items: center;
	}
	
	.order-status-text {
		font-size: 28rpx;
		color: #00C853; // 绿色
		font-weight: bold;
	}
	.shop-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.goods-img {
		width: 180rpx;
		height: 180rpx;
		border-radius: 12rpx;
		margin-right: 24rpx;
		flex-shrink: 0;
	}
	.goods-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		flex: 1;
		margin-right: 20rpx;
	}
	
	.goods-price {
		font-size: 32rpx;
		color: #FF4D4F;
		font-weight: bold;
	}
	.goods-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	
	.goods-sku {
		font-size: 24rpx;
		color: #999;
	}
	
	.goods-num {
		font-size: 28rpx;
		color: #333;
		margin-top: 10rpx;
	}
	.goods-detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.goods-info {
		display: flex;
	}
}

.detail-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 120rpx; // 留出底部按钮位置
	
	.detail-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
		line-height: 1.4;
		
		&.align-top {
			align-items: flex-start;
		}
		
		.label {
			font-size: 28rpx;
			color: #333;
			width: 160rpx;
			flex-shrink: 0;
		}
		
		.value {
			font-size: 28rpx;
			color: #999;
			text-align: right;
			flex: 1;
			
			&.address {
				text-align: right;
			}
		}
		
		.value-wrap {
			flex: 1;
			display: flex;
			align-items: flex-start;
			justify-content: flex-end;
		}
	}
	
	.divider {
		height: 1px;
		background: #f5f5f5;
		margin: 30rpx 0;
	}
}

.footer-btns {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 40rpx 40rpx;
	display: flex;
	justify-content: space-between;
	gap: 30rpx;
	// background: rgba(0,0,0,0.5); // 稍微加点背景让按钮更清晰
	z-index: 100;
	
	.btn-item {
		flex: 1;
	}
}
</style>

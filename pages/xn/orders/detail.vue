<template>
	<view class="page-wrap order-detail">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<template v-for="(item,index) in orderInfoList" :key="index">
				
			
			<!-- 商品卡片 -->
			<view class="goods-card">
				<view class="shop-info">
					<view class="shop-left">
						<u-avatar src="https://cdn.uviewui.com/uview/album/1.jpg" size="40"></u-avatar>
						<text class="shop-name">{{item.name}}</text>
						<u-icon name="arrow-right" color="#999" size="24rpx"></u-icon>
					</view>
					<text class="order-status-text" :style="{ color: statusMap[item.status||10].color }">{{  statusMap[item.status||10].text }}</text>
				</view>
				
				<view class="goods-info">
					<image class="goods-img" :src="item.image" mode="aspectFill"></image>
					<view class="goods-detail">
						<view class="goods-row">
							<text class="goods-title">{{item.name}}</text>
							<text class="goods-price">￥{{item.reward_amount}}</text>
						</view>
						<view class="goods-sku">{{item.name}}</view>
						<!-- <view class="goods-sku">2023最新款</view> -->
						<view class="goods-num">X1</view>
					</view>
				</view>
			</view>

			<!-- 订单详情列表 -->
			<view class="detail-card">
				<view class="detail-item">
					<text class="label">收货人：</text>
					<text class="value">{{ item.username }}</text>
				</view>
				<view class="detail-item">
					<text class="label">联系电话：</text>
					<text class="value">{{ item.address.contact_phone }}</text>
				</view>
				<view class="detail-item align-top" @click="handleEditAddress">
					<text class="label">收货地址：</text>
					<view class="value-wrap">
						<text class="value address">{{ getRegionName(item.address) }} {{ item.detail_address }}</text>
						<u-icon name="arrow-right" color="#999" size="24rpx" style="margin-left: 10rpx;"></u-icon>
					</view>
				</view>
				<view class="divider"></view>
				<view class="detail-item">
					<text class="label">订单编号：</text>
					<text class="value">{{item.order_id}}</text>
				</view>
				<view class="detail-item">
					<text class="label">创建时间：</text>
					<text class="value">{{item.order_id}}</text>
				</view>
				<view class="detail-item" v-if="item.pay_time">
					<text class="label">支付时间：</text>
					<text class="value">{{item.pay_time}}</text>
				</view>
				<view class="detail-item" v-if="item.send_material_time">
					<text class="label">发送材料时间：</text>
					<text class="value">{{item.send_material_time}}</text>
				</view>
				<view class="detail-item" v-if="item.receive_material_time">
					<text class="label">收到材料时间：</text>
					<text class="value">{{item.receive_material_time}}</text>
				</view>
				<view class="detail-item" v-if="item.send_finished_time">
					<text class="label">发送成品时间：</text>
					<text class="value">{{item.send_finished_time}}</text>
				</view>
				<view class="detail-item" v-if="item.receive_finished_time">
					<text class="label">收到成品时间：</text>
					<text class="value">{{item.receive_finished_time}}</text>
				</view>
				<view class="detail-item" v-if="item.acceptance_success_time">
					<text class="label">验收成功时间：</text>
					<text class="value">{{item.acceptance_success_time}}</text>
				</view>
				<view class="detail-item" v-if="item.acceptance_failed_time">
					<text class="label">验收失败时间：</text>
					<text class="value">{{item.acceptance_failed_time}}</text>
				</view>
				<view class="detail-item" v-if="item.cancel">
					<text class="label">取消时间：</text>
					<text class="value">{{item.cancel}}</text>
				</view>
				<view class="detail-item" v-if="item.end_time">
					<text class="label">活动结束：</text>
					<text class="value">{{item.end_time}}</text>
				</view>
			</view>

			<!-- 底部按钮 -->
			<view class="footer-btns" v-if="false">
				<!-- 待支付: 取消订单, 去支付 -->
				<template v-if="item.status === 10">
					<view class="btn-item">
						<CxComfirmBtn 
							text="取消订单" 
							:btnStyle="primaryBtnStyle"
							@click="handleCancel(index,item)"
						></CxComfirmBtn>
					</view>
					<view class="btn-item">
						<CxComfirmBtn 
							text="去支付" 
							:btnStyle="primaryBtnStyle"
							@click="handlePay(index,item)"
						></CxComfirmBtn>
					</view>
				</template>

				<!-- 待发货: 提醒发材料 -->
				<template v-else-if="item.status === 20">
					<view class="btn-item">
						<CxComfirmBtn 
							text="提醒发货" 
							:btnStyle="primaryBtnStyle"
							@click="handleRemind(index,item)"
						></CxComfirmBtn>
					</view>
				</template>

				<!-- 待接材料: 查看物流 已收材料-->
				<template v-else-if="item.status === 30">
					<view class="btn-item">
						<CxComfirmBtn 
							text="查看物流" 
							:btnStyle="primaryBtnStyle"
							@click="handleLogistics(index,item)"
						></CxComfirmBtn>
					</view>
					&nbsp;&nbsp;<view class="btn-item">
						<CxComfirmBtn 
							text="已接收材料" 
							:btnStyle="primaryBtnStyle"
							@click="receivingMaterials(index,item)"
						></CxComfirmBtn>
					</view>
				</template>

				<!-- 待发成品:  制作完成 -->
				<template v-else-if="item.status === 40">
					<view class="btn-item">
						<CxComfirmBtn 
							text="制作完成" 
							:btnStyle="primaryBtnStyle"
							@click="produced(index,item)"
						></CxComfirmBtn>
					</view>
				</template>
				
				<!-- 验收成功: 评价, 退货 -->
				<template v-else-if="item.status === 70">
					<!-- <view class="btn-item">
						<CxComfirmBtn 
							text="退货" 
							:btnStyle="cancelBtnStyle"
							@click="handleReturn"
						></CxComfirmBtn>
					</view> -->
					<view class="btn-item">
						<CxComfirmBtn 
							text="评价订单" 
							:btnStyle="primaryBtnStyle"
							@click="handleEvaluate(index,item)"
						></CxComfirmBtn>
					</view>
				</template>
				
				<!-- 验收失败/已取消: 删除订单 -->
				<template v-else-if="item.status === 90">
					<view class="btn-item">
						<CxComfirmBtn 
							text="删除订单" 
							:btnStyle="primaryBtnStyle"
							@click="handleDelete(index,item)"
						></CxComfirmBtn>
					</view>
				</template>
			</view>
			</template>
		</view>

		
	</view>
</template>

<script setup name="detail">
import {orderDetails} from '@/api/index.js'
import { getRegionName } from '@/utils/public.js';
const { proxy } = getCurrentInstance();
const title = ref("订单详情");
const orderInfoList = ref([]);
let parentItemInfo = ref({});
const statusMap = {
  10: { text: '待支付', color: '#FF4D4F' },   // 红｜强提醒
  20: { text: '待发货', color: '#FA8C16' },   // 橙｜进行中
  30: { text: '待接受材料', color: '#1890FF' }, // 蓝｜处理中
  40: { text: '待发成品', color: '#FA541C' },   // 深橙｜关键节点
  50: { text: '待接收成品', color: '#13C2C2' }, // 青｜物流流转
  60: { text: '待验收', color: '#722ED1' },     // 紫｜待确认
  70: { text: '验收成功', color: '#52C41A' },   // 绿｜成功
  80: { text: '验收失败', color: '#A8071A' },   // 深红｜失败
  90: { text: '取消订单', color: '#8C8C8C' }    // 灰｜终止
};

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

const handleEditAddress = () => {
	return ;
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
// 取消订单
const handleCancel = (index,item) => {
	uni.showToast({ title: '取消订单成功', icon: 'none' });
};
// 支付订单
const handlePay = (index,item) => {
	uni.showToast({ title: '支付成功', icon: 'success' });
};

const handleRemind = (index,item) => {
	uni.showToast({ title: '已提醒商家发货', icon: 'success' });
};
// 查看物流
const handleLogistics = (index,item) => {
	uni.showToast({ title: '查看物流', icon: 'none' });
};
// 制作完成
const produced = (index,item) => {
	uni.showToast({ title: '制作完成，已通知发成品', icon: 'success' });
};
// 已接收材料
const receivingMaterials = (index,item) => {
	uni.showToast({ title: '已接收材料', icon: 'success' });
};
// 删除订单
const handleDelete = () => {
	uni.showToast({ title: '删除订单', icon: 'none' });
	uni.navigateBack();
};
// 评价订单
const handleEvaluate = () => {
	uni.showToast({ title: '评价功能开发中', icon: 'none' });
};

const handleReturn = () => {
	uni.showToast({ title: '退货申请已提交', icon: 'none' });
};

const getOrderData = async ()=>{
	const { code=9999, data,msg } = await orderDetails({ order_id: parentItemInfo.value.order_id });
	if (code === 200) {
		 if(data.lists){
			orderInfoList.value = [data.lists];
		 };
		 
	} else {
		uni.showToast({
			title: msg || '数据加载失败',
			icon: 'none'
		});
	}
};
onLoad((options) => {
		const eventChannel = proxy.getOpenerEventChannel();
		eventChannel.on('sendOrderDatas', (data) => {
			if(data && data.orderInfo){
				parentItemInfo.value = data.orderInfo || {};
				getOrderData();
				// orderInfo.value = {
				// 	id: options.id,
				// 	status: parentItemInfo.value.status, // 使用随机状态
				// 	// status: 10, // 固定为待支付用于测试
				// 	title: '丝绸非遗刺绣',
				// 	price: '165.00',
				// 	image: 'https://cdn.uviewui.com/uview/album/1.jpg'
				// };
			}
		});
		
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

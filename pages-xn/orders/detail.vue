<template>
	<view class="page-wrap order-detail">
		<LayoutNavigation :title="title" >
			<template #right>
				<CxIconFont code="&#xe88f;" size="38rpx" color="#fff" @tap="contactService"></CxIconFont>
			</template>
		</LayoutNavigation>
		<view class="page-content" v-if="orderItemDetail">
			<!-- 状态头部 -->
			<view class="status-header">
				<uni-icons custom-prefix="iconfont" type="icon-xiaohuoche" size="40rpx" color="#ffffff" v-if="orderItemDetail.status == 30 || orderItemDetail.status == 40"></uni-icons>
				<uni-icons custom-prefix="iconfont" type="icon-leiji-yijiaofuxiangmushuliang" size="40rpx" color="#ffffff" v-else-if="orderItemDetail.status == 70"></uni-icons>
				<u-icon name="hourglass" size="50rpx" color="#fff" v-else></u-icon>
				&nbsp;&nbsp;
				<text class="status-text" v-if="orderItemDetail.status === 30 && orderItemDetail.round_no > 0">已退回</text>
				<text class="status-text" v-else>{{ statusText }}</text>
			</view>
			<!-- 备注信息 -->
			<view class="card remark-card" v-if="orderItemDetail.remark || orderItemDetail.actual_amount > 0">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text" v-if="orderItemDetail.status === 30 && orderItemDetail.round_no > 0">退回原因</text>
					<text class="title-text" v-if="orderItemDetail.status === 40 && orderItemDetail.round_no > 0">退回原因</text>
					<text class="title-text" v-if="orderItemDetail.status === 70">验收信息</text>
					<text class="right-text" v-else>备注：</text>
				</view>
				<view class="remark-content" v-if="orderItemDetail.actual_amount > 0">
					本次验收金额为：<text type="warning" class="value" style="font-size: 24rpx; color: #FF5500;">{{ orderItemDetail.actual_amount || '' }}</text> 金额已发放至你余额，请注意查收！
					
				</view>
				<view class="remark-content" v-else>
					{{ orderItemDetail.remark || '' }}
				</view>
			</view>
			<!-- 平台收货地址信息 -->
			<view class="card" v-if="orderItemDetail.finish_order_info">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">平台收货地址信息</text>
				</view>
				<view class="info-row">
					<text class="label">联系人</text>
					<text class="value">{{ orderItemDetail.finish_order_info?.contact_person || '' }}</text>
				</view>
				<view class="info-row">
					<text class="label">联系电话</text>
					<text class="value">{{ orderItemDetail.finish_order_info?.contact_phone || '' }}</text>
				</view>
				<view class="info-row">
					<text class="label">收货地址</text>
					<text class="value">{{ orderItemDetail.finish_order_info?.shipping_address || '' }}</text>
				</view>
				<view class="info-row">
					<text class="label">物流单号</text>
					<text class="value">{{ orderItemDetail.finish_order_info?.tracking_number || '' }}</text>
				</view>
				<view class="info-row">
					<text class="label">物流公司</text>
					<text class="value">{{ orderItemDetail.finish_order_info?.logistics_company || '快递' }}</text>
				</view>
			</view>
			<!-- 地址卡片 -->
			<view class="card address-card" v-if="orderItemDetail.address_info">
				<view class="address-row">
					<u-icon name="map-fill" color="#FF4D4F" size="50rpx"></u-icon>
					<text class="name">{{ orderItemDetail.address_info?.contact_person || '' }}</text>
						<text class="phone">{{ orderItemDetail.address_info?.contact_phone || '' }}</text>
					</view>
				<view class="address-detail">
					{{ getRegionName(orderItemDetail.address_info.address) }} {{ orderItemDetail.address_info?.detail_address || '' }}
				</view>
			</view>

			<!-- 物流信息 (待发成品/制作中 显示) -->
			<view class="card" v-if="[30, 40].includes(orderItemDetail.status)">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">物流信息</text>
				</view>
				<view class="info-row">
					<text class="label">物流单号</text>
					<text class="value">{{ orderItemDetail.material_order_info?.tracking_number || '' }}</text>
				</view>
				<view class="info-row">
					<text class="label">物流公司</text>
					<text class="value">{{ orderItemDetail.material_order_info?.logistics_company || '快递' }}</text>
				</view>
			</view>

			<!-- 订单信息卡片 -->
			<view class="card order-info-card">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">订单信息</text>
				</view>
				
				<!-- 商品列表 -->
				<view class="goods-item" v-for="(goods, idx) in orderInfoList" :key="idx">
					<image :src="goods.image" class="goods-img" mode="aspectFill"></image>
					<view class="goods-content">
						<view class="goods-title">{{ goods.name }}</view>
						<view class="tags">
							<CxTag text="工期30天" :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']" color="#bfa15f" />
							&nbsp;
							<CxTag text="锦初等级" :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']" color="#999" />
						</view>
						<view class="price-row">
							<text class="price">¥{{ goods.reward_amount }}</text>
							<text class="num">x1</text>
						</view>
					</view>
				</view>

				<!-- 费用汇总 -->
				<view class="fee-section">
					<view class="fee-row">
						<text class="label">订单押金 (共{{ orderInfoList.length }}件)</text>
						<text class="value">¥ {{ Number(orderItemDetail.deposit || 0).toFixed(2) }}</text>
					</view>
					<view class="fee-row">
						<text class="label">运费</text>
						<text class="value">¥ {{ Number(orderItemDetail.shipping_fee || 0).toFixed(2) }}</text>
					</view>
					<view class="fee-row total-row">
						<text class="label">订单总价</text>
						<text class="value total-price">¥ {{ Number(orderItemDetail.final_amount || 0).toFixed(2) }}</text>
					</view>
				</view>

				<view class="divider"></view>

				<!-- 订单元数据 -->
				<view class="meta-section">
					<view class="meta-row">
						<text class="label">订单号</text>
						<text class="value">{{ orderItemDetail.order_id }}</text>
					</view>
					<view class="meta-row">
						<text class="label">下单时间</text>
						<text class="value">{{ orderItemDetail.create_time || '2025-12-29 19:41:37' }}</text>
					</view>
					<view class="meta-row">
						<text class="label">支付状态</text>
						<text class="value">{{ orderItemDetail.status  < 20 ? '未支付' : '已支付' }}</text>
					</view>
				</view>
			</view>

			<!-- 付款方式 -->
			<view class="card payment-card">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">付款方式</text>
					<text class="right-text">账户余额</text>
				</view>
			</view>

			<!-- 押金减免 -->
			<view class="card deposit-card">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">押金减免</text>
				</view>
				<view class="deposit-content">
					<view class="sub-title">寄存</view>
					<view class="desc">寄存在平台，平台会将【收藏证书】发放给您，后续【凭收藏证书】或订单凭证可拿回藏品。</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-btns" v-if="orderItemDetail">
			<!-- 待发货 (待平台发货) -->
			<template v-if="orderItemDetail.status === 20">
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="看看其他" 
						:btnStyle="{
							background: 'transparent',
							color: 'rgb(255, 225, 133)'
						}"
						@click="goOrder"
					></CxComfirmBtn>
				</view>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="取消抢单"
						@click="handleAction({ type: 'cancel', orderItemDetail })"
					></CxComfirmBtn>
				</view>
			</template>
			<!-- 待收材料 -->
			<template v-else-if="orderItemDetail.status === 30">
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="看看其他"
						:btnStyle="{
							background: 'transparent',
							color: 'rgb(255, 225, 133)'
						}"
						@click="goOrder"
					></CxComfirmBtn>
				</view>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="确认收货"
						@click="handleAction({ type: 'receivingMaterials', orderItemDetail })"
					></CxComfirmBtn>
				</view>
			</template>
			<!-- 待发成品 (制作中) -->
			<template v-else-if="orderItemDetail.status === 40">
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="联系客服" 
						:btnStyle="{
							background: 'transparent',
							color: 'rgb(255, 225, 133)'
						}"
						@click="contactService"
					></CxComfirmBtn>
				</view>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="提交成品"
						@click="handleSubmitProduct"
					></CxComfirmBtn>
				</view>
			</template>
			<!-- 验收成功 -->
			<template v-else-if="orderItemDetail.status === 70">
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="我的收益" 
						:btnStyle="{
							background: 'transparent',
							color: 'rgb(255, 225, 133)'
						}"
						@click="goIncome"
					></CxComfirmBtn>
				</view>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="再做一单"
						@click="goOrder"
					></CxComfirmBtn>
				</view>
			</template>
			<!-- 其他状态默认显示返回 -->
			<template v-else>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="返回" 
						:btnStyle="{
							background: 'transparent',
							color: 'rgb(255, 225, 133)'
						}"
						@click="goBack"
					></CxComfirmBtn>
				</view>
			</template>
		</view>
	</view>
<CxModal
	v-model:show="showCancelModal"
	content="取消订单后押金原路返回到您的账户，但'押金减免额度 '将无法退回"
	@confirm="confirmCancelOrder"
/>
<CxModal
	v-model:show="showConfirmOrder"
	content="确定收到材料了吗"
	@confirm="confirmOrder"
/>
<CxModal
	v-model:show="showProduced"
	content="确认完成了吗？"
	@confirm="confirmProduced"
>
	<!-- <view class="input-wrap">
		<view style="font-size:28rpx; color:#333; margin-bottom:10rpx;">请输入物流单号,切勿填错</view>
		<u-input
			v-model="logisticsNumber"
			placeholder="请输入你的物流单号"
			border="surround"
			clearable
			:customStyle="{
			height: '52rpx',
			borderRadius: '10rpx'
			}"
		></u-input>
	</view> -->
</CxModal>
<CxModal
	v-model:show="showDeleOrder"
	content="确定要删除订单吗？"
	@confirm="confirmDeleOrder"
/>
</template>

<script setup name="detail">
import {orderDetails,editOrderSatus,orderRemind,beforePayInfo} from '@/api/index.js'
import { getRegionName } from '@/utils/public.js';
const { proxy } = getCurrentInstance();
const title = ref("订单详情");
const orderInfoList = ref([]);
const orderItemDetail = ref({}); // Current Order Item
let parentItemInfo = ref({});
let showCancelModal = ref(false);
let showConfirmOrder = ref(false);
let showProduced = ref(false);
let showDeleOrder = ref(false);
let logisticsNumber = ref('');
let currentItem = {};
let marginResultData = ref({});
let isBuyer = ref(false); // Flag for Buyer context

const statusMap = {
  10: { text: '待支付', color: '#FF4D4F' }, // 未使用减免金额
  20: { text: '待平台发货', color: '#FA8C16' }, 
  30: { text: '待接收材料', color: '#1890FF' },
  40: { text: '制作中', color: '#FA541C' },
  50: { text: '待接收成品', color: '#13C2C2' },
  60: { text: '待验收', color: '#722ED1' },
  70: { text: '验收成功', color: '#52C41A' },
  80: { text: '验收失败', color: '#A8071A' },
  90: { text: '取消订单', color: '#8C8C8C' }
};

const statusMapBuyer = {
  10: { text: '待付款', color: '#FF4D4F' },
  20: { text: '待发货', color: '#FA8C16' },
  50: { text: '待收货', color: '#13C2C2' },
  70: { text: '已完成', color: '#52C41A' },
  90: { text: '已取消', color: '#8C8C8C' }
};

const statusText = computed(() => {
    const map = isBuyer.value ? statusMapBuyer : statusMap;
	return map[orderItemDetail.value.status]?.text || '未知状态';
});

const goOrder = () => {
	uni.switchTab({ url: '/pages/xn/orders/index' });
};
const goIncome = () => {
	uni.switchTab({ url: '/pages/xn/income/index' });
};

const goBack = () => {
	uni.navigateBack();
};

const contactService = () => {
	uni.navigateTo({ url: '/pages-xn/my/customer-service' });
};

const orderCancel = async () => {
	const { code=9999, data,msg } = await editOrderSatus({ 
		id:orderItemDetail.value.id,
		order_id: orderItemDetail.value.order_id, 
		status: 90 
	});
	if (code === 200) {
		uni.showToast({ title: '取消订单成功', icon: 'none' });
		showCancelModal.value = false;
		getOrderData();
	} else {
		uni.showToast({
			title: msg || '取消订单失败',
			icon: 'none'
		});
	}
};
const handleCancel = () => {
	showCancelModal.value = true;
};

const handleSubmitProduct = () => {
	uni.navigateTo({
		url: '/pages-xn/orders/submit-product',
		success: (res) => {
			res.eventChannel.emit('sendOrderDatas', { orderInfo: orderItemDetail.value });
		}
	});
};

const getOrderData = async ()=>{
	const { code=9999, data,msg } = await orderDetails({ order_id: parentItemInfo.value.order_id });
	if (code === 200) {
		 if(data.lists){
			
			orderInfoList.value = [data.lists];
			orderItemDetail.value = data.lists;
			
			// Mock data for display if missing
			if(!orderItemDetail.value.address) {
				orderItemDetail.value.address = {};
			}
		 };
	} else {
		uni.showToast({
			title: msg || '数据加载失败',
			icon: 'none'
		});
	}
};
// 确认收到材料
const confirmOrder = async ()=>{
	const {msg,data,code} = await editOrderSatus({
    id:orderItemDetail.value.id,
    order_id:orderItemDetail.value.order_id,
    status:40
  });
  if(code===200){
    uni.showToast({ title: '已确认收到材料', icon: 'none' });
    showConfirmOrder.value = false;
    getOrderData();
  } else {
    uni.showToast({ title: msg || '操作失败', icon: 'none' });
  }
};
// 确认完成作品
const confirmProduced = async ()=>{
  uni.navigateTo({
    url: '/pages-xn/orders/submit-product',
    success: (res) => {
      res.eventChannel.emit('sendOrderDatas', { orderInfo: orderItemDetail.value });
    }
  });
//   const {msg,data,code}  = await editOrderSatus({
//     id:item.value.id,
//     order_id:item.value.order_id,
//     status:50,
//     finish_order_number:logisticsNumber.value
//   });
  
//   if(code===200){
//     uni.showToast({ title: '订单已完成', icon: 'none' });
//     logisticsNumber.value = '';
//     showProduced.value = false;
//     getOrderData();
//   } else {
//     uni.showToast({ title: msg || '操作失败', icon: 'none' });
//   }
};
// 提醒商家发货
const remindOrder = async (item)=>{
	const {msg,data,code} = await orderRemind({
    order_id:item.order_id
  });
  if(code===200){
    uni.showToast({ title: '已提醒商家发货', icon: 'none' });
    // getOrderData();
  } else {
    uni.showToast({ title: msg || '操作失败', icon: 'none' });
  }
};
// 删除订单
const confirmDeleOrder = ()=>{
	
};
// 获取订单详情向压金页面传递压金数据
const getOrderDetails = async (item)=>{
	if(!item.id){
		uni.showToast({ title: '订单ID不能为空', icon: 'none' })
		return;
	}
	const {code, msg ,data={}} = await orderDetails({order_id:item.order_id});
	
	if(code == 200){
		marginResultData.value = data.lists || {};
		marginResultData.value.id = item.id;
		uni.navigateTo({
        url: `/pages-xn/my/deposit?id=${item.id}&order_id=${item.order_id}`,
        success: (res) => {
          res.eventChannel.emit('sendMarginDatas', { marginResultData: marginResultData.value });
        },
        fail: (err) => {
          console.error('跳转失败', err);
        }
      })
	} else {
		uni.showToast({ title: msg || '订单详情获取失败', icon: 'none' })
		// setTimeout(() => {
		// 	uni.navigateBack()
		// }, 1500)
	};
}
// 取消订单
const confirmCancelOrder = async () => {
	const { code=9999, data,msg } = await editOrderSatus({ 
		id:orderItemDetail.value.id,
		order_id: orderItemDetail.value.order_id, 
		status: 90 
	});
	if (code === 200) {
		uni.showToast({ title: '取消订单成功', icon: 'none' });
		showCancelModal.value = false;
		getOrderData();
	} else {
		uni.showToast({
			title: msg || '取消订单失败',
			icon: 'none'
		});
	}
};

// 处理操作事件
const handleAction = ({ type, item: actionItem }) => {
  // Use actionItem if provided, otherwise fallback to page item
  // Note: in detail page, usually actionItem IS item.value
  currentItem = actionItem || orderItemDetail.value; 
  switch (type) {
    case 'cancel': // 取消订单
	    showCancelModal.value = true;
     break
    case 'pay': // 去支付
      // getOrderDetails(currentItem);
	  uni.navigateTo({
        url: `/pages-xn/my/deposit?id=${currentItem.id}&order_id=${currentItem.order_id}`,
        success: (res) => {
          res.eventChannel.emit('sendOrderDatas', { orderInfo: currentItem });
        }
      })
      
      // uni.showToast({ title: '跳转支付页面', icon: 'none' })
      break
    case 'remind': // 提醒商家发货
      remindOrder(currentItem);
      break
    case 'logistics': // 查看物流
      // TODO: Implement internal logistics page or use internal webview
      // uni.navigateTo({ url: '/pages-xn/orders/logistics?id=' + currentItem.id })
      uni.showToast({ title: '查看物流详情', icon: 'none' })
      break
    case 'receivingMaterials': // 确认收到材料
	    showConfirmOrder.value = true;
      break
    case 'delete': // 删除订单
	    showDeleOrder.value = true;
      break
    case 'produced': // 确认完成作品
	    showProduced.value = true;
      break
    case 'detail': // 查看订单详情
      // Current page is detail, no op
      break
    }
}
onLoad((options) => {
		const eventChannel = proxy.getOpenerEventChannel();
		eventChannel.on('sendOrderDatas', (data) => {
			if(data && data.orderInfo){
				parentItemInfo.value = data.orderInfo || {};
				// Initialize item with parent info first to show something
				orderItemDetail.value = parentItemInfo.value;
				orderInfoList.value = [parentItemInfo.value];
				
				// Check for buyer context
				if (data.source === 'buyer') {
					isBuyer.value = true;
				}
				
				getOrderData();
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
	padding-bottom: 200rpx; // Space for footer
}

.status-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	
	.status-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.card-title-row {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	position: relative;
	
	.indicator {
		width: 6rpx;
		height: 28rpx;
		background: #FF4D4F;
		border-radius: 3rpx;
		margin-right: 16rpx;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		flex: 1;
	}
	
	.right-text {
		font-size: 28rpx;
		color: #666;
	}
}

/* Address Card */
.address-card {
	.address-row {
			display: flex;
			align-items: center;
		margin-bottom: 16rpx;

			.name {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			margin: 0 16rpx;
			}
		
			.phone {
				font-size: 30rpx;
			color: #333;
			}
		}
	
	.address-detail {
			font-size: 26rpx;
		color: #666;
		padding-left: 48rpx;
			line-height: 1.4;
	}
}

/* Logistics Info */
.info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.label {
		color: #333;
		font-size: 28rpx;
	}
	
	.value {
		color: #666;
		font-size: 28rpx;
	}
}

/* Goods Item */
.goods-item {
	display: flex;
	margin-bottom: 30rpx;
	
	.goods-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}
	
	.goods-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.goods-title {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			line-height: 1.4;
		}
		
		.tags {
			display: flex;
			flex-wrap: wrap;
		}
		
		.price-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.price {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
			}
			
			.num {
				font-size: 26rpx;
				color: #999;
			}
		}
	}
}

/* Fee Section */
.fee-section {
	margin-top: 20rpx;
	
	.fee-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		
		.label {
			font-size: 28rpx;
			color: #333;
		}
		
		.value {
			font-size: 28rpx;
			color: #666;
			
			&.total-price {
				font-size: 36rpx;
				color: #333;
				font-weight: bold;
			}
		}
		
		&.total-row {
			margin-top: 20rpx;
			align-items: flex-end;
		}
	}
}

.divider {
	height: 1px;
	background: #f5f5f5;
	margin: 30rpx 0;
}

/* Meta Section */
.meta-section {
	.meta-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		
		.label {
			font-size: 28rpx;
			color: #333;
		}
		
		.value {
			font-size: 28rpx;
			color: #999;
		}
	}
}

/* Deposit Card */
.deposit-content {
	.sub-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.desc {
		font-size: 26rpx;
		color: #999;
		line-height: 1.5;
	}
}

.footer-btns {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
	display: flex;
	justify-content: space-between;
	gap: 30rpx;
	z-index: 100;
	// background: linear-gradient(180deg, rgba(119, 23, 29, 0) 0%, #77171D 100%);
	.btn-wrapper {
		flex: 1;
	}
}
.page-wrap{
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover; 
}
</style>

<template>
	<view class="page-wrap collection-detail">
	<LayoutNavigation :title="title" > 
		<template #right>
			<up-icon name="share-square" size="48rpx" color="#fff" @click="onShare" />
		</template>
	</LayoutNavigation>
		<view class="page-content">
			<view class="current-works">
				<up-image class="works-image" width="680rpx" height="700rpx" src="https://cdn.uviewui.com/uview/album/1.jpg"></up-image>
			</view>
			<view class="xiuniang-information">
				<view class="sold-info">
					<u-card :border-radius="16" :padding="20" :show-head="false">
						<!-- ✅ body  -->
						<template #body>
							<!-- 价格区域 -->
							<u-row justify="space-between" class="price-section">
							<u-col span="8">
								<text class="current-price">¥666.66</text>
								<text class="original-price">¥999.99</text>
							</u-col>
							<u-col span="4" textAlign="right">
								<text class="sales-info">已售100件</text>
							</u-col>
							</u-row>

							<!-- 商品标题 -->
							<view class="title">
							古韵民族丝绸非遗刺绣
							</view>

							<!-- 标签区域 -->
							<view class="status-tags">
								<CxTag
								text="工期360天"
								:bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
								/>&nbsp;
								<CxTag
								text="难度低"
								:bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
								/>
							</view>
						</template>
					</u-card>
				</view>
			<view class="commodity-welfare">
				<view class="cell-wrapper">
				<u-cell
					title="正品保证"
					name="正品保证"
					class="welfare-item"
					:border="false"
					:custom-style="{
					padding: '16rpx 32rpx'
					}"
					:title-style="{ fontSize: '28rpx', fontWeight: 500 }"
					@click="handleClick"
				>
					<template #right-icon>
					<u-icon name="arrow-right" color="#666" size="36rpx"></u-icon>
					</template>
				</u-cell>
				</view>
				<view class="cell-wrapper">
				<u-cell
					title="7天无理由退货"
					name="7天无理由退货"
					class="welfare-item"
					:border="false"
					:custom-style="{
					padding: '16rpx 32rpx'
					}"
					:title-style="{ fontSize: '28rpx', fontWeight: 500 }"
					@click="handleClick"
				>
					<template #right-icon>
					<u-icon name="arrow-right" color="#666" size="36rpx"></u-icon>
					</template>
				</u-cell>
				</view>
			</view>
			<view class="creative-process">
				<view class="chain-title">
				<u-image
						src="/static/images/collection-detail/production-details.png"
						width="30rpx"
						height="30rpx"
						mode="widthFix"
						radius="50%"
					/> &nbsp;&nbsp;上链记录
				</view>
				<u-card
					:border="false"
					:show-head="false"
					:padding="20"
					:border-radius="16"
					:custom-style="{
						background:'#fff',
						boxShadow:'0 4px 12px rgba(0,0,0,0.05)',
						border: '2px solid #FFE185'
					}"
				>
				<template #body>
					<!-- 标题 -->
					<!-- <view class="title-wrapper">
					<view class="title-line"></view>
					<text class="title-text">创作过程</text>
					</view> -->

					<!-- 文本 -->
					<view class="content-text">
					创作过程文案创作过程文案……
					</view>

					<!-- 图片 -->
					<view class="image-wrapper">
					<u-image
						src="/static/images/collection-detail/embroidery.png"
						width="100%"
						mode="widthFix"
						radius="12"
					/>
					</view>

					<view class="content-text">创作过程文案……</view>
					<view class="content-text">创作过程文案……</view>
				</template>
				</u-card>
			</view>
			
			<view class="footer-bar">
				
				<!-- 左侧功能区 -->
				<view class="left-actions">
				<view class="action-item" @click="handleCollect">
					<u-icon name="star" size="60rpx" color="#FFFFFF"></u-icon>
					<text class="action-text collect">收藏</text>
				</view>
				<view class="action-item" @click="handleService">
					<u-icon name="kefu-ermai" size="60rpx" color="#FFD700"></u-icon>
					<text class="action-text service">客服</text>
				</view>
				</view>

				<!-- 右侧操作按钮区 -->
				<view class="right-buttons">
					<view class="gradient-btn-item shopping-cart" @click="handlePayDeposit">
					<view class="gradient-button">
							
						</view>
						<view class="button-inner">
							加入购物车
							<!-- <view class="update-tip">
								需要升等级
							</view> -->
						</view>
					</view>
					
					<view class="gradient-btn-item buy-now" :class="{'filter-gray':isUpgrade}" @click="handleGrabOrder">
						<view class="gradient-button">
							
						</view>
						<view class="button-inner">
							立即购买
						</view>
					</view>
				</view>
			</view>
			</view>
			<!-- Floating Cart -->
			<view class="floating-cart">
				<navigator url="/pages/gz/my/shopping-cart" open-type="navigate">
					<u-icon name="shopping-cart" size="44rpx" color="#FFE185"></u-icon>
				    <view class="badge">10</view>
				</navigator>
			</view>
		</view>
		
		<view></view>
	</view>
</template>

<script setup name="detail-index">
let title =ref("实物详情");
let avatarUrl=ref('');
const onShare = ()=>{
      console.log('分享按钮被点击');
    }
let isUpgrade = ref(false);


const handleCollect = ()=> {
  // 收藏逻辑
  console.log('收藏');
};
const handleService = ()=> {
  // 客服逻辑
  console.log('客服');
};
const handlePayDeposit = ()=> {
  // 支付押金逻辑 - 跳转到压金页面
  console.log('支付押金');
  uni.navigateTo({
    url: '/pages/my/deposit'
  })
};
const handleGrabOrder = ()=> {
  if(isUpgrade.value) {
	  handlePayDeposit();
	  return;
  };
  console.log('一键抢单');
  // 这里可以添加抢单逻辑，或者提示
  uni.showToast({
    title: '抢单成功',
    icon: 'success'
  })
};
const handleClick = (cellPrm)=>{
	console.log("点击了正品保障",cellPrm);
}
onLoad((options)=>{
	 console.log('接收到的参数:', options.id);
});
</script>

<style lang="scss" scoped>
.filter-gray{
		filter: grayscale(1);
	}
.shopping-cart{
	.gradient-button{		
		border-radius: 20rpx 10rpx 6rpx 40rpx;
		background: linear-gradient(90deg, #F3D89E, #F5EAC9);
		transform: skewY(-15deg) rotateZ(15deg); 
	}
	.update-tip{
		position: absolute;
		top: -38rpx;
		right: -82rpx;
		padding: 0rpx 20rpx;
		background: #FE3A3A;
		border-radius: 30rpx;
		border-bottom-left-radius:0;
		color: #fff;
		font-size: 18rpx;
		z-index: 2;
	}
	.button-inner{
		color: #805536;
	}
}
.right-buttons{
		position: relative;
	
}
.shopping-cart{
	
}
.gradient-button {
  width: 200rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: linear-gradient(90deg, #ff4136, #ff8533);
  border: 2rpx solid #ffc107;
  border-radius: 10rpx 40rpx 20rpx 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-weight: bold;
  transform: skewY(-15deg) rotateZ(15deg);
}
.button-inner{
	position: absolute;
	inset: 0;
	text-align: center;
	vertical-align: middle;
	color: white;
}
.gradient-btn-item{
	display: inline-block;
	position: relative;
  line-height: 60rpx;
	
}
.footer-bar {
position: fixed;
left: 0;
right: 0;
bottom: 0;
height: 124rpx;
display: flex;
justify-content: space-between;
align-items: center;
background-color: rgba(77, 20, 25, .6);
padding: 10px 15px;
box-sizing: border-box;
}

.left-actions {
  display: flex;
  justify-content:space-around;
  width: 30%; 
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-size: 24rpx;
}

.action-text.collect {
  color: #FFFFFF; 
}

.action-text.service {
  color: #FFD700; 
}

.right-buttons {
}

.right-buttons .u-button:first-child {
  margin-right: -1px;
}

.right-buttons .u-button:last-child {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
	
	
	
	
	
	
.creative-process {
  margin-top: 40rpx;
  // border: 2rpx solid $app-border-color;
}

.chain-title {
 display: flex;
 justify-content: flex-start;
 align-items: flex-start;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  margin: 20rpx;
}

.content-text {
  font-size: 24rpx;
  line-height: 1.8;
  color: #555;
  margin: 20rpx 0;
  text-align: justify;
  text-indent: 48rpx;
}	
	
	
	




.cell-wrapper {
  background-color: #ffffff;
  border-radius: 28rpx;
  overflow: hidden; 
  margin-top: 20rpx;
}
.commodity-welfare {
	padding: 0 20rpx;
}
.sold-info {
	margin-top: 20rpx;
}

.price-section {
  margin-bottom: 20rpx;
}

.current-price {
  color: #FF0000;
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.original-price {
  color: #999999;
  font-size: 28rpx;
  text-decoration: line-through;
}

.sales-info {
  color: #666666;
  font-size: 24rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333333;
}

.tag-section {
  margin-top: 20rpx;
}
.works-image{
	border: 4rpx solid $app-border-color; 
	border-radius: 48rpx;
	overflow: hidden;
}
.current-works{
	display: flex;
  align-items: center;
  justify-content: center;  
}	
.page-wrap{
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}

.floating-cart {
	position: absolute;
	right: 30rpx;
	bottom: 140rpx;
	width: 80rpx;
	height: 80rpx;
	background: #FF4141;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
	border: 4rpx solid $app-border-color;
	
	.badge {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background: #1890FF;
		color: #fff;
		font-size: 20rpx;
		padding: 2rpx 10rpx;
		border-radius: 20rpx;
		border: 2rpx solid #fff;
	}
}
</style>
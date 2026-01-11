<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			  <view class="container">
				<view class="contract-box">
					<!-- 1. 外层内凹灰色底 -->
					<view class="outer-border"></view>
					
					<!-- 2. 中间白色底 (遮住灰色底中间，露出边缘形成外框) -->
					<view class="bg-layer"></view>
					
					<!-- 3. 内层直角边框 (不受 mask 影响) -->
					<view class="rect-border-layer"></view>
					
					<!-- 4. 内容层 -->
					<view class="content-layer">
						<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
								@scrolltolower="lower" @scroll="scroll">
								<view class="scroll-view-content">
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
									
									
									14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
								</view>
							</scroll-view>
					</view>
				</view>
				<view class="enter-wrap">
					<CxComfirmBtn text="确认" :loading="loading" @click="handleEnter" />				
				</view>
			</view>
		</view>
	</view>
</template>


<script setup name="electronic-contract">
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
const title = ref("电子合同");
let loading = ref(false);
const scrollTop = ref(0);

const handleEnter = () => {
		loading.value = true;
		setTimeout(() => {
		  loading.value = false;
		  uni.showToast({
			title: '已确认',
			icon: 'success'
		  });
		}, 3000);
	};	
	
const upper = (e) => {
  //console.log(e)
}

const lower = (e) => {
  //console.log(e)
}

const scroll = (e) => {
  //console.log(e)
}
</script>

<style lang="scss" scoped>
.page-wrap{
		background: url("/static/images/user/login-bg.png") no-repeat;
		background-size: cover;
		grid-template-rows: v-bind(safeTopValue) 1fr 0rpx;
	}
.container{
	padding: 24rpx;
	border-radius: 20rpx;
	background: #fff;
	border: 4rpx solid #F3D89E;
	margin-top: 42rpx;
	height: calc(100% - 100rpx);
	display: flex;
	flex-direction: column;
}

.contract-box {
	position: relative;
	width: 100%;
	flex: 1;
	overflow: hidden;
}

.outer-border {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #B0B6BC;
	-webkit-mask: 
		radial-gradient(circle at top left, transparent 20rpx, black 0) top left,
		radial-gradient(circle at top right, transparent 20rpx, black 0) top right,
		radial-gradient(circle at bottom right, transparent 20rpx, black 0) bottom right,
		radial-gradient(circle at bottom left, transparent 20rpx, black 0) bottom left;
	-webkit-mask-size: 51% 51%;
	-webkit-mask-repeat: no-repeat;
	mask: 
		radial-gradient(circle at top left, transparent 20rpx, black 0) top left,
		radial-gradient(circle at top right, transparent 20rpx, black 0) top right,
		radial-gradient(circle at bottom right, transparent 20rpx, black 0) bottom right,
		radial-gradient(circle at bottom left, transparent 20rpx, black 0) bottom left;
	mask-size: 51% 51%;
	mask-repeat: no-repeat;
}

.bg-layer {
	position: absolute;
	top: 2rpx;
	left: 2rpx;
	right: 2rpx;
	bottom: 2rpx;
	background-color: #fff;
	-webkit-mask: 
		radial-gradient(circle at top left, transparent 20rpx, black 0) top left,
		radial-gradient(circle at top right, transparent 20rpx, black 0) top right,
		radial-gradient(circle at bottom right, transparent 20rpx, black 0) bottom right,
		radial-gradient(circle at bottom left, transparent 20rpx, black 0) bottom left;
	-webkit-mask-size: 51% 51%;
	-webkit-mask-repeat: no-repeat;
	mask: 
		radial-gradient(circle at top left, transparent 20rpx, black 0) top left,
		radial-gradient(circle at top right, transparent 20rpx, black 0) top right,
		radial-gradient(circle at bottom right, transparent 20rpx, black 0) bottom right,
		radial-gradient(circle at bottom left, transparent 20rpx, black 0) bottom left;
	mask-size: 51% 51%;
	mask-repeat: no-repeat;
	z-index: 1;
}

.rect-border-layer {
	position: absolute;
	top: 6rpx;
	left: 6rpx;
	right: 6rpx;
	bottom: 6rpx;
	border: 2rpx solid #B0B6BC;
	background-color: transparent;
	z-index: 2;
	pointer-events: none;
}

.content-layer {
	position: absolute;
	top: 24rpx;
	left: 24rpx;
	right: 24rpx;
	bottom: 24rpx;
	z-index: 3;
}

.scroll-Y {
	height: 100%;
}	
.scroll-view-content{
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}
.enter-wrap{
	width: 90%;
	margin: 0 auto;
	margin-top: 32rpx;
	flex-shrink: 0;
}
</style>
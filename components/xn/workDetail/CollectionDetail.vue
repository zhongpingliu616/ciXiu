<template>
<up-card
  :border-radius="16"
  :shadow="true"
  :head-border-bottom="false"
>
  <!-- 头部 -->
  <template #head>
	<view class="card-header">
	  <view class="header-title">古韵民族丝绸非遗刺绣</view>
	  <view class="share-info" @click="onShare">
		<up-icon name="share-square" size="32" color="#8B4513" />
	  </view>
	</view>

	<!-- 状态标签 -->
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

  <!-- 内容 -->
  <template #body>
	<view class="card-body">
	  <up-line color="#E0E0E0" margin="5rpx 0" />
	<view class="cx-section">
	  <text class="cx-section__title">绣娘信息</text>
	  <view class="cx-section__line"></view>
	</view>

	  <view class="embroiderer-info">
		<up-avatar :src="avatarUrl" size="80" />
		<view class="info-right">
		  <view class="name">张小小
		   <CxTag
		     text="签约绣娘"
		     icon="/static/images/common/work-level.png"
			 :textStyle="{
				 color: '#805536'
			 }"
		     @click="goDetail"
		   />
		  </view>
		  <view class="position">高级绣娘</view>
		</view>
	  </view>

	  <view class="intro-box">
		<text>简介：</text>
		<text>个人履历简介个人履历简介个人履历简介</text>
	  </view>
	</view>
  </template>
</up-card>
 <view class="creative-process">
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
		 <view class="title-wrapper">
		   <view class="title-line"></view>
		   <text class="title-text">创作过程</text>
		 </view>

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
<view class="chain-record">
  <view class="chain-title">上链记录</view>
  <scroll-view class="scroll-container" scroll-y="true">
    <view class="record-item">
      <text class="time">2025.10.3 16:00</text>
      <text class="status status-on">上架</text>
    </view>

    <view class="record-item">
      <text class="time">2025.10.3 16:00</text>
      <text class="status status-on">上架</text>
    </view>

    <view class="record-item">
      <text class="time">2025.10.3 16:00</text>
      <text class="status status-on">上架</text>
    </view>

    <view class="record-item">
      <text class="time">2025.10.3 16:00</text>
      <text class="status status-off">下架</text>
    </view>
  </scroll-view>
</view>
</template>


<script setup name="CollectionDetail">
let title =ref("作品详情");
let avatarUrl=ref('');
const onShare = ()=>{
      console.log('分享按钮被点击');
    }
const goDetail = ({text})=>{
	console.log("点击了",text)
}
onLoad(({workId,workType})=>{
	 console.log('接收到的参数:', workId,workType);
});
</script>

<style lang="scss" scoped>
.chain-record {
  padding: 20rpx;
}

.chain-title {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.scroll-container {
  max-height: calc(60vh);
}

.record-item {
  background-color: white;
  border-radius: 12rpx;
  padding: 24rpx 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1); /* 添加轻微阴影提升层次感 */
}

.time {
  font-size: 28rpx;
  color: #333;
  flex: 1; /* 让时间文本占据剩余空间 */
}

.status {
  font-size: 28rpx;
  font-weight: bold;
  padding: 0 10rpx;
  border-radius: 6rpx;
}

.status-on {
  color: #e65c3c; /* 上架颜色 */
}

.status-off {
  color: #003366; /* 下架颜色 */
}	


	
.creative-process {
  margin-top: 20rpx;
  // border: 2rpx solid $app-border-color;
}

.title-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.title-line {
  width: 6rpx;
  height: 32rpx;
  background-color: #e63946; /* 红色竖线 */
  margin-right: 16rpx;
  border-radius: 3rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.content-text {
  font-size: 24rpx;
  line-height: 1.8;
  color: #555;
  margin: 20rpx 0;
  text-align: justify;
  text-indent: 48rpx;
}

.image-wrapper {
  margin: 30rpx 0;
  overflow: hidden;
  border-radius: 12rpx;
}

.xiuniang-information {
  padding: 20rpx; 
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.share-info{
	padding: 24rpx;
	border-radius: 50%;
	background: #F7F7F7;
}
.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.status-tags {
  // display: flex;
  // gap: 20rpx;
}
.cx-section {
  position: relative;
}

.cx-section__title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-right: 16rpx;  
  margin-left: 16rpx;
}

.cx-section__line {
  position: absolute;
  top: 6rpx;
  left: 0;
  height: 80%;
  width: 6rpx;
  border-radius: 10rpx;
  background: linear-gradient(to top,#F82A1C, #FC7E5A);
}

.embroiderer-info {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
}

.info-right {
  margin-left: 20rpx;
}

.name {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.position {
  font-size: 28rpx;
  color: #666;
  margin-top: 10rpx;
}

.intro-box {
  background-color: #F9F9F9;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-top: 30rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

</style>
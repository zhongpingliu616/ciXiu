<template>
	<view class="page-wrap released">
		<LayoutNavigation :title="title" />
		
		<view class="page-content">
			<!-- 文本输入区域 -->
			<view class="input-card">
				<textarea 
					class="textarea" 
					v-model="content" 
					placeholder="记录你的美好生活" 
					placeholder-class="placeholder"
					maxlength="500"
				></textarea>
				
				<view class="input-footer">
					<view class="location-tag" v-if="location" @tap="clearLocation">
						<text>{{ location }}</text>
						<u-icon name="close" size="20" color="#666" style="margin-left: 6rpx;"></u-icon>
					</view>
					<view class="location-placeholder" v-else @tap="chooseLocation">
						<u-icon name="map" size="24" color="#999"></u-icon>
						<text>添加位置</text>
					</view>
					<text class="word-count">{{ content.length }}/500</text>
				</view>
			</view>
			
			<!-- 图片上传区域 -->
			<view class="section-title">添加图片/视频</view>
			<view class="upload-card">
				<view class="image-grid">
					<view 
						class="image-item" 
						v-for="(img, index) in imageList" 
						:key="index"
					>
						<image :src="img" mode="aspectFill" class="img" @tap="previewImage(index)"></image>
						<view class="delete-btn" @tap.stop="deleteImage(index)">
							<u-icon name="close" color="#fff" size="16"></u-icon>
						</view>
					</view>
					
					<view class="add-btn" @tap="chooseImage" v-if="imageList.length < 9">
						<u-icon name="plus" color="#999" size="60"></u-icon>
					</view>
				</view>
				<text class="tip">图片/视频大小2M</text>
			</view>
			
			<!-- 发布按钮 -->
			<CxComfirmBtn
				text="发布" 
				:btnStyle="{
				}"
				@tap="handleSubmit"
			/>
		</view>
	</view>
</template>

<script setup name="released">
import { ref } from 'vue';

let title = ref("发布");
const content = ref('');
const location = ref('广州市');
const imageList = ref([]);

// 选择位置
const chooseLocation = () => {
	// 模拟选择位置
	uni.showActionSheet({
		itemList: ['广州市', '深圳市', '北京市', '上海市'],
		success: (res) => {
			const locations = ['广州市', '深圳市', '北京市', '上海市'];
			location.value = locations[res.tapIndex];
		}
	});
};

const clearLocation = () => {
	location.value = '';
};

// 选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 9 - imageList.value.length,
		sizeType: ['original', 'compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			imageList.value = [...imageList.value, ...res.tempFilePaths];
		}
	});
};

// 预览图片
const previewImage = (index) => {
	uni.previewImage({
		urls: imageList.value,
		current: index
	});
};

// 删除图片
const deleteImage = (index) => {
	imageList.value.splice(index, 1);
};

// 发布
const handleSubmit = () => {
	if (!content.value.trim() && imageList.value.length === 0) {
		uni.showToast({
			title: '请输入内容或添加图片',
			icon: 'none'
		});
		return;
	}
	
	uni.showLoading({
		title: '发布中...'
	});
	console.log("图片列表",imageList.value)
	// 模拟接口请求
	setTimeout(() => {
		uni.hideLoading();
		uni.showToast({
			title: '发布成功',
			icon: 'success'
		});
		
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}, 1000);
};
</script>

<style lang="scss" scoped>
.page-wrap {
	grid-template-rows: 80rpx 1fr;
}

.page-content {
	padding: 30rpx;
	overflow-y: auto;
}
.textarea {
	flex: 1;
	width: 100%;
	font-size: 28rpx;
	color: #333;
	line-height: 1.5;
}

.placeholder {
	color: #ccc;
}
.location-tag {
	display: flex;
	align-items: center;
	background: #F5F5F5;
	padding: 6rpx 16rpx;
	border-radius: 24rpx;
	font-size: 24rpx;
	color: #666;
}

.location-placeholder {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #999;
	
	text {
		margin-left: 8rpx;
	}
}

.word-count {
	font-size: 24rpx;
	color: #999;
}
.input-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20rpx;
}
.input-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	height: 400rpx;
	display: flex;
	flex-direction: column;
}

.section-title {
	font-size: 28rpx;
	color: #fff; // 假设背景是深色，标题用白色，如果看不清可调整
	margin-bottom: 20rpx;
	opacity: 0.9;
}
.image-item {
	width: 150rpx;
	height: 150rpx;
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	position: relative;
	border-radius: 12rpx;
	overflow: hidden;
	
	&:nth-child(4n) {
		margin-right: 0;
	}
	
	.img {
		width: 100%;
		height: 100%;
	}
	
	.delete-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 36rpx;
		height: 36rpx;
		background: rgba(0, 0, 0, 0.5);
		border-bottom-left-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.add-btn {
	width: 150rpx;
	height: 150rpx;
	border: 2rpx dashed #ddd;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FAFAFA;
}
.image-grid {
		display: flex;
		flex-wrap: wrap;
}

.tip {
font-size: 24rpx;
color: #999;
margin-top: 10rpx;
display: block;
}
.upload-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 60rpx;
}
</style>
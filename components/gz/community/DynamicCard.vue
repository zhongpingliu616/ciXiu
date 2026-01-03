<template>
	<view class="dynamic-card">
		<!-- 用户头部 -->
		<view class="header">
			<view class="user-info">
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<view class="info">
					<view class="name-row">
						<text class="name">{{ item.name }}</text>
						<view class="mother-tag" v-if="item.isSigned">
							<CxTag
							   text="签约绣娘"
							   icon="/static/images/common/work-level.png"
										 :textStyle="{
											 color: '#805536'
										 }"
										 :customStyle="{
											 padding: 0
										 }"
							 />
						</view>
					</view>
					<text class="time">{{ item.location }} · {{ item.time }}</text>
				</view>
			</view>
			<view class="follow-btn" :class="{ followed: item.isFollowed }" @tap.stop="handleFollow">
				<u-icon :name="item.isFollowed ? 'heart-fill' : 'heart-fill'" :color="item.isFollowed ? '#999' : '#fff'" size="24"></u-icon>
				<text class="btn-text">{{ item.isFollowed ? '已关注' : '关注' }}</text>
			</view>
		</view>
		
		<!-- 内容 -->
		<view class="content" @tap="handleContentClick">
			<text class="text">{{ item.content }}</text>
		</view>
		
		<!-- 图片九宫格 -->
		<view class="image-grid" v-if="item.images && item.images.length > 0">
			<view 
				class="image-item" 
				v-for="(img, index) in item.images" 
				:key="index"
				:class="gridClass"
				@tap.stop="previewImage(index)"
			>
				<image :src="img" mode="aspectFill" class="img"></image>
			</view>
		</view>
		
		<!-- 底部数据 -->
		<view class="footer">
			<text class="views">浏览次数{{ item.views }}</text>
			<view class="actions">
				<view class="action-item" @tap.stop="handleLike">
					<u-icon :name="item.isLiked ? 'thumb-up-fill' : 'thumb-up'" :color="item.isLiked ? '#FF6B4B' : '#999'" size="32"></u-icon>
					<text class="count" :class="{ active: item.isLiked }">{{ item.likes }}</text>
				</view>
				<view class="action-item" @tap.stop="handleComment">
					<u-icon name="chat" color="#999" size="32"></u-icon>
					<text class="count">{{ item.comments }}</text>
				</view>
				<view class="action-item" @tap.stop="handleShare">
					<u-icon name="share" color="#999" size="32"></u-icon>
					<text class="count">{{ item.shares }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup name="DynamicCard">
import { computed } from 'vue';

const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	}
});

const emit = defineEmits(['click', 'follow', 'like', 'comment', 'share']);

// 计算九宫格样式
const gridClass = computed(() => {
	const len = props.item.images?.length || 0;
	if (len === 1) return 'one';
	if (len === 2 || len === 4) return 'two';
	return 'three';
});

const handleFollow = () => {
	emit('follow', props.item);
};

const handleContentClick = () => {
	emit('click', props.item);
};

const handleLike = () => {
	emit('like', props.item);
};

const handleComment = () => {
	emit('comment', props.item);
};

const handleShare = () => {
	emit('share', props.item);
};

const previewImage = (index) => {
	uni.previewImage({
		urls: props.item.images,
		current: index
	});
};
</script>

<style lang="scss" scoped>
.dynamic-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		.user-info {
			display: flex;
			align-items: center;
			
			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 20rpx;
				border: 2rpx solid #eee;
			}
			
			.info {
				.name-row {
					display: flex;
					align-items: center;
					margin-bottom: 6rpx;
					
					.name {
						font-size: 30rpx;
						font-weight: bold;
						color: #333;
						margin-right: 12rpx;
					}
					
					.badge {
						display: flex;
						align-items: center;
						background: #FDF2F1;
						border: 1rpx solid #EBC6C4;
						border-radius: 8rpx;
						padding: 0 8rpx;
						
						.badge-text {
							font-size: 20rpx;
							color: #A35853;
							margin-left: 4rpx;
						}
					}
				}
				
				.time {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
		
		.follow-btn {
			display: flex;
			align-items: center;
			background: #FF6B4B;
			padding: 8rpx 20rpx;
			border-radius: 30rpx;
			
			.btn-text {
				font-size: 24rpx;
				color: #fff;
				margin-left: 6rpx;
			}
			
			&.followed {
				background: #F5F5F5;
				
				.btn-text {
					color: #999;
				}
			}
		}
	}
	
	.content {
		margin-bottom: 20rpx;
		
		.text {
			font-size: 28rpx;
			color: #333;
			line-height: 1.6;
		}
	}
	
	.image-grid {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
		
		.image-item {
			border-radius: 12rpx;
			overflow: hidden;
			margin-bottom: 10rpx;
			margin-right: 10rpx;
			
			.img {
				width: 100%;
				height: 100%;
			}
			
			&.one {
				width: 400rpx;
				height: 400rpx;
			}
			
			&.two {
				width: 300rpx;
				height: 300rpx;
				
				&:nth-child(2n) {
					margin-right: 0;
				}
			}
			
			&.three {
				width: 210rpx;
				height: 210rpx;
				
				&:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
	}
	
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.views {
			font-size: 24rpx;
			color: #999;
		}
		
		.actions {
			display: flex;
			
			.action-item {
				display: flex;
				align-items: center;
				margin-left: 30rpx;
				
				.count {
					font-size: 24rpx;
					color: #999;
					margin-left: 6rpx;
					
					&.active {
						color: #FF6B4B;
					}
				}
			}
		}
	}
}
</style>
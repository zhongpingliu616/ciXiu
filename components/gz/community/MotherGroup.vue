<template>
	<view class="mother-group" @tap="handleClick" :style="{
		background: `${cardColors[megerItem.colorIndex].bgColor}`
	}">
		<view class="group-header">
			<view class="avatars">
				<image 
					v-for="(avatar, index) in item.avatars" 
					:key="index" 
					:src="avatar" 
					class="mini-avatar"
					:style="{
						zIndex: item.avatars.length - index -1
					}"
					mode="aspectFill"
				/>
			</view>
			<view class="tag-wrapper">
				<text class="tag" :style="{
		color: `${cardColors[megerItem.colorIndex].textColor}`
	}">{{ item.tag }}</text>
				<u-icon name="arrow-right" color="#666" size="20"></u-icon>
			</view>
		</view>
		
		<text class="title" :style="{
		color: `${cardColors[megerItem.colorIndex].textColor}`
	}">"{{ item.title }}"</text>
		<text class="count" :style="{
		color: `${cardColors[megerItem.colorIndex].textColor}`
	}">{{ item.count }}人参与讨论</text>
		
		<!-- 背景装饰 -->
		<image class="bg-pattern" src="/static/images/common/pattern.png" mode="widthFix" v-if="false" />
	</view>
</template>

<script setup name="MotherGroup">
import { computed } from 'vue';

const cardColors = [
  { bgColor: 'linear-gradient(135deg, #FFF6F4, #FBE8E4)', textColor: '#8F6A65' },
  { bgColor: 'linear-gradient(135deg, #FFF4F2, #F6E1DD)', textColor: '#8A645F' },
  { bgColor: 'linear-gradient(135deg, #FFF7F5, #FBE9E6)', textColor: '#916C67' },

  { bgColor: 'linear-gradient(135deg, #FDF6F8, #F3E3E9)', textColor: '#8B6C79' },
  { bgColor: 'linear-gradient(135deg, #FBF2F5, #EEDDE4)', textColor: '#856774' },
  { bgColor: 'linear-gradient(135deg, #FFF5F8, #F6E4EC)', textColor: '#8F6E7D' },

  { bgColor: 'linear-gradient(135deg, #F4F8FA, #E6EEF3)', textColor: '#6F8796' },
  { bgColor: 'linear-gradient(135deg, #F2F6F9, #E3EBF1)', textColor: '#6C8393' },
  { bgColor: 'linear-gradient(135deg, #F6FAFC, #E9F0F5)', textColor: '#7A90A0' },

  { bgColor: 'linear-gradient(135deg, #F5F9F7, #E7F0EC)', textColor: '#6F8B82' },
  { bgColor: 'linear-gradient(135deg, #F2F7F4, #E2EEE9)', textColor: '#6C887F' },
  { bgColor: 'linear-gradient(135deg, #F7FBF9, #EBF2EF)', textColor: '#7A958C' },

  { bgColor: 'linear-gradient(135deg, #F9F6F2, #EFE7DE)', textColor: '#8A7B68' },
  { bgColor: 'linear-gradient(135deg, #F6F3EF, #E6DED4)', textColor: '#807263' },
  { bgColor: 'linear-gradient(135deg, #FBF8F4, #F1E9DF)', textColor: '#8F806C' },

  { bgColor: 'linear-gradient(135deg, #F4F2F5, #E6E0E8)', textColor: '#7A6F86' },
  { bgColor: 'linear-gradient(135deg, #F6F4F8, #E9E5F0)', textColor: '#807598' },
  { bgColor: 'linear-gradient(135deg, #F2F0F5, #E3DEE9)', textColor: '#766F8C' },

  { bgColor: 'linear-gradient(135deg, #F7F7F7, #ECECEC)', textColor: '#7B7B7B' },
  { bgColor: 'linear-gradient(135deg, #F3F3F3, #E4E4E4)', textColor: '#6F6F6F' },
  { bgColor: 'linear-gradient(135deg, #FAFAFA, #EEEEEE)', textColor: '#888888' },

  { bgColor: 'linear-gradient(135deg, #FFF8F1, #F5EBDD)', textColor: '#8A745E' },
  { bgColor: 'linear-gradient(135deg, #FFF5EC, #F2E4D5)', textColor: '#856F59' },
  { bgColor: 'linear-gradient(135deg, #FFFBF6, #F4EDE3)', textColor: '#8F7A64' },

  { bgColor: 'linear-gradient(135deg, #F5F6FA, #E6E9F2)', textColor: '#6F7F99' },
  { bgColor: 'linear-gradient(135deg, #F2F4F8, #E2E6EF)', textColor: '#6B7A92' },
  { bgColor: 'linear-gradient(135deg, #F7F9FC, #E9EDF5)', textColor: '#7A8AA3' }
];
const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	}
});

const megerItem = computed(()=> ({
	colorIndex: Math.floor(Math.random() * cardColors.length) || 0,
	...props.item
}));
const emit = defineEmits(['click']);

const handleClick = () => {
	emit('click', props.item);
};
</script>

<style lang="scss" scoped>
.mother-group {
	background: linear-gradient(135deg, #FFF5E5 0%, #FFE0C2 100%);
	border-radius: 20rpx;
	padding: 24rpx;
	width: 340rpx;
	height: 180rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	position: relative;
	overflow: hidden;
	
	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.avatars {
			display: flex;
			
			.mini-avatar {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				border: 2rpx solid $app-border-color;
				margin-right: -20rpx;
				
				&:last-child {
					margin-right: 0;
				}
			}
		}
		
		.tag-wrapper {
			display: flex;
			align-items: center;
			
			.tag {
				font-size: 22rpx;
				color: #666;
				margin-right: 4rpx;
			}
		}
	}
	
	.title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-top: 10rpx;
		line-height: 1.4;
	}
	
	.count {
		font-size: 22rpx;
		color: #666;
	}
	
	.bg-pattern {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100rpx;
		opacity: 0.2;
	}
}
</style>
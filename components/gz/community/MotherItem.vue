<template>
	<view class="mother-item" @tap.stop="handleClick">
		<view class="avatar-box">
			<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
			<view class="add-icon" v-if="item.showAdd">
				<u-icon name="plus" color="#fff" size="20"></u-icon>
			</view>
		</view>
		<text class="name">{{ item.name }}</text>
	</view>
</template>

<script setup name="MotherItem">
const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	}
});

const emit = defineEmits(['click']);

const handleClick = () => {
	emit('click', props.item);
};
</script>

<style lang="scss" scoped>
.mother-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 120rpx;
	
	.avatar-box {
		position: relative;
		width: 100rpx;
		height: 100rpx;
		margin-bottom: 12rpx;
		
		.avatar {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background: $main-btn-gradient;
			border: 2rpx solid #F3D89E;
		}
		
		.add-icon {
			position: absolute;
			bottom: -16rpx;
			left: 50%;
			width: 32rpx;
			height: 32rpx;
			transform: translateX(-16rpx);
			background: #FF6B4B;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 2rpx solid #fff;
		}
	}
	
	.name {
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: 100%;
	}
}
</style>
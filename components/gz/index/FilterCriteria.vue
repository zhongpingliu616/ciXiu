<template>
	<u-popup :show="show" mode="bottom" @close="close" :round="20">
		<view class="filter-container">
			<view class="header">
				<text class="title">全部筛选</text>
				<u-icon name="close" color="#fff" size="28" @click="close"></u-icon>
			</view>
			
			<scroll-view scroll-y class="filter-content">
				<!-- 排序依据 -->
				<view class="filter-group">
					<view class="group-title">排序依据</view>
					<view class="tags-wrapper">
						<view 
							v-for="(item, index) in sortOptions" 
							:key="index"
							class="filter-tag"
							:class="{ active: currentSort === item.value }"
							@click="currentSort = item.value"
						>
							{{ item.label }}
						</view>
					</view>
				</view>

				<!-- 发布时间 -->
				<view class="filter-group">
					<view class="group-title">发布时间</view>
					<view class="tags-wrapper">
						<view 
							v-for="(item, index) in timeOptions" 
							:key="index"
							class="filter-tag"
							:class="{ active: currentTime === item.value }"
							@click="currentTime = item.value"
						>
							{{ item.label }}
						</view>
					</view>
				</view>

				<!-- 价格区间 -->
				<view class="filter-group">
					<view class="group-title">价格区间</view>
					<view class="price-input-wrapper">
						<view 
							class="filter-tag price-tag"
							:class="{ active: priceType === 'unlimited' }"
							@click="priceType = 'unlimited'"
						>
							不限价格
						</view>
						<view class="input-box" @click="priceType = 'custom'">
							<input 
								type="number" 
								v-model="minPrice" 
								placeholder="输入最低价" 
								placeholder-class="placeholder-style"
								@focus="priceType = 'custom'"
							/>
							<text class="divider">—</text>
							<input 
								type="number" 
								v-model="maxPrice" 
								placeholder="输入最高价" 
								placeholder-class="placeholder-style"
								@focus="priceType = 'custom'"
							/>
						</view>
					</view>
				</view>
			</scroll-view>

			<view class="footer-btns">
				<view class="btn cancel-btn" @click="close">取消</view>
				<view class="btn confirm-btn" @click="confirm">确定</view>
			</view>
		</view>
	</u-popup>
</template>

<script setup name="FilterCriteria">
import { ref } from 'vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['update:show', 'confirm']);

const sortOptions = [
	{ label: '综合排序', value: 'default' },
	{ label: '最新发布', value: 'newest' },
	{ label: '最多点赞', value: 'most_liked' },
	{ label: '价格从高到低', value: 'price_desc' },
	{ label: '价格从低到高', value: 'price_asc' }
];

const timeOptions = [
	{ label: '不限时间', value: 'unlimited' },
	{ label: '一天内', value: '1day' },
	{ label: '一周内', value: '1week' },
	{ label: '半年内', value: '6months' },
	{ label: '半年之前', value: 'before6months' }
];

const currentSort = ref('default');
const currentTime = ref('unlimited');
const priceType = ref('unlimited');
const minPrice = ref('');
const maxPrice = ref('');

const close = () => {
	emit('update:show', false);
};

const confirm = () => {
	emit('confirm', {
		sort: currentSort.value,
		time: currentTime.value,
		price: {
			type: priceType.value,
			min: minPrice.value,
			max: maxPrice.value
		}
	});
	close();
};
</script>

<style lang="scss" scoped>
.filter-container {
	background: #7B1F22;
	padding: 30rpx 0;
	color: #fff;
	max-height: 80vh;
	display: flex;
	flex-direction: column;
}

.header {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	padding: 0 30rpx 30rpx;
	
	.title {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.u-icon {
		position: absolute;
		right: 30rpx;
	}
}

.filter-content {
	flex: 1;
	padding: 0 30rpx;
	box-sizing: border-box;
}

.filter-group {
	margin-bottom: 40rpx;
	
	.group-title {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 20rpx;
	}
}

.tags-wrapper {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.filter-tag {
	padding: 12rpx 24rpx;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 8rpx;
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.8);
	border: 1px solid transparent;
	
	&.active {
		background: #F5EAC9;
		color: #5C401F;
		border-color: #F5EAC9;
	}
}

.price-input-wrapper {
	display: flex;
	align-items: center;
	gap: 20rpx;
	
	.price-tag {
		flex-shrink: 0;
	}
	
	.input-box {
		flex: 1;
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		
		input {
			flex: 1;
			font-size: 26rpx;
			color: #fff;
			text-align: center;
		}
		
		.divider {
			margin: 0 10rpx;
			color: rgba(255, 255, 255, 0.5);
		}
	}
}

.placeholder-style {
	color: rgba(255, 255, 255, 0.3);
}

.footer-btns {
	display: flex;
	gap: 30rpx;
	padding: 30rpx;
	margin-top: auto;
	
	.btn {
		flex: 1;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 40rpx;
		font-size: 30rpx;
		
		&.cancel-btn {
			border: 1px solid rgba(255, 255, 255, 0.5);
			color: #fff;
		}
		
		&.confirm-btn {
			background: linear-gradient(90deg, #FF6B6B, #FF8E53);
			color: #fff;
		}
	}
}
</style>
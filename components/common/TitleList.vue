<template>
  <view class="title-box" :style="containerStyle">
    <!-- 头部 -->
		<view class="header">
		  <!-- 标题 -->
		  <text
			class="title"
			:class="titleClass"
			:style="titleStyle"
		  >
			{{ title }}
		  </text>

		  <!-- 更多 -->
		  <view class="more">
			<!-- 优先使用插槽 -->
			<slot name="more">
			  <!-- 有 url 就跳转 -->
			  <navigator
				v-if="moreUrl"
				:url="moreUrl"
				class="more-link"
			  >
				{{ moreText }}
			  </navigator>

			  <!-- 否则触发事件 -->
			  <text
				v-else
				class="more-link"
				@click="onMoreClick"
			  >
				{{ moreText }}
			  </text>
			</slot>
		  </view>
		</view> 
    <!-- 内容 -->
    <view class="content-list">
      <slot />
    </view>
  </view>
</template>

<script setup name="TitleList">
defineProps({
  /* 标题 */
  title: {
    type: String,
    default: ''
  },

  /* 标题样式 */
  titleStyle: {
    type: Object,
    default: () => ({})
  },
  titleClass: {
    type: [String, Array, Object],
    default: ''
  },

  /* 容器样式 */
  containerStyle: {
    type: Object,
    default: () => ({})
  },

  /* 更多 */
  moreText: {
    type: String,
    default: '更多 >'
  },
  moreUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['more'])

const onMoreClick = () => {
  emit('more')
}
</script>
<style lang="scss" scoped>
.title-box {
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding: 0 10rpx;
}

.title {
  font-size: 36rpx;
  color: #fff;
  font-weight: bold;
}

.more {
  display: flex;
  align-items: center;
}

.more-link {
  font-size: 28rpx;
  color: #ccc;
}
</style>

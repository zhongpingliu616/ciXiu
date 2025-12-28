<template>
  <swiper
    class="cx-swiper-uni"
    :style="{ '--swiper-height': swiperHeight }"
    :circular="mergedConfig.circular"
    :indicator-dots="mergedConfig.indicatorDots"
    :autoplay="mergedConfig.autoplay"
    :interval="mergedConfig.interval"
    :duration="mergedConfig.duration"
    :vertical="mergedConfig.vertical"
    @change="onSwiperChange"
  >
    <swiper-item
      v-for="(item, index) in list"
      :key="index"
    >
      <!-- 文字插槽 -->
      <slot
        v-if="item.type === 'text'"
        name="text"
        :item="item"
        :index="index"
      >
        <!-- 默认兜底 -->
        <view class="swiper-text">
          {{ item.text }}
        </view>
      </slot>
  
      <!-- 图片插槽 -->
      <slot
        v-else-if="item.type === 'image'"
        name="image"
        :item="item"
        :index="index"
      >
        <image
          class="swiper-image"
          :src="item.src"
          mode="aspectFill"
        />
      </slot>
  
      <!-- 视频插槽 -->
      <slot
        v-else-if="item.type === 'video'"
        name="video"
        :item="item"
        :index="index"
        :play="() => onVideoPlay(index)"
      >
        <video
          class="swiper-video"
          :id="`video-${index}`"
          :src="item.src"
          :poster="item.poster"
          controls
          @play="onVideoPlay(index)"
        />
      </slot>
    </swiper-item>
  </swiper>
</template>

<script setup name="swiper-uni">
	const defaultConfig = {
	  indicatorDots: true,
	  autoplay: false,
	  interval: 3000,
	  duration: 500,
	  vertical: false,
	  circular: true
	};
	const props = defineProps({
	  list: {
	    type: Array,
	    default: () => []
	  },
	  swiperHeight: {
	    type: String,
	    default: "300rpx"
	  },
	  config:{
		  type: Object,
		  default: () => ({})
	  }
	})
	const emit = defineEmits(['change'])
	const mergedConfig = computed(() => {
	  return {
	    ...defaultConfig,
	    ...props.config
	  }
	})
	/* 视频上下文集合 */
	const videoContexts = ref([])
	
	/* 初始化 videoContext */
	onMounted(() => {
	  videoContexts.value = props.list.map((item, index) => {
	    if (item.type === 'video') {
	      return uni.createVideoContext(`video-${index}`)
	    }
	    return null
	  })
	})
	
	/* swiper 切换时：暂停所有视频 */
	const onSwiperChange = (e) => {
	  pauseAllVideos()
	  const current = e.detail.current
	 const currentItem = props.list[current]
	 emit('change', {
	     index: current,
	     item: currentItem
	   })
	}
	
	/* 播放某个视频时：暂停其他视频 */
	const onVideoPlay = (currentIndex) => {
	  videoContexts.value.forEach((ctx, index) => {
	    if (ctx && index !== currentIndex) {
	      ctx.pause()
	    }
	  })
	}
	
	/* 工具方法 */
	const pauseAllVideos = () => {
	  videoContexts.value.forEach(ctx => {
	    ctx && ctx.pause()
	  })
	}
</script>

<style lang="scss" scoped>
.cx-swiper-uni {
  width: 100%;
  height: var(--swiper-height);
}

.swiper-text {
    width: 100%;  
    white-space: nowrap;
    overflow: hidden;
	color:#F5EAC9;
    text-overflow: ellipsis
}

.swiper-image,
.swiper-video {
  width: 100%;
  height: 100%;
}
</style>
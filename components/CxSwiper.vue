<template>
  <up-swiper
	:list="list"
    class="cx-swiper"
	:height="mergedConfig.height"
    :autoplay="mergedConfig.autoplay"
    :interval="mergedConfig.interval"
    :duration="mergedConfig.duration"
    :circular="mergedConfig.circular"
	:indicator="mergedConfig.indicator"
	:indicatorMode="mergedConfig.indicatorMode"
	:direction="mergedConfig.direction"
    @change="onChange"
  >
   
	<template #indicator>
	  <slot
		name="indicator"
		:current="innerIndex"
		:total="list.length"
	  >
	  
		<view class="custom-indicator">
		  <view
			v-for="(_, i) in list"
			:key="i"
			class="indicator-dot"
			:class="{ 'indicator-dot-active': i === innerIndex }"
		  />
		</view>
	  </slot>
	</template>
  </up-swiper>
</template>

<script setup name="swiper">
const defaultConfig = {
	  indicator:true,
	  indicatorMode:"line",
	  height: 180,
	  autoplay: true,
	  interval: 3000,
	  duration: 300,
	  direction: 'vertical',
	  circular: true
	};

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  },
  config: {
    type: Object,
    default: () => ({
    })
  }
})
const mergedConfig = computed(() => {
	  return {
	    ...defaultConfig,
	    ...props.config
	  }
	})
const emit = defineEmits(['update:modelValue', 'change'])

let innerIndex = ref(props.modelValue)
const videoMap = ref({})
const currentPlaying = ref(null)

/* video id */
const getVideoId = (index) => `cx-swiper-video-${index}`

/* 初始化 video context */
onMounted(() => {
  props.list.forEach((item, index) => {
    if (item.type === 'video') {
      videoMap.value[index] = uni.createVideoContext(
        getVideoId(index)
      )
    }
  })
})

/* 只允许一个视频播放 */
const onVideoPlay = (index) => {
  if (currentPlaying.value !== null && currentPlaying.value !== index) {
    videoMap.value[currentPlaying.value]?.pause()
  }
  currentPlaying.value = index
}

/* swiper 切换 */
const onChange = (e) => {
  innerIndex.value = e.current

  // 切换时暂停所有视频
  Object.values(videoMap.value).forEach((ctx) => {
    ctx?.pause()
  })
  currentPlaying.value = null

  emit('update:modelValue', e.current)
  emit('change', e)
}

watch(
  () => props.modelValue,
  (val) => {
    innerIndex.value = val
  }
)
</script>

<style scoped lang="scss">
.cx-swiper {
  width: 100%;
  height: 400rpx;
}
.custom-indicator {
	@include flex(row);
	justify-content: center;

	.indicator-dot {
		 height: 12rpx;
		 width: 12rpx;
		 border-radius: 100px;
		 background-color: rgba(0, 0, 0, 0.35);
		 margin: 0 10rpx;
		 transition: background-color 0.3s;
	}
	.indicator-dot-active {
		 background-color: #F5EAC9;
		 width: 20rpx;
	 }
}
</style>

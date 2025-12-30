<template>
  <view class="cx-scroll-wrapper">
    <scroll-view
      ref="scrollRef"
      class="cx-scroll-view"
      :scroll-x="isX"
      :scroll-y="isY"
      :scroll-with-animation="true"
      :show-scrollbar="false"
      :scroll-left="scrollLeft"
      :scroll-top="scrollTop"
      @scroll="onScroll"
      @touchend="onTouchEnd"
    >
      <view
        class="cx-scroll-list"
        :class="directionClass"
        :style="listStyle"
      >
        <view
          v-for="(item, index) in list"
          :key="index"
          class="cx-scroll-item"
          :style="itemStyle"
		  @tap="onItemClick(item, index)"
        >
          <slot name="item" :item="item" :index="index">
            
          </slot>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script setup name="CxScrollView">
const defaultConfig = {
  direction: 'x',     // x | y
  visibleCount: null, // 不传则兜底
  gap: '0rpx',
  snap: true
};

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object,
    default: () => ({
      text: {
        lines: 1,
        color: '#F5EAC9',
        fontSize: '20rpx',
        lineHeight: '32rpx'
      }
    })
  },
  activeIndex: {
    type: Number,
    default: 0
  }
});
let innerIndex = ref(props.activeIndex);
const emit = defineEmits(['scroll', 'change', 'click',
  'update:activeIndex']);

const merged = computed(() => ({
  ...defaultConfig,
  ...props.config
}));
const itemSize = computed(() => {
  const count = visibleCount.value;
  const gap = parseInt(merged.value.gap) || 0;

  // 750 是 rpx 设计稿宽度
  return (750 - gap * (count - 1)) / count;
});
watch(
  () => props.activeIndex,
  (val) => {
    if (val !== innerIndex.value) {
      innerIndex.value = val;
      scrollToIndex(val);
    }
  }
);
const setActiveIndex = (index) => {
  const max = props.list.length - 1;
  const next = Math.max(0, Math.min(index, max));

  if (next === innerIndex.value) return;

  innerIndex.value = next;

  emit('update:activeIndex', next);
  emit('change', next);
};
const textConfig = computed(() => ({
  lines: 1,
  color: '#F5EAC9',
  fontSize: '20rpx',
  lineHeight: '32rpx',
  ...(merged.value.text || {})
}));
const onScroll = (e) => {
  const offset = isX.value
    ? e.detail.scrollLeft
    : e.detail.scrollTop;

  const size =
    itemSize.value + parseInt(merged.value.gap || 0);

  const index = Math.round(offset / size);

  setActiveIndex(index);

  emit('scroll', e);
};
/* 方向 */
const isX = computed(() => merged.value.direction === 'x');
const isY = computed(() => merged.value.direction === 'y');
const directionClass = computed(() =>
  isX.value ? 'is-x' : 'is-y'
);

/* scroll 状态 */
const scrollLeft = ref(0);
const scrollTop = ref(0);
const scrollRef = ref(null);

/* visibleCount */
const visibleCount = computed(() => merged.value.visibleCount || 4);

/* item 样式 */
const itemStyle = computed(() => {
  const count = visibleCount.value;
  const gap = merged.value.gap || '0rpx';

  if (isX.value) {
    return {
      width: parseInt(gap)>0?`calc((100% - ${(count - 1)} * ${gap}) / ${count})`:`${100 / count}%`,
      flexShrink: 0
    };
  }

  return {
    height: `${100 / count}%`
  };
});


/* list 样式 */
const listStyle = computed(() => ({
  gap: merged.value.gap
}));

/* 当前 index */
// const activeIndex = ref(0);

/* 吸附 */
const onTouchEnd = async () => {
  if (!merged.value.snap) return;

  await nextTick();

  const size = 750 / visibleCount.value;
  const offset = isX.value ? scrollLeft.value : scrollTop.value;
  const index = Math.round(offset / size);

  scrollToIndex(index);
};

const scrollToIndex = async (index) => {
  await nextTick();

  const size = 750 / visibleCount.value;
  innerIndex.value = Math.max(0, index);
	setActiveIndex(index);
  if (isX.value) {
    scrollLeft.value = innerIndex.value * size;
  } else {
    scrollTop.value = innerIndex.value * size;
  }

  emit('change', innerIndex.value);
};

const scrollToNext = () => {
  scrollToIndex(innerIndex.value + 1);
};

const scrollToPrev = () => {
  scrollToIndex(innerIndex.value - 1);
};
const onItemClick = (item, index) => {
  emit('click', {
    item,
    index
  });
};
defineExpose({
  scrollToIndex,
scrollToNext: () => scrollToIndex(innerIndex.value + 1),
scrollToPrev: () => scrollToIndex(innerIndex.value - 1),
activeIndex: innerIndex
});
</script>
<style lang="scss" scoped>
.cx-scroll-wrapper {
  width: 100%;
  height: 100%;
}

.cx-scroll-view {
  width: 100%;
  height: 100%;
}

.cx-scroll-list {
  display: flex;
}

.cx-scroll-list.is-x {
  flex-direction: row;
}

.cx-scroll-list.is-y {
  flex-direction: column;
}

.cx-scroll-item {
  box-sizing: border-box;
}

/* 文本 */
.cx-text {
  display: block;
  overflow: hidden;
  word-break: break-all;
}

/* 单行 */
.cx-text.line-1 {
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 多行 */
.cx-text.line-multi {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

/* 默认内容 */
.default-img {
  width: 100%;
  height: 140rpx;
  border-radius: 12rpx;
}
</style>


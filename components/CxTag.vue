<template>
  <up-tag
    class="gradient-tag"
    :disabled="disabled"
    :custom-style="tagStyle"
      @click="handleClick"
      :shape="shape"
    >
    <view class="custom-tag">
      <!-- 图片图标 -->
      <image
        v-if="icon && iconType === 'image'"
        :src="icon"
        class="tag-icon"
        :style="iconStyle"
      />

      <!-- u-icon 图标 -->
      <u-icon
        v-else-if="icon && iconType === 'uicon'"
        :name="icon"
        :size="iconSize"
        :color="iconColor || color"
      />

      <text class="tag-text" :style="megerTextStyle">
        {{ text }}
      </text>
    </view>
  </up-tag>
</template>


<script setup name="tag">
const emit = defineEmits(['click'])
const defaultTextStyle = {
	  fontSize: "26rpx",
	  color:"#D1A156",
	  padding:"8rpx 0rpx"
	  
  };
const props = defineProps({
  text: { type: String, required: true },
  icon: { type: String, default: '' },
  shape: { type: String, default: '' },
  iconType: { type: String, default: 'image' },
  iconColor: { type: String, default: '' },
  customStyle: {
	  type: Object,
	  default: ()=>({})
  },
  bgGradient: {
    type: Array,
    default: () => ['RGBA(243, 216, 158, 1)', 'RGBA(245, 234, 201, 1)']
  },
  textStyle: {
	  type: Object, 
	  default: () =>({}) 
	  },
  iconSize: { type: Number, default: 28 },
  gap: { type: Number, default: 0 },
  /** 点击相关 */
  disabled: {
    type: Boolean,
    default: false
  }
})

const handleClick = () => {
  if (props.disabled) return
  emit('click',{text:props?.text})
}
const tagStyle = computed(() => {
  // 纯色优先
  if (props.bgColor || props.customStyle.backgroundColor) {
    return {
      background: props.bgColor,
      border: 'none',
	  borderRadius: '30rpx',
	  padding: '0',	  
	  ...props.customStyle
    }
  }

  // 渐变兜底
  if (props.bgGradient?.length >= 2 || props.customStyle.backgroundGradient) {
    return {
      background: `linear-gradient(
        135deg,
        ${props.bgGradient[0]},
        ${props.bgGradient[1]}
      )`,
      border: 'none',
	  borderRadius: '30rpx',
	  padding: '0',	  
	 ...props.customStyle
    }
  }
  return {}
})

const megerTextStyle = computed(() => ({
  ...defaultTextStyle,
  ...props.textStyle
}))

const iconStyle = computed(() => ({
  width: `${props.iconSize}rpx`,
  height: `${props.iconSize}rpx`
}))
</script>


<style lang="scss" scoped>
:deep(.u-tag),
:deep(.u-tag:focus),
:deep(.u-tag:active) {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  -webkit-tap-highlight-color: transparent;
}
:deep(.u-tag--medium){
	width: auto;
	height: auto;
}
/* 正常态背景 */
:deep(.u-tag) {
  background: linear-gradient(
    135deg,
    v-bind('bgGradient[0]'),
    v-bind('bgGradient[1]')
  );
  border: none;
}

/* 禁用态 */
:deep(.u-tag--disabled) {
  opacity: 0.5;
}


.custom-tag {
  display: flex;
  align-items: center;
  gap: v-bind('gap + "rpx"');
}

.tag-text {
  line-height: 1;
}
</style>

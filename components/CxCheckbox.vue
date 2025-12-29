<template>
  <view
    class="gradient-checkbox"
    :class="[
      shape,
      { checked: innerValue, disabled }
    ]"
    :style="checkboxStyle"
    @click="toggle"
  >
    <u-icon
      v-if="innerValue"
      name="checkmark"
      :size="iconSize"
      color="#fff"
    />
  </view>
</template>

<script setup name="checkbox ">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: Number,
    default: 32 // rpx
  },
  shape: {
    type: String,
    default: 'circle' // circle | square
  },
  disabled: {
    type: Boolean,
    default: false
  },
  gradient: {
    type: String,
    default: 'linear-gradient(135deg, #F82D1E, #FF8A00)'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

const toggle = () => {
  if (props.disabled) return
  innerValue.value = !innerValue.value
}

const checkboxStyle = computed(() => ({
  width: `${props.size}rpx`,
  height: `${props.size}rpx`,
  background: innerValue.value ? props.gradient : '#fff',
  border: innerValue.value ? 'none' : '2rpx solid #ddd'
}))

const iconSize = computed(() => props.size * 0.6)
</script>

<style lang="scss" scoped>
.gradient-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &.circle {
    border-radius: 50%;
  }

  &.square {
    border-radius: 8rpx;
  }

  &.checked {
    transform: scale(1.05);
  }

  &.disabled {
    opacity: 0.5;
  }
}
</style>
<template>
	<up-button
	:plain="mergedBtnStyle.plain"
	:text="text"
	:loading="loading"
	:disabled="loading"
	color="linear-gradient(to right, #F82B1C, RGBA(252, 124, 89, 1))"
	:customStyle="mergedBtnStyle"
	>
		<text class="btn-text" :style="mergedTextStyle">{{ text }}</text>
	</up-button>
</template>

<script setup>
const props = defineProps({
  text: { type: String, required: true },
  loading: {
    type: Boolean,
    default: false
  },
  btnStyle: {
	  type: Object, 
	  default: () =>({}) 
	  },
  textStyle: {
	  type: Object, 
	  default: () =>({}) 
	  },
  
})
const defaultBtnStyle = {
	border: '2rpx solid #FFE185',
	borderRadius: '100rpx',
	height: '80rpx',
	boxSizing: 'border-box',
	plain: false
};
const defaultTextStyle = {
	fontSize: '28rpx'
};
const mergedBtnStyle = computed(() => ({
  ...defaultBtnStyle,
  ...props.btnStyle
}));
const mergedTextStyle = computed(() => ({
  ...defaultTextStyle,
  ...props.textStyle
}));
</script>

<style lang="scss" scoped>
.btn-text {
  // font-size: v-bind('mergedStyle.fontSize');
  // font-weight: bold;
}
</style>
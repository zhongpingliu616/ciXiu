<template>
	<up-button
	:text="text"
	size="large"
	type="success"
	:loading="loading"
	:disabled="loading"
	color="linear-gradient(to right, #F82B1C, RGBA(252, 124, 89, 1))"
	:customStyle="{
		border: '2rpx solid #FFE185',
		borderRadius: '100rpx',
		height: '100rpx',
		boxSizing: 'border-box',
		...btnStyle
	  }"
	></up-button>
</template>

<script setup>
	defineProps({
		text: String,
		loading: Boolean,
		btnStyle: {
			type: Object,
			default: () => ({})
		}
	})
</script>

<style lang="scss" scoped>

</style>
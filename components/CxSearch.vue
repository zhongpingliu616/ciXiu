<template>
	<up-search
		v-model="innerValue"
		:placeholder="placeholder"
		:height="height"
		:shape="shape"
		:bgColor="bgColor"
		:searchIconSize="searchIconSize"
		:searchIconColor="searchIconColor"
		:placeholderColor="placeholderColor"
		:borderColor="borderColor"
		:show-action="showAction"
		:actionStyle="showAction?megerActionStyle:{}"
		:disabled="disabled"
		v-bind="$attrs"
		@change="handleChange"
	/>
</template>

<script setup name="SearchBar">
import { computed } from 'vue'

const defaultActionStyle={
		  backgroundColor: '#FF6B00', 
		  color: '#fff', 
		  borderRadius: '40rpx', 
		  padding: '10rpx 30rpx',
		  fontSize: '20rpx',
}
const props = defineProps({
modelValue: {
	type: String,
	default: ''
},
placeholder: {
	type: String,
	default: '搜索'
},
height: {
	type: String,
	default: '64rpx'
},
shape: {
	type: String,
	default: 'round'
},
bgColor: {
	type: String,
	default: '#fff'
},
searchIconSize: {
	type: String,
	default: '40rpx'
},
searchIconColor: {
	type: String,
	default: '#672227'
},
placeholderColor: {
	type: String,
	default: '#AC9394'
},
borderColor: {
	type: String,
	default: '#fff'
},
showAction: {
	type: Boolean,
	default: false
},
actionStyle: {
	type: Object,
	dafault: ()=>({})
},
disabled: {
	type: Boolean,
	default: false
},
placeholderSize: {
	type: String,
	default: '24rpx'
}
})


const emit = defineEmits(['update:modelValue', 'change'])


const innerValue = computed({
	get() {
	return props.modelValue
	},
	set(val) {
	emit('update:modelValue', val)
	}
})
const megerActionStyle = computed(()=>({
	...defaultActionStyle,
	...props.actionStyle
}))
const handleChange = (val) => {
	emit('change', val)
}
</script>

<style lang="scss" scoped>
:deep(.u-search__content__input--placeholder) {
	font-size: v-bind(placeholderSize);
}
.u-search{
	background: #fff;
	padding: 0 10rpx;
	border-radius: 30rpx;
	border: 2rpx solid #FFE185; 
}
</style>
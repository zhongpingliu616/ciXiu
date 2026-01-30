<template>
	<up-tabs
	    :list="tabItems"
	    :lineWidth="lineWidth"
	    :lineHeight="lineHeight"
	    :lineColor="lineBg.includes('base64')?`url(${lineBg}) 100% 100%`:lineBg"
	    :activeStyle="mergedActiveStyle"
	    :inactiveStyle="mergedInactiveStyle"
		:itemStyle="mergedItemStyle"
	    :scrollable="scrollable"
		:current="tabActiveIndex"
		lineBgSize="100% 100%"
	    @change="tabSwitch"
	    @click="tabSwitch"
		class="cx-tabs"
	> 
		  <template
			 v-if="$slots.tabItem"
			#content="{ item, index, active }"
		  >
			<!-- <view class="up-tab-item" :class="{ active }"> -->
			  <slot
				name="tabItem"
				:item="item"
				:index="index"
				:active="active"
			  />
			<!-- </view> -->
		  </template>
	</up-tabs>
</template>

<script setup name="tabs">
const slots = useSlots()
const hasTabItemSlot = computed(() => {
  return !!slots.tabItem
})
const defaultActiveStyle = {
				color: '#D62B2B',
				fontWeight: 'bold',
				transform: 'scale(1.05)',
				fontSize: '32rpx'
			};
const defaultInactiveStyle = {
				color: '#999',
				fontSize: '32rpx'
			};
const defaultItemStyle = {
			paddingLeft: "15rpx",
			paddingRight: "15rpx",
			height: "88rpx"
			
		};
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  tabItems: {
	type: Array,
	default() {
	  return [
			{ name: '我是绣娘' },  
			{ name: '我是公众'}
		];
	}
  },
  itemStyle: {
	type: Object,
	default:()=>({})
  },
  lineBg: {
	type: String,
	default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAASCAMAAAA0cZ07AAABSlBMVEUAAAD/VQD/VVX/QED/KgD/Kir/VSr/VVX/f1X/TTPoRi7/Ri7tNyTtWzf5STH5Tzf5VTf5Wz3/STH/VTf/W0P4TDT4Uzn4Uzv4XD/7TDT7XD/4Kxz6Qi76Qy77Y0f7ZUf9fFn4Khz4Qy76ZEb7e1j7fVj6UTn6Tzf6Vjz6Vz76UDn6VTz6WT/5Tjb5Ujn5VDz7Tjb7Wj/4LB35QC35Qy/7Zkj8e1j8fFn4LB35Kxz5QC35Qy/7Y0b7Zkn8fFn8fVr4Kx34LB34LB74LR/4Lh/4LyD4MCH4MSL4MyL4NCP5NST5NiX5OCb5OSf5Oij5PCn5PSr5Pyv5QC35Qi76Tzf6UTn6Ujr6VDv6Vjz6Vz77ZUf7Zkj7aEr7aUv7a0z7bE37bk77b0/7cFD7clH7c1L8dFP8dVT8dlX8eFX8eVb8elf8e1j8fFj8fFlFVbOBAAAAQHRSTlMAAwMEBgYGBgYKCwsODioqKioqKip1dXV1dXWQkJCQkJCRkZGRkaChoaGiouLj4+Pj4+7u7u7u7u/v7+/v7+/vJ9rf/wAAANxJREFUOMtjYMALmJkZKAGcnBRpZ2OjSDu/AEXaxcQp0c2tp8+NXwWLtJGTs4urm7uHp5e3j6+ff0CgsQwrVFItLFwDymSXN42JjYtPSExKTklNS8/IzMo2U+BgkHZwRNceFCwL1sGlHhoWHqHJBebIRUWja8/JVWCwxKbdmpGTlU9UNwSkPVJHQpCNk8kGm3Z77NpNGHlYhSQNINoNpUTYeLFrN2dQxKZdCRJwyI5XxqZdFRh0FujarZRgQacVFq4NDzpbdO12KhyURhwtkw0Dv/BAZhkKMyyh4gIA26VeW8woj3cAAAAASUVORK5CYII="
  },
  activeStyle: {
	type: Object,
	default:()=>({})
  },
  inactiveStyle: {
	type: Object,
	default:()=>({})
  },
  scrollable: {
	type: Boolean,
	default:false
  },
 lineWidth: {
	type: String,
	default: "60rpx"
  },
  lineHeight: {
    type: String,
    default: "18rpx"
  }
});

let tabActiveIndex = ref(props.modelValue);
const emit = defineEmits(['changeTab','update:modelValue']);

const mergedActiveStyle = computed(() => ({
  ...defaultActiveStyle,
  ...props.activeStyle
}))

const mergedInactiveStyle = computed(() => ({
  ...defaultInactiveStyle,
  ...props.inactiveStyle
}))
const mergedItemStyle = computed(() => ({
  ...defaultItemStyle,
  ...props.itemStyle
}))
watch(
  () => props.modelValue,
  (val) => {
    tabActiveIndex.value = val;
  },
  {
    immediate: true
  }
)

function tabSwitch(e){
  let index
  if (typeof e === 'number') {
    index = e
  } else if (e && typeof e === 'object') {
    if (typeof e.index === 'number') {
      index = e.index
    } else if (typeof e.current === 'number') {
      index = e.current
    }
  }
  if (typeof index !== 'number') {
    index = 0
  }
  tabActiveIndex.value = index
  emit('update:modelValue', index)
  emit('changeTab', { index, item: props.tabItems[index],e })
}
</script>

<style lang="scss" scoped>
:deep(.u-tabs__wrapper__nav__item){
	z-index: 2;
	}
</style>

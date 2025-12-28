<template>
	<up-popup
		:safeAreaInsetBottom="true"
		:safeAreaInsetTop="true"
		:show="show"
		:mode="popupConfig.mode"
		:round="popupConfig.round"
		:overlay="popupConfig.overlay"
		:borderRadius="popupConfig.borderRadius"
		:closeable="popupConfig.closeable"
		:close-on-click-overlay="popupConfig.closeOnClickOverlay"
		:touchable="popupConfig.touchable"
		:minHeight="popupConfig.minHeight"
		:maxHeight="popupConfig.maxHeight" 
		@close="handleEmitClose"
	>
		<view
			class="u-popup-slot"
			:style="{
				padding: '12px',
				width: ['bottom', 'top'].includes(popupConfig.mode) ? '750rpx' : 'auto',
				marginTop: ['left', 'right'].includes(popupConfig.mode) ? '480rpx' : '0',
				}"
			>
				<slot name="popupContent" :popupConfig="popupConfig" :close="handleEmitClose"></slot>
			<view>
		</view>
	</view> 
	<template #bottom>
		<view v-if="popupConfig.mode == 'center'" class="rounded" style="margin-top: 20px;">
			<up-icon name="close" color="#fff" @click="handleEmitClose"></up-icon>
		</view>
	</template>
</up-popup>
</template>

<script setup name="popup">
	const props = defineProps({
	  show: {
	    type: Boolean,
	    default: true
	  },
	  popupConfig: {
	    type: Object,
	    default() {
	      return {
	        overlay: false,
	        mode: 'center',
	        round: 10,
	        closeOnClickOverlay: false
	      };
	    }
	  }
	});
const emit = defineEmits(['update:show']);

const handleEmitClose = ()=> {
	emit('update:show', false);
}	
</script>

<style lang="scss" scoped>
</style>
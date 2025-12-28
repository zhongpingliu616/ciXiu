<template>
	<up-steps
	:current="currentStep" 
	activeColor="#F3D89E"
	inactiveColor="#999">
	<up-steps-item v-for="(item,index) in blockSteps" :key="index">
	    <template #icon>
	      <text
	        class="slot-icon"
	        :class="{ active: index === currentStep }"
	      >
	        {{ item.text }}
	      </text>
	    </template>
	  </up-steps-item>
	</up-steps>
</template>

<script setup name="step">
	const props = defineProps(
		{
		  currentStep: {
		    type: Number,
		    default: 0
		  },
		  blockSteps: {
		    type: Array,
		    default: []
		  }
		}
	)
</script>

<style lang="scss" scoped>
.slot-icon {
  padding: 8rpx 16rpx;
  border: 1px solid #fff;
  border-radius: 28rpx;
  font-size: 24rpx;
  color: #fff;
  background-color: transparent;
  &.active{
	  background: linear-gradient(
		to top,
		#F83121 0%,
		#FC7B58 100%
	  );
  }
}

::v-deep {
	.u-steps-item__wrapper--row{
		width: auto;
		height: auto;
		background-color: transparent;
	}
	.u-steps-item__line--row{
		top: 48%;
	}
	.u-steps-item--active .slot-icon {
	  background-color: #F3D89E; /* 你想要的红色 */
	  border-color: #F3D89E;
	}
}
</style>
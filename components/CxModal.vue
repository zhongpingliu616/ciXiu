<template>
  <up-modal
    :show="show"
    title=""
    :showConfirmButton="false"
    :showCancelButton="false"
    @close="handleCancel"
    class="cx-modal"
  >
    <!-- 自定义标题 -->
    <view class="modal-title">
      <slot name="title">
        {{ title }}
      </slot>
    </view>

    <!-- 内容插槽 -->
    <view class="modal-content">
      <slot>
        {{ content }}
      </slot>
    </view>

    <!-- 底部按钮 -->
    <template #confirmButton>
      <view class="modal-btn">
        <CxComfirmBtn
          :text="cancelText"
          :btnStyle="{
            color: '#999',
            background: '#fff',
            borderColor: '#ddd'
          }"
          @click="handleCancel"
        />

        <CxComfirmBtn
          :text="confirmText"
          @click="handleConfirm"
        />
      </view>
    </template>
  </up-modal>
</template>

<script setup name="CxModal">
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  content: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
  emit('update:show', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}
</script>


<style lang="scss" scoped>
:deep(.u-modal__content){
	display: initial;
}
.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #303133;
  text-align: center;
  padding: 30rpx 0 20rpx;
}

.modal-content {
  font-size: 28rpx;
  color: #606266;
  text-align: center;
  padding: 0 40rpx 30rpx;
}

.modal-btn {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx 30rpx;
}
</style>

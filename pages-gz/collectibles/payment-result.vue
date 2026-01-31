<template>
  <view class="page-wrap payment-result">
    <LayoutNavigationGz title="NFT藏品-订单详情">
      <template #right>
        <text 
          v-if="status === 'PAID'" 
          class="nav-right-text" 
          @tap="showRevokeModal = true"
        >
          撤销
        </text>
      </template>
    </LayoutNavigationGz>
    <view class="page-content">
      <scroll-view scroll-y>
      <!-- Top Status Icon -->
      <view class="status-header">
        <view class="icon-wrap">
          <!-- Using a placeholder or u-icon for the package -->
          <!-- Ideally this would be an image, but u-icon is safer if assets missing -->
          <!-- Simulating the package icon with u-icon for now, or use an image if I had one -->
          <image 
            v-if="status !== 'REVOKED'" 
            src="/static/images/index/box_icon.png" 
            mode="aspectFit" 
            class="status-img"
          />
           <image 
            v-else
            src="/static/images/index/box_icon.png" 
            mode="aspectFit" 
            class="status-img"
          />
        </view>
        <text class="status-text" :class="{ 'red-text': status === 'REVOKED' }">
          {{ statusText }}
        </text>
      </view>

      <!-- Cards -->
      <view class="cards-container">
        
          <!-- Buy Success Timeline (Only in PAID state) -->
          <view class="info-card" v-if="status === 'PAID'">
            <view class="card-title-row">
              <view class="red-bar"></view>
              <text class="card-title">买入成功</text>
            </view>
            
            <view class="product-row">
              <text class="product-name">古韵民族丝绸非遗刺绣</text>
              <text class="product-price">10.00元</text>
            </view>

            <view class="timeline">
              <view class="timeline-item">
                <view class="timeline-icon active">
                  <u-icon name="clock" size="14" color="#fff"></u-icon>
                </view>
                <view class="timeline-content">
                  <text class="timeline-text">预计12-30 星期二 15:00前确认份额</text>
                </view>
              </view>
              <view class="timeline-line"></view>
              <view class="timeline-item">
                <view class="timeline-icon">
                  <view class="dot"></view>
                </view>
                <view class="timeline-content">
                  <text class="timeline-text gray">预计12-31 星期三 开始查看收益</text>
                </view>
              </view>
            </view>
          </view>

          <!-- Order Info Card (Always Visible) -->
          <view class="info-card">
            <view class="card-title-row">
              <view class="red-bar"></view>
              <text class="card-title">订单信息</text>
            </view>
            
            <view class="info-row">
              <text class="label">买入产品</text>
              <view class="value-wrap" @tap="goToDetail">
                <text class="value">古韵民族丝绸非遗刺绣</text>
                <u-icon name="arrow-right" color="#666" size="12"></u-icon>
              </view>
            </view>
            <view class="info-row">
              <text class="label">买入金额</text>
              <text class="value">10.00元</text>
            </view>
            <view class="info-row">
              <text class="label">付款方式</text>
              <text class="value">账户余额</text>
            </view>
            <view class="info-row">
              <text class="label">买入时间</text>
              <text class="value">2025-12-29 19:41:37</text>
            </view>
            <view class="divider"></view>
            <view class="info-row">
              <text class="label">订单号</text>
              <text class="value small">202512291001123456465465465164123</text>
            </view>
          </view>

          <!-- Confirmation Info (Only in CONFIRMED state) -->
          <view class="info-card" v-if="status === 'CONFIRMED'">
            <view class="card-title-row">
              <view class="red-bar"></view>
              <text class="card-title">确认信息</text>
            </view>
            
            <view class="info-row">
              <text class="label">确认金额</text>
              <text class="value red">10.00元</text>
            </view>
            <view class="info-row">
              <text class="label">确认份额</text>
              <text class="value">1.01份</text>
            </view>
            <view class="info-row">
              <text class="label">确认净值</text>
              <text class="value">1.0464</text>
            </view>
            <view class="info-row">
              <text class="label">手续费</text>
              <text class="value">0.00元</text>
            </view>
            <view class="info-row">
              <text class="label">确认时间</text>
              <text class="value">2025-12-31</text>
            </view>
          </view>

        </view>
      </scroll-view>

    </view>
    <!-- Bottom Buttons -->
    <view class="footer-btn">
      <!-- PAID or REVOKED buttons -->
      <template v-if="status === 'PAID' || status === 'REVOKED'">
         <CxComfirmBtn
          text="看看其他藏品"
          :btnStyle="outlineBtnStyle"
          :textStyle="{ color: '#FFE185' }"
          @click="goBack"
          class="footer-item"
        />
        <view style="width: 30rpx;"></view>
         <CxComfirmBtn
          text="再买一笔"
          @click="buyAgain"
          class="footer-item"
        />
      </template>

      <!-- CONFIRMED buttons -->
      <template v-else-if="status === 'CONFIRMED'">
         <CxComfirmBtn
          text="查看资产"
          :btnStyle="outlineBtnStyle"
          :textStyle="{ color: '#FFE185' }"
          @click="viewAssets"
          class="footer-item"
        />
        <view style="width: 30rpx;"></view>
         <CxComfirmBtn
          text="再买一笔"
          @click="buyAgain"
          class="footer-item"
        />
      </template>
    </view>

    

  </view>


    <!-- Revoke Modal -->
    <CxModal
      :show="showRevokeModal"
      title="温馨提示"
      content="确定撤销该产品买入吗？"
      confirmText="确定"
      cancelText="取消"
      @confirm="handleRevokeConfirm"
      @cancel="showRevokeModal = false"
    >
       <view class="modal-text">确定撤销该产品买入吗？</view>
    </CxModal>
</template>

<script setup name="paymentResult">
import { ref, computed } from 'vue'
import CxComfirmBtn from '@/components/CxComfirmBtn.vue'
import CxModal from '@/components/CxModal.vue'

// Status: 'PAID' (付款成功), 'CONFIRMED' (买入成功), 'REVOKED' (已撤销)
// Default to PAID for demo as per "Revocable" flow
const status = ref('PAID') 
const showRevokeModal = ref(false)

const statusText = computed(() => {
  switch (status.value) {
    case 'PAID': return '付款成功'
    case 'CONFIRMED': return '买入成功'
    case 'REVOKED': return '买入撤销-资金已退回账户余额'
    default: return ''
  }
})

const outlineBtnStyle = {
  background: 'transparent',
  border: '2rpx solid #FFE185',
  color: '#FFE185'
}

const handleRevokeConfirm = () => {
  showRevokeModal.value = false
  uni.showLoading({ title: '撤销中' })
  setTimeout(() => {
    uni.hideLoading()
    status.value = 'REVOKED'
    uni.showToast({ title: '撤销成功', icon: 'success' })
  }, 1000)
}

const goBack = () => {
  uni.navigateBack()
}

const buyAgain = () => {
  // Logic to buy again, maybe go back to product page
  uni.navigateBack()
}

const viewAssets = () => {
  console.log('View Assets')
}

const goToDetail = () => {
  console.log('Go to product detail')
}

// Demo helper: Toggle state for testing (Double tap status text maybe? Or just leave as logic)
// I'll expose a global function or just leave it. 
// For real implementation, this would come from page params or API.
</script>

<style lang="scss" scoped>
.page-wrap {
  background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}

.nav-right-text {
  color: #fff;
  font-size: 28rpx;
  padding-right: 20rpx;
}

.page-content {
  flex: 1;
  overflow-y: auto;
}

.status-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0 60rpx;
}

.icon-wrap {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
  /* Placeholder for the package icon */
  /* background: rgba(255,255,255,0.1); */
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-img {
  width: 100%;
  height: 100%;
}

.status-text {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
  
  &.red-text {
    color: #FF4D4F;
    font-size: 32rpx;
  }
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.card-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.red-bar {
  width: 6rpx;
  height: 28rpx;
  background: #FF4141;
  margin-right: 16rpx;
  border-radius: 4rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

/* Info Row Styles */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-size: 28rpx;
  color: #999;
}

.value-wrap {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.value {
  font-size: 28rpx;
  color: #333;
  
  &.red {
    color: #FF4141;
  }
  
  &.small {
    font-size: 24rpx;
    color: #666;
  }
}

.divider {
  height: 1rpx;
  background: #eee;
  margin: 20rpx 0;
}

/* Timeline Styles */
.product-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  font-weight: bold;
  font-size: 30rpx;
  color: #333;
}

.timeline {
  padding-left: 10rpx;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
}

.timeline-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  position: relative;
  z-index: 1;
  
  &.active {
    background: #D1A156;
    border-radius: 50%;
  }
  
  .dot {
    width: 12rpx;
    height: 12rpx;
    background: #fff;
    border: 2rpx solid #D1A156;
    border-radius: 50%;
  }
}

.timeline-line {
  width: 2rpx;
  height: 40rpx;
  background: #ddd;
  margin-left: 15rpx; /* Center with icon width 32rpx -> 16rpx center */
  margin-top: -4rpx;
  margin-bottom: -4rpx;
}

.timeline-content {
  padding-bottom: 4rpx;
}

.timeline-text {
  font-size: 26rpx;
  color: #333;
  
  &.gray {
    color: #999;
  }
}

/* Bottom Bar */
.footer-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 40rpx 60rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-item {
  flex: 1;
}

.modal-text {
  font-size: 30rpx;
  color: #333;
  text-align: center;
  padding: 40rpx 0;
}
</style>
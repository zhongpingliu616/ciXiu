<template>
	<view class="page-wrap recharge-page">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- 可提现额度卡片 -->
			<view class="card balance-card">
				<view class="left">
					<view class="label">账户余额</view>
					<view class="amount">
						¥<up-count-to :endVal="$globalUserInfoXn.amount" separator="," bold fontSize="48rpx" color="#523027"></up-count-to>
						<!-- {{ formatAmount($globalUserInfoXn.amount) }} -->
					</view>
				</view>
				<view class="right">
					<text class="total">________________</text>
					<view class="cash-btn">
						<CxComfirmBtn 
							text="充值记录" 
							@click.stop='goToRecord'
							:btnStyle="{
								height: '40rpx',
								width: '120rpx',
								padding: '0rpx 10rpx',
								background: 'none',
								color: '#523027',
								borderColor: '#523027'
							}"
							:textStyle="{
								fontSize: '24rpx',
								fontWeight: 'bold'
								}"
							/>
					</view>
				</view>
			</view>
			<!-- 充值金额输入区 -->
			<view class="card amount-card">
			<view class="section-title">
				<view class="line"></view>
				<text>充值金额</text>
			</view>
			<view class="input-wrapper">
				<text class="yen">¥</text>
				<up-input
					v-model="withdrawAmount"
					type="number"
					placeholder="请输入充值金额,最低1元无上限"
					class="input"
					@input="validateAmount"
				/>
				<!-- <text class="all" @click="withdrawAll">全部提现</text> -->
			</view>
			<view class="predefined-amounts">
				<up-tag text="￥2000" type="warning" shape="circle" plain plainFill @click="amountCount(2000)"></up-tag>
				<up-tag text="￥3000" type="warning" shape="circle" plain plainFill @click="amountCount(3000)"></up-tag>
				<up-tag text="￥5000" type="warning" shape="circle" plain plainFill @click="amountCount(5000)"></up-tag>
			</view>
			</view>

			<!-- 提现方式选择 -->
			<view class="card method-card">
			<view class="section-title">
				<view class="line"></view>
				<up-cell-group :border="false">
					<up-cell :border="false" :isLink="true" title="付款方式" :value="payType" rightIcon="arrow-right" arrow-direction="down" @click="show = true"></up-cell>
				</up-cell-group>
			</view>
			<!-- <view class="method-list">
				<view
				v-for="(item, index) in depostAccountAry"
				:key="index"
				class="method-item"
				@click="selectMethod(index)"
				>
				<view class="left">
					<CxIconFont :code="item.icon" size="40rpx" :color="item.color" /> &nbsp;&nbsp;
					<text>{{ item.name }}</text>
				</view>
				<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="30rpx" v-if="selectedIndex == index"></u-icon>
				<uni-icons type="circle" color="#ccc" size="40" v-else></uni-icons>
				</view>
			</view> -->
			</view>

			<!-- 立即充值按钮 -->
			<view class="submit-btn">
			<u-button
				type="error"
				shape="circle"
				:disabled="!canSubmit"
				@click="submitWithdraw"
			>立即充值</u-button>
			</view>
			
		</view>
	 <view></view>
	</view>
<u-popup
    v-model:show="show"
    mode="bottom"
    :border-radius="20"
    closeable
    :close-icon-pos="'top-right'"
    :closeable="true"
    :mask-close-able="true"
    :safe-area-inset-bottom="true"
    :z-index="9999"
    :custom-style="{ width: '100%', maxWidth: '100%', background: '#7a1e28' }"
  >
    <view class="payment-list-warpper">
	  	<!-- 标题 -->
		<view class="title">请选择付款方式</view>

		<!-- 支付方式列表 -->
		<view class="payment-list">
			<view
				v-for="(item, index) in depostAccountAry"
				:key="index"
				class="method-item"
				@click="selectMethod(item, index)"
				>
				<view class="left">
					<image :src="item.qrcode" width="40rpx" height="40rpx" class="icon" /> &nbsp;&nbsp;
					<!-- <CxIconFont :code="item.icon" size="40rpx" :color="item.color" /> &nbsp;&nbsp; -->
					<text>{{ item.payment_name }}</text>
				</view>
				<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="30rpx" v-if="selectedIndex == index"></u-icon>
				<uni-icons type="circle" color="#ccc" size="30" v-else></uni-icons>
			</view>
		</view>

		<!-- 按钮区域 -->
		<view class="btn-group">
		<CxComfirmBtn 
			text="取消" 
			@click="onCancel"
			:btnStyle="{
				flex: 1,
				marginRight: '10px',
				background: 'transparent',
				border: '2px solid #fff',
				color: '#fff',
			}" />
		<CxComfirmBtn 
			text="确定" 
			@click="onConfirm"
			:btnStyle="{
				flex: 1,
				background: 'linear-gradient(90deg, #ff6b6b, #ff9c6b)',
				color: '#fff',
			}" />
		</view>

	</view>
  </u-popup>
</template>


<script setup name="recharge">
import { depositAccountLists, addDepositOrder } from '@/api/xn.js'
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
let title = ref("我的钱包");
let depostAccountAry= ref([]);
const withdrawAmount = ref('');
const selectedIndex = ref(0);
const payType = ref("");
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const methods = ref([
  {
    name: '微信支付',
    icon: '&#xe607;',
	color: '#07c160',
  },
  {
    name: '支付宝',
    icon: '&#xe60a;',
	color: '#1677FF',
  }
])
// 控制弹窗显示
const show = ref(props.modelValue)

// 监听父组件 v-model
watch(
  () => props.modelValue,
  (val) => {
    show.value = val
  }
)
const selectedItem = computed(() => {
  return depostAccountAry.value[selectedIndex.value] || {}
})
// 当前选中项
const selected = ref('wechat') // 默认选中微信

// 关闭弹窗并触发 cancel 事件
const onCancel = () => {
  show.value = false
  // emit('cancel')
}

// 确认选择并触发 confirm 事件
const onConfirm = async() => {
  // emit('confirm', selected.value)
  show.value = false 
  payType.value = selectedItem.value.payment_name;
}
// 格式化金额显示
const formatAmount = (num) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

// 充值金额
const amountCount = (value) => {
  withdrawAmount.value = value
}

// 验证金额输入
const validateAmount = () => {
  const val = Number(withdrawAmount.value)
  if (val < 1 && val !== 0) {
    uni.showToast('每次充值不得少于1元')
    withdrawAmount.value = ''
  }
}

// 选择充值方式
const selectMethod = (item,index) => {
  selectedIndex.value = index;
}

// 是否可提交
const canSubmit = computed(() => {
  const amount = Number(withdrawAmount.value)
  const amountBoolean = amount >= 1 && amount <= formatAmount(proxy.$globalUserInfoXn.amount)
  return amountBoolean && payType.value !== ""
})

// 提交充值
const submitWithdraw = async() => {
  if (!canSubmit.value) return
  uni.showToast('提现申请已提交，请等待到账')
  // TODO: 调用接口
  const {code,msg} = await addDepositOrder({
    amount: withdrawAmount.value,
    deposit_account_id: selectedItem.value.id,
  });
  if(code === 200){
    uni.showToast(msg)
    emit('confirm')
  } else {
    uni.showToast(msg)
  }
}

// 跳转充值记录
const goToRecord = () => {
  uni.navigateTo({ url: '/pages/xn/income/recharge-record' })
}
const getDepostAccountData = async ()=>{
	const {code,data={},msg} = await depositAccountLists();
	if(code === 200){
		depostAccountAry.value = data.lists || [];
		payType.value = "";
		withdrawAmount.value = "";
		
	} else {
		uni.showToast(msg)
	}
};
onMounted(() => {
  getDepostAccountData()
})
</script>

<style lang="scss" scoped>
.payment-list-warpper {
  padding: 20px;
  background-color: #7a1e28;
  border-radius: 20px;
}
.title {
  font-size: 18px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.payment-list {
  margin-bottom: 30px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.payment-item:last-child {
  border-bottom: none;
}

.left {
	
}

.icon {
  margin-right: 10px;
}

.text {
  color: #fff;
  font-size: 16px;
}

.btn-group {
  display: flex;
  gap: 10px;
}
.section-title {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.line {
  width: 6rpx;
  height: 22rpx;
  background: linear-gradient(#FC4B35, #FC7856);
  margin-right: 10rpx;
  border-radius: 4rpx;
}
.page-wrap{
	grid-template-rows: v-bind(safeTopValue) 1fr 0rpx;
}		
.page-wrapper {
  background: #8B0000 url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZCIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjODkwMDAwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODYwMDAwIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==') repeat;
  padding: 20rpx;
  min-height: 100vh;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
.left {
    .label {
      font-size: 24rpx;
      color: #13111E;
      margin-bottom: 10rpx;
    }
    .amount {
      font-size: 42rpx;
      font-weight: bold;
      color: #523027;
    }
  }
  .right {
	display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: flex-end;
    .total {
      opacity: 0;
    }
    .cash-btn {
      
    }
  }
.balance-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f3d79d 50%, #f7eccf 100%);
  
}
.predefined-amounts{
	margin-top: 12rpx;
	display: flex;
	align-items: center;
	justify-content:space-around;
}
.input-wrapper {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    .yen {
      font-size: 48rpx;
      color: #333;
	  font-weight: bold;
      margin-right: 20rpx;
    }
    .input {
      flex: 1;
      font-size: 36rpx;
      padding: 10rpx 0;
      outline: none;
      border: none;
    }
  }
.amount-card {
	&::v-deep{
		.u-tag--medium{
			line-height: 0;
			border-color: #CACACA;
			padding: 2rpx 30rpx;
			background-color: #fff;
			text{
				color: #2E2E2E;
			}
		}
	}
  .title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
  .tip {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
  }
}
.method-list {
  }
.method-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
	&:last-child {
		border-bottom: none;
	}
	.left {
		display: flex;
		align-items: center;
	.icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}
	text {
		font-size: 20rpx;
		color: #FFF;
	}
	}
}
.method-card {
  .title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  
}

.submit-btn {
  padding: 60rpx 30rpx;
  .u-button {
    width: 100%;
    height: 80rpx;
    font-size: 32rpx;
    background: linear-gradient(to right, #FF6900, #FF4500);
    border: none;
    color: #fff;
    &::after {
      border: none;
    }
  }
}
</style>
<template>
	<view class="page-wrap withdraw-cash-page">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- 可提现额度卡片 -->
			<view class="card balance-card">
			<view class="left">
				<text class="label">¥</text>
				<text class="amount">
          <up-count-to :endVal="$globalUserInfoXn.amount" separator="," fontSize="48rpx" color="#523027"></up-count-to>
          </text>
          <!-- {{ formatAmount($globalUserInfoXn.amount) }} -->
			</view>
			<view class="right">
				<!-- <text class="total">累计赚了：¥{{ formatAmount($globalUserInfoXn.earned) }}</text> -->
				<view class="cash-btn">
					<CxComfirmBtn 
						text="提现记录" 
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

			<!-- 提现金额输入区 -->
			<view class="card amount-card">
			<text class="title">提现金额</text>
			<view class="input-wrapper">
				<text class="yen">¥</text>
				<up-input
				v-model="withdrawAmount"
				type="number"
				placeholder="请输入提现金额"
				class="input"
				@input="validateAmount"
				/>
				<text class="all" @click="withdrawAll">全部提现</text>
			</view>
			<text class="tip">可提现金额：¥{{ formatAmount($globalUserInfoXn.amount) }}, 每次提现不得少于1元</text>
			</view>

			<!-- 提现方式选择 -->
			<view class="card method-card">
			<text class="title">提现方式</text>
			<view class="method-list">
				<view
				v-for="(item, index) in methods"
				:key="index"
				class="method-item"
				@click="selectMethod(index)"
				>
				<view class="left">
					<CxIconFont :code="item.icon" size="40rpx" :color="item.color" /> &nbsp;&nbsp;
					<text>{{ item.account_name }} {{ item.opening_bank }}</text>
				</view>
				<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="30rpx" v-if="selectedMethod == index"></u-icon>
				<uni-icons type="circle" color="#ccc" size="30rpx" v-else></uni-icons>
				</view>
			</view>
			</view>

			<!-- 立即提现按钮 -->
			<view class="submit-btn">
        <u-button
          type="error"
          shape="circle"
          :disabled="!canSubmit"
          @click="submitWithdraw"
        >立即提现</u-button>
			</view>
			
		</view>
	 <view></view>
	</view>
</template>


<script setup name="withdrawCash">
import { bankLists, addWithdrawalOrder } from '@/api/index'
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
let title = ref("余额提现");
const availableAmount = ref(22123)
const totalEarned = ref(212334.00)
const withdrawAmount = ref('')
const selectedMethod = ref(0)

// 提现方式列表
const methods = ref([
  // {
  //   account_name: '微信支付',
  //   icon: '&#xe607;',
	// color: '#07c160',
  // },
  // {
  //   account_name: '支付宝',
  //   icon: '&#xe60a;',
	// color: '#1677FF',
  // },
  // {
  //   account_name: '工商银行 3452************543',
  //   icon: '&#xe63f;',
	//   color: '#FFA937',
  // }
])

// 格式化金额显示
const formatAmount = (num) => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

// 全部提现
const withdrawAll = () => {
  withdrawAmount.value = formatAmount(proxy.$globalUserInfoXn.amount) 
  console.log("全部提现",withdrawAmount.value)
}

// 验证金额输入
const validateAmount = () => {
  const val = Number(withdrawAmount.value)
  if (val < 1 && val !== 0) {
    uni.showToast('每次提现不得少于1元')
    withdrawAmount.value = ''
  }
}

// 选择提现方式
const selectMethod = (index) => {
  selectedMethod.value = index
}

// 是否可提交
const canSubmit = computed(() => {
  const amount = Number(withdrawAmount.value)
  return amount >= 1 && amount <= proxy.$globalUserInfoXn.amount
})

// 提交提现
const submitWithdraw = () => {
  if (!canSubmit.value) return
  uni.showToast('提现申请已提交，请等待到账')
  // TODO: 调用接口提交提现申请
  if(!methods.value[selectedMethod.value].id){
    uni.showToast('请选择提现方式')
    return
  }
  addWithdrawalOrder({
    amount: withdrawAmount.value,
    user_bank_id: methods.value[selectedMethod.value].id
  }).then(res => {
    if(res.code === 200){
      uni.showToast('提现申请已提交，请等待到账')
      withdrawAmount.value = ''
    } else {
      uni.showToast({
        title: res.msg || '提现申请提交失败',
        icon: 'none'
      });
    }
  })
}

// 跳转提现记录
const goToRecord = () => {
  uni.navigateTo({ url: '/pages-xn/income/withdrawal-record' })
}	

// 获取现有支付列表
const getCurrentPayList = async()=>{
  const { code=9999, data,msg } = await bankLists();
  if (code === 200) {
    if(data?.lists.length>0){
      data.lists.forEach(element => {
        if(element.type == 1){ // 微信支付
          methods.value.push({
            ...element,
            name: element.account_name,
            icon: '&#xe607;',
			color: '#07c160',
          });
        } else if(element.type == 2){ // 支付宝
          methods.value.push({
            ...element,
            name: element.account_name,
            icon: '&#xe60a;',
			color: '#1677FF',
          });
        } else if(element.type == 3){ // 银行卡
          methods.value.push({
            ...element,
            name: element.account_name,
            icon: '&#xe63f;',
			      color: '#FFA937',
          });
        }
      });
    }
  } else {
    uni.showToast({
      title: msg || '数据加载失败',
      icon: 'none'
    });
  }
};
function formatMoney(value, decimals = 2) {
  const num = Number(value)
  if (Number.isNaN(num)) return '0.00'
  return num.toFixed(decimals)
}
onMounted(()=>{
  getCurrentPayList();
});
</script>

<style lang="scss" scoped>
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
      font-size: 28rpx;
      color: #13111E;
      margin-bottom: 10rpx;
    }
    .amount {
      font-size: 60rpx;
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
      font-size: 24rpx;
	  font-weight: bold;
      color: #13111E;
      display: block;
      margin-bottom: 10rpx;
	  white-space: nowrap;
    }
  }
.balance-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f3d79d 50%, #f7eccf 100%);
  
}
.input-wrapper {
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #eee;
    padding-bottom: 20rpx;
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
    .all {
      font-size: 28rpx;
      color: #13111E;
      margin-left: 20rpx;
    }
  }
.amount-card {
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

.method-card {
  .title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }
  .method-list {
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
          font-size: 28rpx;
          color: #333;
        }
      }
    }
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
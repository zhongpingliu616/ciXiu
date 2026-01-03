<template>
  <view class="trends-card">
    <view class="header">
      <text class="title">NFT</text>
      <view class="tabs">
        <text 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab-item"
          :class="{ active: currentTab === index }"
          @tap="handleTabChange(index)"
        >
          {{ tab }}
        </text>
      </view>
    </view>
    
    <view class="price-section">
      <text class="price">{{ currentPrice }}</text>
      <text class="change" :class="{ up: priceChange >= 0, down: priceChange < 0 }">
        {{ priceChange >= 0 ? '+' : '' }}{{ priceChange }}%
      </text>
    </view>
    
    <view class="chart-container">
      <!-- renderjs 视图层 -->
      <view 
        id="chart" 
        class="chart-dom" 
        :prop="chartData" 
        :change:prop="echarts.updateChart"
      ></view>
    </view>
  </view>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const tabs = ['日', '周', '月'];
    const currentTab = ref(0);
    const currentPrice = ref('80.36');
    const priceChange = ref(12.63);
    const chartData = ref({
      tabsIndex: 0,
      data: {} // 初始数据为空，由 renderjs 生成或后端获取
    });

    const handleTabChange = (index) => {
      currentTab.value = index;
      // 更新 prop 触发 renderjs
      chartData.value = {
        tabsIndex: index,
        timestamp: Date.now() // 强制更新
      };
    };

    // 监听 renderjs 发回的数据更新（可选，如果需要在逻辑层显示价格）
    const updatePriceInfo = (data) => {
      if(data) {
        currentPrice.value = data.price;
        priceChange.value = data.change;
      }
    }

    return {
      tabs,
      currentTab,
      currentPrice,
      priceChange,
      chartData,
      handleTabChange,
      updatePriceInfo
    };
  }
}
</script>

<script module="echarts" lang="renderjs">
import * as echarts from 'echarts';

let myChart = null;

export default {
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById('chart');
      if (!chartDom) return;
      myChart = echarts.init(chartDom);
      this.updateChart({ tabsIndex: 0 }); // 初始化显示
    },
    
    // 生成模拟数据
    generateData(count) {
      let data = [];
      let baseValue = Math.random() * 100;
      let boxVals = [];
      let dates = [];
      let volumes = [];
      
      for (let i = 0; i < count; i++) {
          let date = new Date();
          date.setDate(date.getDate() - (count - i));
          dates.push([date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/'));
          
          baseValue = baseValue + Math.random() * 20 - 10;
          let value = Math.max(0, Math.round(baseValue) + Math.round(Math.random() - 0.5));
          let open = Math.round(value + Math.random() * 10 - 5);
          let close = Math.round(value + Math.random() * 10 - 5);
          let lowest = Math.min(open, close) - Math.random() * 5;
          let highest = Math.max(open, close) + Math.random() * 5;
          let vol = Math.round(Math.random() * 1000);
          
          boxVals.push([open, close, lowest, highest]);
          volumes.push(vol);
      }
      return { dates, boxVals, volumes };
    },
    
    calculateMA(dayCount, data) {
      var result = [];
      for (var i = 0, len = data.boxVals.length; i < len; i++) {
          if (i < dayCount) {
              result.push('-');
              continue;
          }
          var sum = 0;
          for (var j = 0; j < dayCount; j++) {
              sum += data.boxVals[i - j][1];
          }
          result.push(sum / dayCount);
      }
      return result;
    },

    updateChart(newValue, oldValue, ownerInstance, instance) {
      if (!myChart) return;
      
      const index = newValue ? newValue.tabsIndex : 0;
      const count = index === 0 ? 30 : (index === 1 ? 60 : 90);
      const data = this.generateData(count);
      
      // 发送最新价格回逻辑层
      const lastData = data.boxVals[data.boxVals.length - 1];
      if (lastData && ownerInstance) {
          const prevClose = data.boxVals[data.boxVals.length - 2] ? data.boxVals[data.boxVals.length - 2][1] : lastData[0];
          const change = ((lastData[1] - prevClose) / prevClose * 100).toFixed(2);
          
          // 调用逻辑层方法更新价格
          ownerInstance.callMethod('updatePriceInfo', {
            price: lastData[1].toFixed(2),
            change: change
          });
      }
	console.log("图表数据：",data);
      const option = {
        backgroundColor: '#fff',
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            position: function (pos, params, el, elRect, size) {
                const obj = { top: 10 };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
        },
        axisPointer: {
            link: [{ xAxisIndex: 'all' }],
            label: { backgroundColor: '#777' }
        },
        grid: [
            { left: '10%', right: '8%', height: '50%' },
            { left: '10%', right: '8%', top: '63%', height: '16%' }
        ],
        xAxis: [
            {
                type: 'category',
                data: data.dates,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            },
            {
                type: 'category',
                gridIndex: 1,
                data: data.dates,
                boundaryGap: false,
                axisLine: { onZero: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                min: 'dataMin',
                max: 'dataMax'
            }
        ],
        yAxis: [
            { scale: true, splitArea: { show: true } },
            { scale: true, gridIndex: 1, splitNumber: 2, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } }
        ],
        dataZoom: [
            { type: 'inside', xAxisIndex: [0, 1], start: 50, end: 100 },
            { show: true, xAxisIndex: [0, 1], type: 'slider', top: '85%', start: 50, end: 100 }
        ],
        series: [
            {
                name: '日K',
                type: 'candlestick',
                data: data.boxVals,
                itemStyle: {
                    color: '#00C853',
                    color0: '#FF4141',
                    borderColor: '#00C853',
                    borderColor0: '#FF4141'
                }
            },
            { name: 'MA5', type: 'line', data: this.calculateMA(5, data), smooth: true, lineStyle: { opacity: 0.5 } },
            { name: 'MA10', type: 'line', data: this.calculateMA(10, data), smooth: true, lineStyle: { opacity: 0.5 } },
            { name: 'MA20', type: 'line', data: this.calculateMA(20, data), smooth: true, lineStyle: { opacity: 0.5 } },
            {
                name: 'Volume',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: data.volumes,
                itemStyle: {
                    color: (params) => {
                        return data.boxVals[params.dataIndex][1] > data.boxVals[params.dataIndex][0] 
                            ? '#00C853' 
                            : '#FF4141';
                    }
                }
            }
        ]
      };
      
      myChart.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.trends-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    
    .title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
    
    .tabs {
      display: flex;
      background: #F5F5F5;
      border-radius: 24rpx;
      padding: 4rpx;
      
      .tab-item {
        font-size: 24rpx;
        color: #999;
        padding: 6rpx 20rpx;
        border-radius: 20rpx;
        
        &.active {
          background: #FF6B4B;
          color: #fff;
        }
      }
    }
  }
  
  .price-section {
    display: flex;
    align-items: baseline;
    margin-bottom: 30rpx;
    
    .price {
      font-size: 48rpx;
      font-weight: bold;
      color: #333;
      margin-right: 16rpx;
    }
    
    .change {
      font-size: 28rpx;
      color: #00C853;
      
      &.up { color: #00C853; }
      &.down { color: #FF4141; }
    }
  }
  
  .chart-container {
    height: 600rpx;
    width: 100%;
    
    .chart-dom {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
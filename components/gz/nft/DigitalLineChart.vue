<template>
  <view class="chart-card">
    <view class="header">
      <text class="title">价格走势</text>
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
    
    <view class="chart-container">
      <view 
        id="digital-line-chart" 
        class="chart-dom" 
        :prop="chartData" 
        :change:prop="echarts.updateChart"
      ></view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DigitalLineChart',
  setup() {
    const tabs = ['日', '周', '月'];
    const currentTab = ref(0);
    const chartData = ref({
      tabsIndex: 0,
      timestamp: 0
    });

    const handleTabChange = (index) => {
      currentTab.value = index;
      chartData.value = {
        tabsIndex: index,
        timestamp: Date.now()
      };
    };

    return {
      tabs,
      currentTab,
      chartData,
      handleTabChange
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
      const chartDom = document.getElementById('digital-line-chart');
      if (!chartDom) return;
      myChart = echarts.init(chartDom);
      this.updateChart({ tabsIndex: 0 });
    },
    
    generateData(count) {
      let dates = [];
      let values = [];
      let baseValue = 30 + Math.random() * 10;
      
      for (let i = 0; i < count; i++) {
          let date = new Date();
          date.setDate(date.getDate() - (count - i));
          dates.push([date.getMonth() + 1, date.getDate()].join('/'));
          
          baseValue = baseValue + Math.random() * 4 - 2;
          values.push(baseValue.toFixed(2));
      }
      return { dates, values };
    },

    updateChart(newValue, oldValue, ownerInstance, instance) {
      if (!myChart) return;
      
      const index = newValue ? newValue.tabsIndex : 0;
      const count = index === 0 ? 24 : (index === 1 ? 7 : 30); // Hours for day, days for week/month
      const data = this.generateData(count);
	
      const option = {
        backgroundColor: '#fff',
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '10%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#FF4141',
                    type: 'dashed'
                }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.dates,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
                color: '#999',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            splitLine: {
                lineStyle: {
                    color: '#f5f5f5'
                }
            },
            axisLabel: {
                color: '#999',
                fontSize: 10
            }
        },
        series: [
            {
                name: '价格',
                type: 'line',
                smooth: true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    color: '#1890FF'
                },
                // areaStyle: {
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //         {
                //             offset: 0,
                //             color: 'rgba(24, 144, 255, 0.2)'
                //         },
                //         {
                //             offset: 1,
                //             color: 'rgba(24, 144, 255, 0)'
                //         }
                //     ])
                // },
                data: data.values
            }
        ]
      };
      
      myChart.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
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
  
  .chart-container {
    height: 400rpx;
    width: 100%;
    
    .chart-dom {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
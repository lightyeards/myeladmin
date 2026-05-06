<template>
  <div v-loading="!show" element-loading-text="数据加载中..." :style="!show ? 'height: 500px' : 'height: 100%'" class="app-container">
    <div v-if="show">
      <el-card class="box-card" shadow="never">
        <div class="system-info">
          <svg-icon icon-class="system" />
          <span>系统：{{ data.sys.os }}</span>
          <span>IP：{{ data.sys.ip }}</span>
          <span>项目已不间断运行：{{ data.sys.day }}</span>
          <el-icon class="refresh-icon" @click="init"><refresh /></el-icon>
        </div>
      </el-card>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="gauge-card" shadow="never">
            <div class="gauge-title">CPU使用率</div>
            <el-tooltip placement="top">
              <template #content>
                <div style="font-size: 12px; line-height: 1.8;">
                  <div>{{ data.cpu.name }}</div>
                  <div>{{ data.cpu.package }}</div>
                  <div>{{ data.cpu.core }}</div>
                  <div>{{ data.cpu.logic }}</div>
                </div>
              </template>
              <div class="gauge-content">
                <el-progress type="dashboard" :percentage="parseFloat(data.cpu.used)" />
              </div>
            </el-tooltip>
            <div class="gauge-footer">{{ data.cpu.coreNumber }} 核心</div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="gauge-card" shadow="never">
            <div class="gauge-title">内存使用率</div>
            <el-tooltip placement="top">
              <template #content>
                <div style="font-size: 12px; line-height: 1.8;">
                  <div>总量：{{ data.memory.total }}</div>
                  <div>已使用：{{ data.memory.used }}</div>
                  <div>空闲：{{ data.memory.available }}</div>
                </div>
              </template>
              <div class="gauge-content">
                <el-progress type="dashboard" :percentage="parseFloat(data.memory.usageRate)" />
              </div>
            </el-tooltip>
            <div class="gauge-footer">{{ data.memory.used }} / {{ data.memory.total }}</div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="gauge-card" shadow="never">
            <div class="gauge-title">交换区使用率</div>
            <el-tooltip placement="top">
              <template #content>
                <div style="font-size: 12px; line-height: 1.8;">
                  <div>总量：{{ data.swap.total }}</div>
                  <div>已使用：{{ data.swap.used }}</div>
                  <div>空闲：{{ data.swap.available }}</div>
                </div>
              </template>
              <div class="gauge-content">
                <el-progress type="dashboard" :percentage="parseFloat(data.swap.usageRate)" />
              </div>
            </el-tooltip>
            <div class="gauge-footer">{{ data.swap.used }} / {{ data.swap.total }}</div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="gauge-card" shadow="never">
            <div class="gauge-title">磁盘使用率</div>
            <el-tooltip placement="top">
              <template #content>
                <div style="font-size: 12px; line-height: 1.8;">
                  <div>总量：{{ data.disk.total }}</div>
                  <div>空闲：{{ data.disk.available }}</div>
                </div>
              </template>
              <div class="gauge-content">
                <el-progress type="dashboard" :percentage="parseFloat(data.disk.usageRate)" />
              </div>
            </el-tooltip>
            <div class="gauge-footer">{{ data.disk.used }} / {{ data.disk.total }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <span class="chart-header">CPU使用率监控</span>
            </template>
            <div style="height: 300px;">
              <v-chart :option="cpuInfo" autoresize />
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="chart-card" shadow="never">
            <template #header>
              <span class="chart-header">内存使用率监控</span>
            </template>
            <div style="height: 300px;">
              <v-chart :option="memoryInfo" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import VChart from 'vue-echarts'
import { initData } from '@/api/data'
export default {
  name: 'ServerMonitor',
  components: {
    'v-chart': VChart
  },
  data() {
    return {
      show: false,
      monitor: null,
      url: 'api/monitor',
      data: {},
      cpuInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            color: 'rgb(32, 160, 255)'
          },
          itemStyle: {
            color: '#6fbae1',
            lineStyle: {
              color: '#6fbae1'
            }
          }
        }]
      },
      memoryInfo: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          interval: 20
        },
        series: [{
          data: [],
          type: 'line',
          areaStyle: {
            color: 'rgb(32, 160, 255)'
          },
          itemStyle: {
            color: '#6fbae1',
            lineStyle: {
              color: '#6fbae1'
            }
          }
        }]
      }
    }
  },
  created() {
    this.init()
    this.monitor = window.setInterval(() => {
      setTimeout(() => {
        this.init()
      }, 2)
    }, 3500)
  },
  unmounted() {
    clearInterval(this.monitor)
  },
  methods: {
    init() {
      initData(this.url, {}).then(data => {
        this.data = data
        this.show = true
        if (this.cpuInfo.xAxis.data.length >= 8) {
          this.cpuInfo.xAxis.data.shift()
          this.memoryInfo.xAxis.data.shift()
          this.cpuInfo.series[0].data.shift()
          this.memoryInfo.series[0].data.shift()
        }
        this.cpuInfo.xAxis.data.push(data.time)
        this.memoryInfo.xAxis.data.push(data.time)
        this.cpuInfo.series[0].data.push(parseFloat(data.cpu.used))
        this.memoryInfo.series[0].data.push(parseFloat(data.memory.usageRate))
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.system-info {
  display: flex;
  align-items: center;
  gap: 28px;
  color: #666;
  font-size: 13px;

  .refresh-icon {
    margin-left: auto;
    cursor: pointer;
    font-size: 16px;
    color: #999;
    transition: color 0.2s;

    &:hover {
      color: #409EFF;
    }
  }
}

.gauge-card {
  margin-bottom: 10px;

  :deep(.el-card__body) {
    padding: 16px 12px 12px;
  }
}

.gauge-title {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.gauge-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 140px;
}

.gauge-footer {
  text-align: center;
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.chart-card {
  margin-bottom: 10px;

  :deep(.el-card__header) {
    padding: 12px 16px;
    border-bottom: 1px solid #ebeef5;
  }

  :deep(.el-card__body) {
    padding: 12px;
  }
}

.chart-header {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}
</style>

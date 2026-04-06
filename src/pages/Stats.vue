<template>
  <div class="stats-container">
    <div class="stats-header">
      <img 
        src="../assets/serv2.png" 
        alt="服务器图标" 
        class="server-image"
        @click="onServerClick()"
      />
      <h1 class="stats-title">服务器统计</h1>
    </div>

    <div class="overview-stats">
      <div class="overview-item">
        <span class="overview-label">总服务器数:</span>
        <span class="overview-value">{{ overviewStats.totalServers || 0 }}</span>
      </div>
      <div class="overview-item">
        <span class="overview-label">在线服务器数:</span>
        <span class="overview-value">{{ overviewStats.onlineServers || 0 }}</span>
      </div>
      <div class="overview-item">
        <span class="overview-label">总玩家数:</span>
        <span class="overview-value">{{ overviewStats.totalPlayers || 0 }}</span>
      </div>
    </div>
    
    <div class="servers-grid">
      <div 
        v-for="server in servers" 
        :key="server.id" 
        class="server-card"
      >
        <div class="server-card-content">
          <div class="server-thumbnail">
            <img 
              :src="server.thumbnail" 
              :alt="server.title" 
              class="thumbnail-image"
            />
          </div>
          <div class="server-details">
            <div class="server-header">
              <h2 class="server-title">{{ server.title }}</h2>
              <span 
                :class="['server-status', server.status ? 'online' : 'offline']"
              >
                {{ server.status ? '在线' : '离线' }}
              </span>
            </div>
            <div class="server-info">
              <div class="server-info-item">
                <span class="server-info-label">人数:</span>
                <span class="server-info-value">{{ server.players }}/{{ server.maxPlayers }}</span>
              </div>
              <div class="server-info-item">
                <span class="server-info-label">版本:</span>
                <span class="server-info-value">{{ server.version }}</span>
              </div>
              <div class="server-info-item">
                <span class="server-info-label">类型:</span>
                <span class="server-info-value">{{ server.type }}</span>
              </div>
              <div class="server-info-item">
                <span class="server-info-label">地址:</span>
                <span class="server-info-value">{{ server.address }}</span>
              </div>
            </div>
            
          </div>
          <div class="server-chart">
            <div :ref="el => setChartRef(el, server.id)" class="chart-container"></div>
          </div>

          <div class="reload-button" @click="getServerRealTimeStats(server.id)">
            <img 
              src="../assets/reload.png" 
              alt="刷新" 
              class="reload-icon" 
              :class="{ 'rotate': rotatingServer === server.id }"
              :key="`reload-${server.id}`"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import '../styles/stat.css'
import { handleServerClick } from '../utils/serverUtils'

const chartRefs = ref({})
const charts = ref({})

const servers = ref([])
const overviewStats = ref({})
const rotatingServer = ref(null)

// 获取概览统计数据
async function fetchOverviewStats() {
  try {
    const response = await fetch('http://localhost:3000/api/stats/overview');
    
    if (!response.ok) {
      throw new Error('获取概览统计失败');
    }
    
    const data = await response.json();
    if (data.success) {
      overviewStats.value = data.data;
    }
  } catch (error) {
    console.error('获取概览统计失败:', error);
  }
}

// 获取服务器实时状态
async function getServerRealTimeStats(serverId) {
  // 触发旋转动画
  rotatingServer.value = serverId;
  
  // 0.6秒后重置动画状态
  setTimeout(() => {
    rotatingServer.value = null;
  }, 600);
  
  try {
    const response = await fetch(`http://localhost:3000/api/stats/servers/${serverId}/realtime`);
    
    if (!response.ok) {
      throw new Error('获取服务器实时状态失败');
    }
    
    const data = await response.json();
    if (data.success) {
      // 更新服务器数据
      const updatedServers = servers.value.map(server => {
        if (server.id === serverId) {
          return {
            ...server,
            players: data.data.currentPlayers,
            maxPlayers: data.data.maxPlayers,
            status: data.data.onlineStatus
          };
        }
        return server;
      });
      servers.value = updatedServers;
      // 更新图表
      initCharts();
    }
  } catch (error) {
    console.error('获取服务器实时状态失败:', error);
  }
}

// 生成最近10天的日期标签
function getLast10Days() {
  const days = [];
  const today = new Date();
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(`${date.getMonth() + 1}/${date.getDate()}`);
  }
  return days;
}

const last10Days = getLast10Days();

// 设置图表引用
function setChartRef(el, serverId) {
  if (el) {
    chartRefs.value[serverId] = el
  }
}

// 点击图标触发查询
async function onServerClick() {
  try {
    await handleServerClick((updatedServers) => {
      servers.value = updatedServers
      // 更新图表
      initCharts()
    })
  } catch (error) {
    console.error('处理服务器点击事件失败:', error)
  }
}

// 初始化图表
function initCharts() {
  servers.value.forEach(server => {
    const chartEl = chartRefs.value[server.id]
    if (chartEl) {
      let chart = charts.value[server.id]
      if (!chart) {
        // 如果图表实例不存在，创建新实例
        chart = echarts.init(chartEl)
        charts.value[server.id] = chart
      }
      // 更新图表数据
      updateServerChart(chart, server)
    }
  })
}

// 更新服务器图表数据
function updateServerChart(chart, server) {
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: last10Days,
      axisLabel: {
        fontSize: 10,
        interval: 1,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: Math.max(...server.last10dayHeat, 10),
      interval: 2,
      axisLabel: {
        fontSize: 10
      }
    },
    series: [
      {
        name: '热度',
        type: 'line',
        data: server.last10dayHeat,
        smooth: true,
        itemStyle: {
          color: '#188df0'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(24, 141, 240, 0.3)'
            },
            {
              offset: 1,
              color: 'rgba(24, 141, 240, 0.1)'
            }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option)
}

// 处理窗口大小变化
function handleResize() {
  Object.values(charts.value).forEach(chart => {
    if (chart) {
      chart.resize()
    }
  })
}

// 获取服务器列表数据
async function fetchServersData() {
  try {
    // 先获取服务器列表
    const serversResponse = await fetch('http://localhost:3000/api/stats/servers');
    
    if (!serversResponse.ok) {
      throw new Error('获取服务器列表失败');
    }
    
    const serversData = await serversResponse.json();
    console.log('服务器列表数据:', serversData)
    
    if (serversData.success && serversData.data && serversData.data.length > 0) {
      // 转换服务器数据格式
      const formattedServers = serversData.data.map(server => ({
        id: server._id,
        title: server.title,
        status: true,
        players: server.currentPlayers,
        maxPlayers: server.maxPlayers,
        version: server.version,
        type: server.type,
        address: server.address,
        thumbnail: server.thumbnail,
        monthlyHeat: server.monthlyHeat || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        last10dayHeat: server.last10dayHeat || Array(10).fill(0),
        last_updated_str: server.last_updated_str,
        motd: server.motd,
        ping: server.ping,
        today_max: server.today_max,
        today_min: server.today_min,
        today_avg: server.today_avg,
        history_max: server.history_max,
        total_queries: server.total_queries,
        last_updated: server.last_updated,
        created_at: server.created_at,
        created_at_str: server.created_at_str
      }));
      
      servers.value = formattedServers;
      // 初始化图表
      // 等待 DOM 渲染完成
      nextTick(() => {
        initCharts();
      })
    }
  } catch (error) {
    console.error('获取服务器数据失败:', error);
  }
}

// 组件挂载时获取服务器数据
onMounted(async () => {
  await fetchServersData();
  await fetchOverviewStats();
  window.addEventListener('resize', handleResize);
})

// 组件卸载时清理图表
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  Object.values(charts.value).forEach(chart => {
    if (chart) {
      chart.dispose()
    }
  })
})
</script>
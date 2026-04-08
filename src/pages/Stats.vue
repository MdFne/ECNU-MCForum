<template>
  <div class="bg-box">
    <div class="bgIMG"></div>
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
                  <span class="server-info-value">{{ server.address }}:{{ server.port }}</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import '../styles/stat.css'
import { handleServerClick } from '../utils/serverUtils'
import { formatServersList, createOfflineServerData, createOnlineServerData } from '../utils/serverFormatter'

const API_BASE = 'http://localhost:3000/api'

const chartRefs = ref({})
const charts = ref({})

const servers = ref([])
const overviewStats = ref({})
const rotatingServer = ref(null)

async function fetchOverviewStats() {
  try {
    const response = await fetch(`${API_BASE}/stats/overview`);
    
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

async function getServerRealTimeStats(serverId) {
  rotatingServer.value = serverId;
  
  setTimeout(() => {
    rotatingServer.value = null;
  }, 1000);
  
  try {
    const response = await fetch(`${API_BASE}/stats/servers/${serverId}/realtime`);
    
    if (!response.ok) {
      servers.value = servers.value.map(server => {
        if (server.id === serverId) {
          return createOfflineServerData(serverId, server);
        }
        return server;
      });
      throw new Error('获取服务器实时状态失败');
    }
    
    const data = await response.json();
    if (data.success) {
      servers.value = servers.value.map(server => {
        if (server.id === serverId) {
          return createOnlineServerData(serverId, server, data.data);
        }
        return server;
      });
      initCharts();
    }
  } catch (error) {
    console.error('获取服务器实时状态失败:', error);
  }
}

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

function setChartRef(el, serverId) {
  if (el) {
    chartRefs.value[serverId] = el
  }
}

async function onServerClick() {
  try {
    await handleServerClick((updatedServers) => {
      servers.value = updatedServers
      initCharts()
    })
  } catch (error) {
    console.error('处理服务器点击事件失败:', error)
  }
}

function initCharts() {
  servers.value.forEach(server => {
    const chartEl = chartRefs.value[server.id]
    if (chartEl) {
      let chart = charts.value[server.id]
      if (!chart) {
        chart = echarts.init(chartEl)
        charts.value[server.id] = chart
      }
      updateServerChart(chart, server)
    }
  })
}

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

function handleResize() {
  Object.values(charts.value).forEach(chart => {
    if (chart) {
      chart.resize()
    }
  })
}

async function fetchServersData() {
  try {
    const serversResponse = await fetch(`${API_BASE}/stats/servers`);
    
    if (!serversResponse.ok) {
      throw new Error('获取服务器列表失败');
    }
    
    const serversData = await serversResponse.json();
    
    if (serversData.success && serversData.data && serversData.data.length > 0) {
      servers.value = formatServersList(serversData.data);
      nextTick(() => {
        initCharts();
      })
    }
  } catch (error) {
    console.error('获取服务器数据失败:', error);
  }
}

// 视差滚动
const parallaxScroll = () => {
  const scrollTop = window.scrollY
  const bg = document.querySelector('.bgIMG')
  
  // 慢速移动：scrollY * 0.3
  bg.style.transform = `translateY(${scrollTop * -0.3}px)`
}

onMounted(async () => {
  await fetchServersData();
  await fetchOverviewStats();
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', parallaxScroll);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', parallaxScroll)
  Object.values(charts.value).forEach(chart => {
    if (chart) {
      chart.dispose()
    }
  })
})
</script>

<style scoped> 
  @import '../styles/bgIMG.css';

  .bgIMG {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/5.png') center/cover no-repeat;
  }
</style>

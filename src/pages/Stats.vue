<template>
  <div class="bg-content">
    <div class="bg-image"></div>
    <SakuraPetals />
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
import SakuraPetals from '../components/SakuraPetals.vue'
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
  const bg = document.querySelector('.bg-image')
  
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
  .bg-image {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/5.png') center/cover no-repeat;
  }

  .stats-container {
    align-self: center;
    width: min(80%, 900px);
    margin: 0;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    z-index: 1;
  }

  .stats-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    gap: 20px;
  }

  .server-image {
    width: 60px;
    border-radius: var(--radius-md);
    /* object-fit: cover; */
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  }

  .stats-title {
    width: auto;
    margin: 0;
    color: var(--color-text);
    font-size: 36px;
    font-weight: 600;
  }

  .overview-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
  }

  .overview-label,
  .overview-value {
    color: gray;
  }

  .servers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  }

  .server-card {
    background: var(--color-bg-white);
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-md);
    transition: all 0.3s ease;
    border: 1px solid var(--color-border);
  }

  .server-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .server-card-content {
    display: flex;
    /* justify-content: flex-start; */
    gap: 24px;
    align-items: center;
    position: relative;
  }

  .server-thumbnail {
    flex-shrink: 0;
    width: 130px;
    height: 130px;
    /* margin-top: 5px; */
    margin-left: 10px;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .server-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .server-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* margin-bottom: 8px; */
    flex-wrap: wrap;
    /* gap: 10px; */
  }

  .server-title {
    width: auto;
    margin: 0;
    padding: 0;
    /* margin-left: -16px; */
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    color: var(--color-text);
    min-width: 150px;
  }

  .server-status {
    padding: 0px 12px;
    border-radius: var(--radius-md);
    font-size: 12px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .server-status.online {
    background-color: var(--color-online-bg);
    color: var(--color-online-text);
    border: 1px solid var(--color-online-border);
  }

  .server-status.offline {
    background-color: var(--color-offline-bg);
    color: var(--color-offline-text);
    border: 1px solid var(--color-offline-border);
  }

  .server-info {
    display: flex;
    flex-direction: column;
    gap: 0px;
    /* margin-bottom: 12px; */
  }

  .server-info-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .server-info-label {
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  .server-info-value {
    color: var(--color-text);
    font-weight: 600;
  }

  .server-chart .chart-container {
    width: 100%;
    height: 100%;
  }

  .server-chart {
    flex: 1;
    min-width: 200px;
    height: 150px;
  }

  .chart-section {
    background: var(--color-bg-white);
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }

  .chart-title {
    margin: 0 0 20px 0;
    color: var(--color-text);
    font-size: 18px;
    font-weight: 600;
  }

  .chart-container {
    height: 400px;
    width: 100%;
  }

  .reload-button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    box-shadow: var(--shadow-sm);
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    top: 5px;
    right: 5px;
  }

  .reload-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.6s ease;
  }

  .reload-icon.rotate {
    animation: rotate720 1s ease-in-out;
  }

  @keyframes rotate720 {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(720deg);
    }
  }

  @media (max-width: 768px) {
    .stats-container {
      padding: 10px;
    }

    .stats-header {
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

    .server-image {
      width: 50px;
      height: 50px;
    }

    .servers-grid {
      grid-template-columns: 1fr;
    }

    .server-thumbnail {
      width: 100px;
      height: 100px;
    }

    .server-chart {
      display: none;
      width: 100%;
      height: 200px;
    }

    .chart-container {
      height: 300px;
    }

    .reload-button {
      top: -30px;
      right: -35px;
    }
  }

  @media (max-width: 480px) {
    .server-thumbnail {
      display: none;
    }

    .server-card-content {
      flex-direction: row;
      align-items: center;
    }
  }
</style>

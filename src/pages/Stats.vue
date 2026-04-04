<template>
  <div class="stats-container">
    <div class="stats-header">
      <img 
        src="../assets/serv2.png" 
        alt="服务器图标" 
        class="server-image"
        @click="handleServerClick()"
      />
      <h1 class="stats-title">服务器统计</h1>
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
                <span class="server-info-value">{{ server.players }}/64</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import '../styles/stat.css'

const chartRefs = ref({})
const charts = ref({})

const servers = [
  {
    id: 1,
    title: '[主服]生存世界',
    status: true,
    players: 45,
    version: '1.20.4',
    type: '生存',
    address: 'mc.example.com:25565',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Minecraft%20survival%20server%20landscape%20with%20trees%20and%20mountains&image_size=portrait_4_3',
    monthlyHeat: [35, 42, 48, 52, 45, 50, 48, 55, 60, 58, 62, 65]
  },
  {
    id: 2,
    title: '[主服]创造世界',
    status: true,
    players: 23,
    version: '1.20.4',
    type: '创造',
    address: 'mc.example.com:25566',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Minecraft%20creative%20server%20with%20modern%20buildings&image_size=portrait_4_3',
    monthlyHeat: [20, 25, 30, 28, 32, 26, 29, 35, 33, 30, 28, 31]
  },
  {
    id: 3,
    title: '[测试服]快照版',
    status: false,
    players: 0,
    version: '1.21.0',
    type: '生存',
    address: 'test.example.com:25565',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Minecraft%20snapshot%20server%20with%20experimental%20features&image_size=portrait_4_3',
    monthlyHeat: [5, 8, 12, 10, 6, 4, 2, 0, 0, 0, 0, 0]
  },
  {
    id: 4,
    title: '[小游戏]空岛战争',
    status: true,
    players: 32,
    version: '1.19.4',
    type: '小游戏',
    address: 'minigame.example.com:25565',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Minecraft%20skywars%20minigame%20with%20islands&image_size=portrait_4_3',
    monthlyHeat: [28, 35, 40, 45, 42, 38, 40, 48, 52, 48, 50, 55]
  },
  {
    id: 5,
    title: '[生存]硬核模式',
    status: true,
    players: 18,
    version: '1.20.4',
    type: '生存',
    address: 'hardcore.example.com:25565',
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Minecraft%20hardcore%20survival%20server%20difficult%20terrain&image_size=portrait_4_3',
    monthlyHeat: [15, 18, 20, 22, 19, 21, 18, 24, 26, 23, 25, 28]
  }
]

const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function setChartRef(el, serverId) {
  if (el) {
    chartRefs.value[serverId] = el
  }
}

// debug：点击图标触发查询
function handleServerClick(serverId = 1) {
  const getRebuildStats = async() => {
    try {
      // 后端 API 地址
      // const response = await fetch(`http://localhost:3000/api/stats/servers/${serverId}/realtime`);
      const response = await fetch(`http://localhost:3000/api/stats/servers`);
      
      if (!response.ok) {
        throw new Error('请求失败');
      }
      
      const data = await response.json();
      console.log('服务器查询结果:', data);
      
      // 可以在这里更新前端显示的数据
      if (data.success) {
        console.log('服务器状态:', data.data);
        const rebuildServerData = await fetch(`http://localhost:3000/api/stats/servers/${data.data[serverId - 1]._id}/realtime`);
        console.log('重建服务器状态:', await rebuildServerData.json());
        
        // 更新对应服务器的状态
      }
    } catch (error) {
      console.error('获取服务器状态失败:', error);
    }
  }
  getRebuildStats();
}

// 初始化图表
onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  Object.values(charts.value).forEach(chart => {
    if (chart) {
      chart.dispose()
    }
  })
})

function initCharts() {
  servers.forEach(server => {
    const chartEl = chartRefs.value[server.id]
    if (chartEl) {
      const chart = echarts.init(chartEl)
      charts.value[server.id] = chart
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
      data: months,
      axisLabel: {
        fontSize: 10,
        interval: 2
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 70,
      interval: 20,
      axisLabel: {
        fontSize: 10
      }
    },
    series: [
      {
        name: '热度',
        type: 'line',
        data: server.monthlyHeat,
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
</script>
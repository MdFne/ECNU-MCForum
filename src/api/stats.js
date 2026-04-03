// src/api/stats.js
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

// 获取所有服务器列表
export const getServers = () => {
    return axios.get(`${API_BASE}/stats/servers`)
}

// 获取服务器实时状态
export const getServerRealTimeStats = (serverId) => {
    return axios.get(`${API_BASE}/stats/servers/${serverId}/realtime`)
}

// 获取服务器历史数据
export const getServerHistoryStats = (serverId, days = 30) => {
    return axios.get(`${API_BASE}/stats/servers/${serverId}/history?days=${days}`)
}

// 获取服务器月度热度
export const getServerMonthlyHeat = (serverId, months = 12) => {
    return axios.get(`${API_BASE}/stats/servers/${serverId}/monthly-heat?months=${months}`)
}

// 获取整体统计概览
export const getOverviewStats = () => {
    return axios.get(`${API_BASE}/stats/overview`)
}
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

/**
 * 获取所有活动预告，按开始时间正序排列
 * @returns {Promise}
 */
export const getAllActivityTrailers = () => {
    return axios.get(`${API_BASE}/activity-trailers`)
}

/**
 * 全量更新活动预告
 * @param {Array} trailers 
 * @returns {Promise}
 */
export const updateAllActivityTrailers = (trailers) => {
    return axios.put(`${API_BASE}/activity-trailers`, trailers)
}

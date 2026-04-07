// src/api/carousel.js
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

/**
 * 获取所有激活的轮播图
 * @returns {Promise}
 */
export const getActiveCarousels = () => {
    return axios.get(`${API_BASE}/carousel`, {
        params: {
            isActive: true,
            sortBy: 'order',
            sortOrder: 'asc'
        }
    })
}

/**
 * 获取单个轮播图详情
 * @param {string} id 
 * @returns {Promise}
 */
export const getCarouselById = (id) => {
    return axios.get(`${API_BASE}/carousel/${id}`)
}

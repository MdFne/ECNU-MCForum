// src/api/postcard.js
import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

/**
 * 获取文章列表
 * @param {Object} params 查询参数 (page, limit, search, tag, isActive, sortBy, sortOrder)
 * @returns {Promise}
 */
export const getPostcards = (params = {}) => {
    return axios.get(`${API_BASE}/postcard`, {
        params: {
            isActive: true,
            sortBy: 'publishDate',
            sortOrder: 'desc',
            ...params
        }
    })
}

/**
 * 获取文章详情
 * @param {string} id 
 * @returns {Promise}
 */
export const getPostcardById = (id) => {
    return axios.get(`${API_BASE}/postcard/${id}`)
}

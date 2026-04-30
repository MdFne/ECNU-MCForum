import request from './rerquest'

/**
 * 获取某文章的评论列表
 * @param {string} postcardId 文章ID
 * @param {Object} params 查询参数 (page, limit, sortBy, sortOrder)
 * @returns {Promise}
 */
export const getComments = (postcardId, params = {}) => {
  return request.get(`/postcard/${postcardId}/comments`, { params })
}

/**
 * 发表评论
 * @param {string} postcardId 文章ID
 * @param {Object} data { content, replyTo }
 * @returns {Promise}
 */
export const createComment = (postcardId, data) => {
  return request.post(`/postcard/${postcardId}/comments`, data)
}

/**
 * 删除评论
 * @param {string} commentId 评论ID
 * @returns {Promise}
 */
export const deleteComment = (commentId) => {
  return request.delete(`/comment/${commentId}`)
}

// 缓存数据（12 分钟刷新一次 = 1小时5次）
let cachedData = null
let lastFetchTime = 0
const CACHE_TIME = 12 * 60 * 1000 // 12 分钟

export default defineEventHandler(async () => {
    const now = Date.now()

    // 如果缓存没过期，直接返回缓存
    if (cachedData && now - lastFetchTime < CACHE_TIME) {
        return cachedData
    }

    try {
        // 👉 这里替换成你的 MC 服务器 IP + 端口
        const MC_IP = "你的MC服务器IP"
        const MC_PORT = "你的MC服务器端口"

        // 请求 MC 服务器状态
        const res = await fetch(`https://www.minecraftservers.cn/api/query?ip=rebuildputuo.ecnumc.cn`)

        const data = await res.json()

        // 更新缓存
        cachedData = data
        lastFetchTime = now

        return data
    } catch (err) {
        return { error: "查询失败", msg: err }
    }
})
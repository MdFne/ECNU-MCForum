// utils/serverUtils.js

/**
 * 处理服务器点击事件，获取服务器数据并更新
 * @param {Function} updateServers 用于更新前端servers列表的函数
 */
export async function handleServerClick(updateServers) {
  try {
    // 1. 请求/stats/servers接口获取所有服务器的数据
    const serversResponse = await fetch('http://localhost:3000/api/stats/servers');

    if (!serversResponse.ok) {
      throw new Error('获取服务器列表失败');
    }

    const serversData = await serversResponse.json();

    if (serversData.success && serversData.data && serversData.data.length > 0) {
      const servers = serversData.data;
      const updatedServers = [];

      // 2. 遍历响应数据，依照每个服务器的ip通过Minecraft服务器API查询数据
      for (const server of servers) {
        try {
          // 提取ip地址（去除端口号）
          const ip = server.address.split(':')[0];
          const apiResponse = await fetch(`/api/minecraft?ip=${ip}`);

          if (apiResponse.ok) {
            const apiData = await apiResponse.json();

            if (apiData.success && apiData.data) {
              // 3. 更新数据库
              await updateServerInDatabase(server._id, apiData.data);

              // 4. 构建更新后的服务器数据
              // 更新last10dayHeat数据
              let updatedLast10dayHeat = [...(server.last10dayHeat || Array(10).fill(0))];
              // 移除最左边的元素，添加新的today_max值到最右边
              updatedLast10dayHeat.shift();
              updatedLast10dayHeat.push(apiData.data.today_max);

              const updatedServer = {
                id: server._id,
                title: server.title,
                status: true,
                players: apiData.data.p,
                maxPlayers: apiData.data.mp,
                version: server.version,
                type: server.type,
                address: server.address,
                thumbnail: apiData.data.logo || server.thumbnail,
                monthlyHeat: server.monthlyHeat,
                last10dayHeat: updatedLast10dayHeat,
                last_updated_str: apiData.data.last_updated_str,
                motd: apiData.data.motd,
                ping: apiData.data.ping,
                today_max: apiData.data.today_max,
                today_min: apiData.data.today_min,
                today_avg: apiData.data.today_avg,
                history_max: apiData.data.history_max,
                total_queries: apiData.data.total_queries,
                last_updated: apiData.data.last_updated,
                created_at: apiData.data.created_at,
                created_at_str: apiData.data.created_at_str
              };

              updatedServers.push(updatedServer);
            }
          }
        } catch (error) {
          console.error(`获取服务器 ${server.title} 数据失败:`, error);
          // 如果获取失败，保留原有数据
          updatedServers.push({
            id: server._id,
            title: server.title,
            status: false,
            players: 0,
            maxPlayers: server.maxPlayers,
            version: server.version,
            type: server.type,
            address: server.address,
            thumbnail: server.thumbnail,
            monthlyHeat: server.monthlyHeat
          });
        }
      }

      // 5. 更新前端servers列表
      if (updateServers) {
        updateServers(updatedServers);
      }

      return updatedServers;
    }
  } catch (error) {
    console.error('处理服务器点击事件失败:', error);
    throw error;
  }
}

/**
 * 根据响应数据更新MongoDB数据库的servers数据
 * @param {string} serverId 服务器ID
 * @param {Object} apiData API响应数据
 */
async function updateServerInDatabase(serverId, apiData) {
  try {
    // 先获取服务器当前数据，以获取last10dayHeat字段
    const serverResponse = await fetch(`http://localhost:3000/api/stats/servers`);
    const serverData = await serverResponse.json();
    const server = serverData.data.find(s => s._id === serverId);

    // 更新last10dayHeat数据
    let updatedLast10dayHeat = [...(server?.last10dayHeat || Array(10).fill(0))];
    // 移除最左边的元素，添加新的today_max值到最右边
    updatedLast10dayHeat.shift();
    updatedLast10dayHeat.push(apiData.today_max);

    const updateData = {
      currentPlayers: apiData.p,
      maxPlayers: apiData.mp,
      last_updated_str: apiData.last_updated_str,
      last_updated: apiData.last_updated,
      motd: apiData.motd,
      ping: apiData.ping,
      today_max: apiData.today_max,
      today_min: apiData.today_min,
      today_avg: apiData.today_avg,
      history_max: apiData.history_max,
      total_queries: apiData.total_queries,
      created_at: apiData.created_at,
      created_at_str: apiData.created_at_str,
      last10dayHeat: updatedLast10dayHeat,
      updatedAt: new Date()
    };

    // 如果有logo，也更新
    if (apiData.logo) {
      updateData.thumbnail = apiData.logo;
    }

    // 发送PUT请求更新数据库
    const response = await fetch(`http://localhost:3000/api/stats/servers/${serverId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      throw new Error('更新数据库失败');
    }

    const result = await response.json();
    console.log('数据库更新结果:', result);
  } catch (error) {
    console.error('更新服务器数据库失败:', error);
    throw error;
  }
}

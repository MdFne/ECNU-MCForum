import { formatServersList } from './serverFormatter';

const API_BASE = 'http://localhost:3000/api';

export async function handleServerClick(updateServers) {
  try {
    const response = await fetch(`${API_BASE}/stats/servers/refresh-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('刷新服务器状态失败');
    }

    const result = await response.json();

    if (result.success) {
      const serversResponse = await fetch(`${API_BASE}/stats/servers`);

      if (!serversResponse.ok) {
        throw new Error('获取服务器列表失败');
      }

      const serversData = await serversResponse.json();

      if (serversData.success && serversData.data) {
        const formattedServers = formatServersList(serversData.data);

        console.log('格式化后的服务器列表:', formattedServers);

        if (updateServers) {
          updateServers(formattedServers);
        }

        return formattedServers;
      }
    }

    return [];
  } catch (error) {
    console.error('处理服务器点击事件失败:', error);
    throw error;
  }
}

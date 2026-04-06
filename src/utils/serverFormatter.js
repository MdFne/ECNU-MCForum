export function formatServerData(server) {
    return {
        id: server._id,
        name: server.name,
        title: server.title,
        status: server.isActive,
        players: server.currentPlayers === -1 ? NaN : server.currentPlayers,
        maxPlayers: server.maxPlayers === -1 ? NaN : server.maxPlayers,
        version: server.version,
        type: server.type,
        address: server.address,
        port: server.port,
        thumbnail: server.thumbnail,
        monthlyHeat: server.monthlyHeat || Array(12).fill(0),
        last10dayHeat: server.last10dayHeat || Array(10).fill(0),
        last_updated_str: server.last_updated_str,
        motd: server.motd,
        ping: server.ping,
        today_max: server.today_max,
        today_min: server.today_min,
        today_avg: server.today_avg,
        history_max: server.history_max,
        total_queries: server.total_queries,
        last_updated: server.last_updated,
        created_at: server.created_at,
        created_at_str: server.created_at_str
    };
}

export function formatServersList(servers) {
    return servers.map(formatServerData);
}

export function createOfflineServerData(serverId, currentServer) {
    return {
        ...currentServer,
        id: serverId,
        players: NaN,
        maxPlayers: NaN,
        status: false
    };
}

export function createOnlineServerData(serverId, currentServer, realtimeData) {
    return {
        ...currentServer,
        id: serverId,
        players: realtimeData.currentPlayers === -1 ? NaN : realtimeData.currentPlayers,
        maxPlayers: realtimeData.maxPlayers === -1 ? NaN : realtimeData.maxPlayers,
        status: realtimeData.onlineStatus
    };
}

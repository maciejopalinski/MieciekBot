const fetch = require('node-fetch');

const BOT_TOKEN = process.env.DASHBOARD_API_CLIENT_TOKEN || process.env.BOT_TOKEN;

async function getBotGuilds() {
    const response = await fetch('http://discord.com/api/v6/users/@me/guilds', {
        method: 'GET',
        headers: {
            Authorization: `Bot ${BOT_TOKEN}`
        }
    });
    return response.json();
}

function getMutualGuilds(botGuilds, userGuilds) {
    return userGuilds.filter(userGuild => {
        let isMutual = botGuilds.some(g => g.id == userGuild.id);
        let hasPermissions = (userGuild.permissions & 0x00000020) === 0x00000020;

        return isMutual && hasPermissions;
    });
}

module.exports = {
    getBotGuilds,
    getMutualGuilds
}
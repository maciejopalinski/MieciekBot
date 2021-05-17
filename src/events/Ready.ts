import { PresenceData } from 'discord.js';
import { Client } from '../lib';

export const onReady = async (client: Client) => {
    
    console.info(`Logged in as: ${client.user.tag}`);
    console.info(`Running...`);

    let base_presence: PresenceData = {
        status: 'online',
        activity: { url: 'https://github.com/PoProstuMieciek/' }
    };

    let status: PresenceData[] = [
        {
            ...base_presence,
            activity: { type: 'LISTENING', name: 'Dream Theater' }
        },
        {
            ...base_presence,
            activity: { type: 'LISTENING', name: 'Gojira' }
        },
        {
            ...base_presence,
            activity: { type: 'PLAYING', name: 'Visual Studio Code' }
        },
        {
            ...base_presence,
            activity: {
                type: 'PLAYING',
                name: `on ${client.guilds.cache.size} ${client.guilds.cache.size > 1 ? 'servers' : 'server'}`
            }
        }
    ];

    setInterval(function () {
        let index = Math.floor(Math.random() * status.length);
        client.user.setPresence(status[index]);
    }, 5000);

    await client.db_manager.databaseCleanup(client);
}

export default (client: Client) => {
    client.on('ready', async () => onReady(client));
}
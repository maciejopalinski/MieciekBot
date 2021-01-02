import { PresenceData } from 'discord.js';
import { Client } from '../lib';

export const onReady = async (client: Client) => {
    
    console.info(`Logged in as: ${client.user.tag}`);
    console.info(`Running...`);

    let status: PresenceData[] = [
        {
            status: 'online',
            activity: {
                type: 'LISTENING',
                name: 'Megadeth',
                url: 'https://github.com/PoProstuMieciek/'
            }
        },
        {
            status: 'online',
            activity: {
                type: 'LISTENING',
                name: 'Slipknot',
                url: 'https://github.com/PoProstuMieciek/'
            }
        },
        {
            status: 'online',
            activity: {
                type: 'PLAYING',
                name: 'Visual Studio Code',
                url: 'https://github.com/PoProstuMieciek/'
            }
        },
        {
            status: 'online',
            activity: {
                type: 'PLAYING',
                name: `on ${client.guilds.cache.size} ${client.guilds.cache.size > 1 ? 'servers' : 'server'}`,
                url: 'https://github.com/PoProstuMieciek/'
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
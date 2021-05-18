import { Client } from './lib';

export const client = new Client({ ws: {
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_EMOJIS',
        'GUILD_VOICE_STATES'
    ]
}});

client.token = process.env.BOT_TOKEN;
client.db_uri = process.env.DATABASE;

client.init();
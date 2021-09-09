import { Intents } from 'discord.js';
import { Client } from './lib';

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.token = process.env.DISCORD_TOKEN;
client.db_uri = process.env.DATABASE;

client.init();
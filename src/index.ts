import { Client } from './lib';

export const client = new Client();

client.token = process.env.BOT_TOKEN;
client.db_uri = process.env.DATABASE;

client.init();
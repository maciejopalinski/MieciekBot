import { Client } from './lib';

export const client = new Client(process.env.BOT_TOKEN, process.env.DATABASE);
client.init();
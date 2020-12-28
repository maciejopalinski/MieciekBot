import { Client } from './lib';

export const bot = new Client(process.env.BOT_TOKEN, process.env.DATABASE);
bot.init();
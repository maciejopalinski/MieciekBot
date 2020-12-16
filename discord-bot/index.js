const Client = require('./lib/client/Client');

const bot = new Client(process.env.BOT_TOKEN, process.env.DATABASE);
module.exports = { bot: bot };
bot.init();
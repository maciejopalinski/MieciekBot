const MieciekBot = require('./lib/mieciekbot.js');

const bot = new MieciekBot.Client(process.env.BOT_TOKEN, process.env.DATABASE);
module.exports = { bot: bot };
bot.init();
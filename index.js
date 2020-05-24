const Discord = require("discord.js");
const Logging = require("./util/logging.js");
const Loader = require("./util/loader.js");

const bot = new Discord.Client();
module.exports = { bot: bot };

bot.prefix = "!";
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.queue = new Map();
bot.categories = [];
bot.spam_channels = [];
bot.game = { hangman: new Map() };

Loader.init();
Loader.events(bot);
Loader.commands(bot);

bot.login(process.env.BOT_TOKEN);
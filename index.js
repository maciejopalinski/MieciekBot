const Discord = require("discord.js");
const Logging = require("./util/logging.js");
const Loader = require("./util/loader.js");

const bot = new Discord.Client();

bot.prefix = "!";
bot.categories = [];
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.spam_channels = [];
bot.queue = new Map();
bot.game = { hangman: new Map() };

module.exports = { bot: bot };

Loader.init();
Loader.events(bot);
Loader.commands(bot);

bot.login(process.env.BOT_TOKEN);
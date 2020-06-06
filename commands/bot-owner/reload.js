const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    Object.keys(require.cache).forEach(value => {
        if(!value.includes("node_modules"))
        {
            if(value.includes("commands"))
            {
                bot.commands.delete(require.cache[value].exports.help.name);
                delete require.cache[value];
                const props = require(value);
                bot.commands.set(props.help.name, props);
            }
        }
    });
}

module.exports.help = {
    name: "reload",
    aliases: [],
    args: [],
    permission: "BOT_OWNER",
    description: "reloads all commands"
}
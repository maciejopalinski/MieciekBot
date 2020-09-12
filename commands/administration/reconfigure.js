const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {    
    if(args[0] == `confirm${msg.guild.id}`)
    {
        await msg.channel.send(`Reseting...`).then(msg => msg.delete({ timeout: bot.delete_timeout }));

        bot.emit("guildDelete", msg.guild);
        bot.emit("guildCreate", msg.guild);
    }
    else
    {
        msg.channel.send(`Are you sure you want to reset all bot properties in database?\nYou will loose all settings, xp values and warns.\nIf you want to proceed, run following command:\`\`\`${bot.prefix}reconfigure confirm${msg.guild.id}\`\`\``);
    }
}

module.exports.help = {
    name: "reconfigure",
    aliases: [],
    args: [],
    permission: "OWNER",
    description: "reconfigures all bot properties in database"
}
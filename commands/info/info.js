const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if(args[0] == "server")
    {
        let message = new Discord.MessageEmbed()
        .setTitle(`INFO: ${msg.guild.name}`)
        .setThumbnail(msg.guild.iconURL({ size: 64 }))
        .addField(`Owner:`, `${msg.guild.owner.user.tag}`)
        .addField(`Created at:`, `${msg.guild.owner.joinedAt.toDateString()}`)
        .addField(`Members:`, `${msg.guild.memberCount}`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.channel.send(message);
    }
    else if(args[0] == "bot")
    {
        let message = new Discord.MessageEmbed()
        .setTitle(`INFO: MieciekBot`)
        .setThumbnail(bot.settings.iconURL)
        .addField(`Author:`, `PoProstuMieciek#6099`)
        .addField(`Version:`, `${bot.settings.version}`)
        .addField(`GitHub repository:`, `${bot.settings.repository}`)
        .addField(`Invite me to your server:`, `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.channel.send(message);
    }
    else
    {
        msg.delete({ timeout: bot.delete_timeout });
    }
}

module.exports.help = {
    name: "info",
    aliases: [
        "i",
        "informations"
    ],
    args: [
        "<server/bot>"
    ],
    permission: "USER",
    description: "prints info about server or bot"
}
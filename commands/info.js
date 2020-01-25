const Discord = require("discord.js");
const package = require("../package.json");

module.exports.run = async (bot, msg, args) => {
    if(args[0] == "server")
    {
        let message = new Discord.RichEmbed()
        .setTitle(`INFO: ${msg.guild.name}`)
        .setThumbnail(`${msg.guild.iconURL}`)
        .addField(`Owner:`, `${msg.guild.owner.user.tag}`)
        .addField(`Created at:`, `${msg.guild.owner.joinedAt.toDateString()}`)
        .addField(`Members:`, `${msg.guild.memberCount}`)

        msg.channel.send(message);
    }
    else if(args[0] == "bot")
    {
        let message = new Discord.RichEmbed()
        .setTitle(`INFO: MieciekBot`)
        .setThumbnail(`https://cdn.discordapp.com/avatars/510925936393322497/15784b2d9cf8df572617b493bc79c707.png?size=4096`)
        .addField(`Author:`, `PoProstuMieciek`)
        .addField(`Version:`, `${package.version}`)
        .addField(`GitHub repository:`, `${package.repository.url}`);

        msg.channel.send(message);
    }
    else
    {
        msg.delete(bot.delete_timeout);
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

module.exports.error = {}
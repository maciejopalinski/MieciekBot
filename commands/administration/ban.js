const Discord = require('discord.js');

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(" ") || "no reason specified";

    if(user)
    {
        if(!user.bannable || user.id == msg.author.id)
        {
            msg.delete(bot.delete_timeout);
            return msg.channel.send(this.error.not_bannable).then(msg => msg.delete(bot.delete_timeout));
        }

        let ban_embed = new Discord.RichEmbed()
        .setTitle(`You have been banned on ${msg.guild.name}!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Banned by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
        
        let info_ban = new Discord.RichEmbed()
        .setTitle(`${user.displayName} has been banned!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Banned by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.delete();
        
        await user.send(ban_embed);
        msg.channel.send(info_ban);
        
        user.ban(reason);
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.user_not_found).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help ={
    name: "ban",
    aliases: [],
    args: [
        "<@user>",
        "[reason]"
    ],
    permission: "ADMIN",
    description: "bans <@user>"
}

module.exports.error = {
    "user_not_found": "User was not found on the server. Please, try again.",
    "not_bannable": "I cannot ban that user."
}
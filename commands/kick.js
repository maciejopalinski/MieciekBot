const Discord = require('discord.js');

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(" ") || "no reason specified";

    if(user)
    {
        if(!user.kickable || user.id == msg.author.id)
        {
            msg.delete(bot.delete_timeout);
            return msg.channel.send(this.error.not_kickable).then(msg => msg.delete(bot.delete_timeout));
        }

        let kick_embed = new Discord.RichEmbed()
        .setTitle(`You have been kicked from ${msg.guild.name}!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Kicked by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
        
        let info_kick = new Discord.RichEmbed()
        .setTitle(`${user.displayName} has been kicked from server!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Kicked by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.delete();
        
        await user.send(kick_embed);
        msg.channel.send(info_kick);
        
        user.kick(reason);
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.user_not_found).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help ={
    name: "kick",
    aliases: [],
    args: [
        "<@user>",
        "[reason]"
    ],
    permission: "ADMIN",
    description: "kicks <@user> from server"
}

module.exports.error = {
    "user_not_found": "User was not found on the server. Please, try again.",
    "not_kickable": "I cannot kick that user."
}
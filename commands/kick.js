const Discord = require('discord.js');

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(user)
    {
        let reason = args.slice(1).join(" ") || "no reason specified";
        
        let kick_embed = new Discord.RichEmbed()
        .setTitle(`You have been kicked from ${msg.guild.name}!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Kicked by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.package_info.version}`, bot.settings.iconURL);
        
        let info_kick = new Discord.RichEmbed()
        .setTitle(`${user.displayName} has been kicked from server!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Kicked by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.package_info.version}`, bot.settings.iconURL);

        user.kick(reason)
        .then(async () => {
            msg.delete();
            await user.send(kick_embed);
            msg.channel.send(info_kick);
        })
        .catch(err => {
            return msg.channel.send(`Error occurred: ${err.message}!`);
        });
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
    "user_not_found": "User was not found on the server. Please, try again."
}
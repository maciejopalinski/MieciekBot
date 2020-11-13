const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(' ') || 'no reason specified';

    if(user)
    {
        if(!user.bannable || user.id == msg.author.id)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.not_bannable);
        }

        let ban_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`You have been banned on ${msg.guild.name}!`)
        .addField('Banned by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);
        
        let info_ban = new MessageEmbed(bot, msg.guild)
        .setTitle(`${user.user.username} has been banned!`)
        .addField('Banned by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);

        msg.delete();
        await user.send(ban_embed);
        await msg.channel.send(info_ban);
        user.ban(reason);
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, this.error.user_not_found);
    }
}

module.exports.help = {
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
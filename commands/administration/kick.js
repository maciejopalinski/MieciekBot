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
        if(!user.kickable || user.id == msg.author.id)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.not_kickable);
        }

        let kick_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`You have been kicked from ${msg.guild.name}!`)
        .addField('Kicked by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);
        
        let info_kick = new MessageEmbed(bot, msg.guild)
        .setTitle(`${user.user.username} has been kicked from server!`)
        .addField('Kicked by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);

        msg.delete();
        
        await user.send(kick_embed);
        await msg.channel.send(info_kick);
        user.kick(reason);
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, this.error.user_not_found);
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
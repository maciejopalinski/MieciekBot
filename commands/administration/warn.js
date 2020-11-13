const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(' ');

    if(user)
    {
        if(user.id == msg.author.id || user.user.bot)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.not_warnable);
        }

        let warn_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`You have been warned on ${msg.guild.name}!`)
        .addField('Warned by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);
        
        let info_warn = new MessageEmbed(bot, msg.guild)
        .setTitle(`${user.user.username} has been warned!`)
        .addField('Warned by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);

        let date = new Date();
        let date_string = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

        const newWarn = new bot.db_manager.Warn({
            serverID: msg.guild.id,
            userID: user.id,
            warnedBy: msg.author.id,
            reason: reason,
            timestamp: date_string
        });
        newWarn.save().catch(err => {
            console.error(err)
            bot.sendAndDelete(msg.channel, this.error.unknown);
        });

        msg.delete();
        await user.send(warn_embed);
        msg.channel.send(info_warn);
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, this.error.user_not_found);
    }
}

module.exports.help = {
    name: "warn",
    aliases: [],
    args: [
        "<@user>",
        "<reason>"
    ],
    permission: "ADMIN",
    description: "warns <@user> with <reason>"
}

module.exports.error = {
    "user_not_found": "User was not found on the server. Please, try again.",
    "not_warnable": "I cannot warn that user.",
    "unknown": "Unknown error occurred. Please, try again later."
}
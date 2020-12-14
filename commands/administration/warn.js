const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');

const Warn = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Warn.execute = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(' ');

    if(user)
    {
        if(user.id == msg.author.id || user.user.bot)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.not_warnable);
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

        const newWarn = new bot.db_manager.models.Warn({
            serverID: msg.guild.id,
            userID: user.id,
            warnedBy: msg.author.id,
            reason: reason,
            timestamp: date_string
        });
        newWarn.save().catch(err => {
            console.error(err)
            bot.sendAndDelete(msg.channel, error.unknown);
        });

        msg.delete();
        await user.send(warn_embed);
        msg.channel.send(info_warn);
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.user_not_found);
    }
}

Warn.setHelp({
    name: 'warn',
    args: '<@user> <reason>',
    aliases: [],
    description: 'warns <@user> with <reason>',
    permission: 'ADMIN'
});

const error = Warn.error = {
    user_not_found: "User was not found on the server. Please, try again.",
    not_warnable: "I cannot warn that user.",
    unknown: "Unknown error occurred. Please, try again later."
};

module.exports = Warn;
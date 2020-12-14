const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');

const Report = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Report.execute = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(' ');

    if(user)
    {
        let report_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`REPORT: ${user.user.username}`)
        .addField('Reported user:', `<@${user.id}>`)
        .addField('Reported by:', `<@${msg.author.id}>`)
        .addField('Reason:', reason);

        msg.delete();
        msg.channel.send(report_embed);
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.no_arg);
    }
}

Report.setHelp({
    name: 'report',
    args: '<@user> <reason>',
    aliases: [],
    description: 'reports user with a reason',
    permission: 'USER'
});

const error = Report.error = {
    no_arg: "No user or reason specified!"
};

module.exports = Report;
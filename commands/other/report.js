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
        bot.sendAndDelete(msg.channel, this.error.no_arg);
    }
}

module.exports.help = {
    name: "report",
    aliases: [],
    args: [
        "<@user>",
        "<reason>"
    ],
    permission: "USER",
    description: "reports user with a reason"
}

module.exports.error = {
    "no_arg": "No user or reason specified!"
}
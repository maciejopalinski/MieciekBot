const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(" ") || undefined;

    if(reason && user)
    {
        let report_embed = new Discord.RichEmbed()
        .setTitle(`REPORT: ${user.displayName}`)
        .addField(`Reported user:`, `${user.displayName}`)
        .addField(`Reported by:`, `${msg.author.username}`)
        .addField(`Reason:`, `${reason}`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.delete();
        msg.channel.send(report_embed);
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.no_arg).then(msg => msg.delete(bot.delete_timeout));
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
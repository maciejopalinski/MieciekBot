import * as Discord from 'discord.js';
import { Client, MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Report = new Command();

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

export default Report;
import { MessageEmbed, Command } from '../../lib';
import { Warn as DBWarn } from '../../models/';

const Warn = new Command();

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

        DBWarn.create({
            guildID: msg.guild.id,
            userID: user.id,
            warnedBy: msg.author.id,
            reason: reason,
            timestamp: date_string
        }).catch(err => {
            if(err) {
                console.error(err);
                bot.sendAndDelete(msg.channel, error.unknown);
            }
        });

        msg.delete();
        await user.send({ embeds: [warn_embed] });
        msg.channel.send({ embeds: [info_warn] });
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.user_not_found);
    }
}

Warn.help = {
    name: 'warn',
    args: '<@user> <reason>',
    aliases: [],
    description: 'warns <@user> with <reason>',
    permission: 'ADMIN'
};

const error = Warn.error = {
    user_not_found: "User was not found on the server. Please, try again.",
    not_warnable: "I cannot warn that user.",
    unknown: "Unknown error occurred. Please, try again later."
};

export default Warn;
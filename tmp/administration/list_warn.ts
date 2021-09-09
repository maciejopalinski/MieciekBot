import { MessageEmbed, Command } from '../../lib';

const ListWarn = new Command();

ListWarn.execute = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(user)
    {
        let warns_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`WARNS: ${user.user.username}`)
        .setDescription(`List of <@${user.user.id}> warnings:`);

        let warns = await bot.db_manager.getWarns(msg.guild.id, user.id);
        if(!warns)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.unknown);
        }

        warns.forEach(entry => {
            warns_embed.addField(`Reason: ${entry.reason}`, `Warned by: <@${entry.warnedBy}>\n${entry.timestamp}`);
        });

        if(warns.length < 1) warns_embed.addField('There are not any warnings for this user.', '\u200b');

        msg.channel.send({ embeds: [warns_embed] });
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.user_not_found);
    }
};

ListWarn.help = {
    name: 'list-warn',
    args: '<@user>',
    aliases: ['warnlist', 'listwarn', 'warns'],
    description: 'displays all <@user> warnings',
    permission: 'ADMIN'
};

const error = ListWarn.error = {
    user_not_found: "User was not found on the server. Please, try again.",
    unknown: "Unknown error occurred. Please, try again later."
};

export default ListWarn;
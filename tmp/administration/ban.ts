import { MessageEmbed, Command } from '../../lib';

const Ban = new Command({
    aliases: [],
    permission: 'ADMIN'
});

Ban.data
    .setName('ban')
    .setDescription('bans given user')
    .addUserOption(opt =>
        opt
            .setName('user')
            .setDescription('user to ban')
            .setRequired(true)
    )
    .addStringOption(opt =>
        opt
            .setName('reason')
            .setDescription('reason')
    );

Ban.executeFromMessage = async (bot, msg, args) => {

    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(' ') || 'no reason specified';

    if(user)
    {
        if(!user.bannable || user.id == msg.author.id)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.not_bannable);
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
        await user.send({ embeds: [ban_embed] });
        await msg.channel.send({ embeds: [info_ban] });
        user.ban({ reason });
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.user_not_found);
    }
};

Ban.help = {
    name: 'ban',
    args: '<@user> [reason]',
    aliases: [],
    description: 'bans <@user>',
    permission: 'ADMIN'
};

const error = {
    user_not_found: "User was not found on the server. Please, try again.",
    not_bannable: "I cannot ban that user."
};

export default Ban;
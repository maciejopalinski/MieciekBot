import { Command, MessageEmbed } from '../../lib';

const Info = new Command();

Info.execute = async (bot, msg, args) => {
    if(args[0] == 'server')
    {
        let message = new MessageEmbed(bot, msg.guild)
        .setTitle(`INFO: ${msg.guild.name}`)
        .addField('Owner:', `<@${msg.guild.ownerId}>`)
        .addField('Created at:', `${msg.guild.createdAt.toDateString()}`)
        .addField('Members:', `${msg.guild.memberCount}`);

        msg.channel.send({ embeds: [message] });
    }
    else if(args[0] == 'bot')
    {
        let message = new MessageEmbed(bot, undefined, false)
        .setTitle('INFO: MieciekBot')
        .setThumbnail(bot.user.avatarURL({ format: 'png', size: 4096 }))
        .addField('Author:', 'PoProstuMieciek#6099')
        .addField('Version:', bot.version)
        .addField('GitHub repository:', bot.project_info.repository.url)
        .addField('Invite me to your server:', `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8`);

        msg.channel.send({ embeds: [message] });
    }
    else bot.deleteMsg(msg);
}

Info.help = {
    name: 'info',
    args: '<server/bot>',
    aliases: ['i', 'informations'],
    description: 'prints info about server or bot',
    permission: 'USER'
};

export default Info;
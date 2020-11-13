const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if(args[0] == 'server')
    {
        let message = new MessageEmbed(bot, msg.guild)
        .setTitle(`INFO: ${msg.guild.name}`)
        .addField('Owner:', `${msg.guild.owner.user.tag}`)
        .addField('Created at:', `${msg.guild.owner.joinedAt.toDateString()}`)
        .addField('Members:', `${msg.guild.memberCount}`);

        msg.channel.send(message);
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

        msg.channel.send(message);
    }
    else bot.deleteMsg(msg);
}

module.exports.help = {
    name: "info",
    aliases: [
        "i",
        "informations"
    ],
    args: [
        "<server/bot>"
    ],
    permission: "USER",
    description: "prints info about server or bot"
}
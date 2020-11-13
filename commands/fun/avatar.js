const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.users.first() || msg.author;

    let avatar_embed = new MessageEmbed(bot, msg.guild, false)
    .setTitle(`AVATAR: ${user.username}`)
    .setImage(user.avatarURL({ format: 'png', size: 4096 }) || user.defaultAvatarURL);
    msg.channel.send(avatar_embed);
}

module.exports.help = {
    name: "avatar",
    aliases: [
        "userimg",
        "userpic"
    ],
    args: [
        "[@user]"
    ],
    permission: "USER",
    description: "shows user avatar"
}
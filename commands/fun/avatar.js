const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.users.first() || msg.author;

    let avatar_embed = new Discord.MessageEmbed()
    .setTitle(`AVATAR: ${user.username}`)
    .setImage(user.avatarURL({ size: 4096 }) || user.defaultAvatarURL)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

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
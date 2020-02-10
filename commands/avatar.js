const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.users.first() || msg.author;

    let avatar_embed = new Discord.RichEmbed()
    .setTitle(`AVATAR: ${user.username}`)
    .setImage(user.avatarURL || user.displayAvatarURL)
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

module.exports.error = {
}
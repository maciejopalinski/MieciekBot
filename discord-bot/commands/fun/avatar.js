const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');

const Avatar = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Avatar.execute = async (bot, msg, args) => {
    let user = msg.mentions.users.first() || msg.author;

    let avatar_embed = new MessageEmbed(bot, msg.guild, false)
    .setTitle(`AVATAR: ${user.username}`)
    .setImage(user.avatarURL({ format: 'png', size: 4096 }) || user.defaultAvatarURL);
    msg.channel.send(avatar_embed);
}

Avatar.setHelp({
    name: 'avatar',
    args: '[@user]',
    aliases: ['userimg', 'userpic'],
    description: 'shows user avatar',
    permission: 'USER'
});

module.exports = Avatar;
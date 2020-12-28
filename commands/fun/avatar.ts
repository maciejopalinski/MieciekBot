import { MessageEmbed, Command } from '../../lib';

const Avatar = new Command();

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

export default Avatar;
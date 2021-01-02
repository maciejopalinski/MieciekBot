import { MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Unmute = new Command();

Unmute.execute = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(!user.kickable || user.id == msg.author.id)
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.not_mutable);
    }

    let mute_node = <RolePermissionNode> bot.roles.manager.getNode('MUTE');
    let user_node = <RolePermissionNode> bot.roles.manager.getNode('USER');
    let mute_role = msg.guild.roles.cache.find(r => r.id == mute_node.role_id);
    let user_role = msg.guild.roles.cache.find(r => r.id == user_node.role_id);

    if(!mute_role)
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, `Mute role (${mute_node.role_id}) was not found on the server. Please, edit your configuration.`);
    }
    if(!user_role)
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, `User role (${user_node.role_id}) was not found on the server. Please, edit your configuration.`);
    }

    let mute_embed = new MessageEmbed(bot, msg.guild)
    .setTitle(`You have been unmuted on ${msg.guild.name}!`)
    .addField('Unmuted by:', `<@${msg.author.id}>`);
        
    let info_mute = new MessageEmbed(bot, msg.guild)
    .setTitle(`${user.user.username} has been unmuted!`)
    .addField('Unmuted by:', `<@${msg.author.id}>`);

    msg.delete();
    user.send(mute_embed);
    msg.channel.send(info_mute);

    user.roles.add(user_role);
    user.roles.remove(mute_role);
}

Unmute.help = {
    name: 'unmute',
    args: '<@user>',
    aliases: [],
    description: 'unmutes <@user>',
    permission: 'ADMIN'
};

const error = Unmute.error = {
    not_mutable: "I cannot unmute this user."
};

export default Unmute;
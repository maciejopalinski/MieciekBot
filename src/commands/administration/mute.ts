import { MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Mute = new Command();

Mute.execute = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(' ') || 'no reason specified';

    if(!user.kickable || user.id == msg.author.id)
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.not_mutable);
    }

    let { roles } = bot.guild.get(msg.guild.id);
    let mute_node = <RolePermissionNode> roles.manager.getNode('MUTE');
    let user_node = <RolePermissionNode> roles.manager.getNode('USER');
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
    .setTitle(`You have been muted on ${msg.guild.name}!`)
    .addField('Muted by:', `<@${msg.author.id}>`)
    .addField('Reason:', reason);
        
    let info_mute = new MessageEmbed(bot, msg.guild)
    .setTitle(`${user.user.username} has been muted!`)
    .addField('Muted by:', `<@${msg.author.id}>`)
    .addField('Reason:', reason);

    msg.delete();
    user.send(mute_embed);
    msg.channel.send(info_mute);

    await user.roles.add(mute_role);
    user.roles.remove(user_role);
}

Mute.help = {
    name: 'mute',
    args: '<@user> [reason]',
    aliases: ['shutup', 'stfu'],
    description: 'mutes <@user>',
    permission: 'ADMIN'
};

const error = Mute.error = {
    not_mutable: "I cannot mute this user."
};

export default Mute;
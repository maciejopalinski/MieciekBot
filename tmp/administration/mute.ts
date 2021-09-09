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

    let manager = bot.guild_manager.getPermissionManager(msg.guild.id);
    let mute_role = manager.getNodeRole('MUTE');
    let user_role = manager.getNodeRole('USER');

    if(!mute_role)
    {
        let node = manager.getNode('MUTE') as RolePermissionNode;
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, `Mute role (${node.role_id}) was not found on the server. Please, edit your configuration.`);
    }
    if(!user_role)
    {
        let node = manager.getNode('USER') as RolePermissionNode;
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, `User role (${node.role_id}) was not found on the server. Please, edit your configuration.`);
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
    user.send({ embeds: [mute_embed] });
    msg.channel.send({ embeds: [info_mute] });

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
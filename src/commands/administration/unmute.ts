import { MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Unmute = new Command();

Unmute.execute = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

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
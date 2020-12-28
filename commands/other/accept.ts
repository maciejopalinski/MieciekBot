import * as Discord from 'discord.js';
import { Client, MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Accept = new Command();

Accept.execute = async (bot, msg, args) => {
    if(bot.roles.user.allowed_nodes.includes('@everyone'))
    {
        let user_node = <RolePermissionNode> bot.roles.manager.getNode('USER');
        let user_role = msg.guild.roles.cache.find(role => role.id == user_node.role_id);
        if(!user_role)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, `User role (${user_node.role_id}) was not found on the server. Please, edit your configuration.`)
        }

        msg.member.roles.add(user_role);
        msg.delete();
            
        let welcome_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`Welcome on ${msg.guild.name}!`)
        .addField(`Now, you can see all channels on the server.`, `Have fun!`);
        return msg.author.send(welcome_embed);
    }
    else msg.delete();
}

Accept.setHelp({
    name: 'accept',
    args: '',
    aliases: [],
    description: 'adds the user role',
    permission: '@everyone'
});

export default Accept;
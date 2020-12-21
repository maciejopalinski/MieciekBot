const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');

const Accept = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Accept.execute = async (bot, msg, args) => {
    if(bot.roles.user.allowed_nodes.includes('@everyone'))
    {
        let user_node = bot.roles.manager.getNode('USER');
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

module.exports = Accept;
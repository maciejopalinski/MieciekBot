const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if(bot.roles.user.name == '@everyone')
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

module.exports.help = {
    name: "accept",
    aliases: [],
    args: [],
    permission: "@everyone",
    description: "adds the user role"
}
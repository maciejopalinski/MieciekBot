const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if(bot.settings.role.actual == bot.settings.role.nodes.findIndex(r => r.name == "@everyone"))
    {
        let index = {
            user: bot.settings.role.nodes.findIndex(r => r.name == "USER")
        };
        let user_role = msg.guild.roles.find(role => role.id == bot.settings.role.nodes[index.user].id);
        if(!user_role)
        {
            msg.delete(bot.delete_timeout);
            return msg.channel.send(`User role (${settings.roles.user}) was not found on the server. Please, edit your configuration.`)
            .then(msg => msg.delete(bot.delete_timeout));
        }

        msg.member.addRole(user_role);
        msg.delete();
            
        let welcome_embed = new Discord.RichEmbed()
        .setTitle(`Welcome on ${msg.guild.name}!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Now, you can see all channels on the server.`, `Have fun!`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        return msg.author.send(welcome_embed);
    }
    else
    {
        return msg.delete();
    }
}

module.exports.help = {
    name: "accept",
    aliases: [],
    args: [],
    permission: "@everyone",
    description: "adds the user role"
}
const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if(bot.settings.role.actual == bot.settings.role.nodes.findIndex(r => r.name == "@everyone"))
    {
        let user_role_id = bot.settings.role.nodes.find(r => r.name == "USER").id;
        let user_role = msg.guild.roles.cache.find(role => role.id == user_role_id);
        if(!user_role)
        {
            msg.delete({ timeout: bot.delete_timeout });
            return msg.channel.send(`User role (${role_ids.user}) was not found on the server. Please, edit your configuration.`)
            .then(msg => msg.delete({ timeout: bot.delete_timeout }));
        }

        msg.member.roles.add(user_role);
        msg.delete();
            
        let welcome_embed = new Discord.MessageEmbed()
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
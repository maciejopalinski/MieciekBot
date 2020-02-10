const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    if(bot.settings.roles.actual == bot.settings.roles.name.findIndex(res => res == "@everyone"))
    {
        let role_index = bot.settings.roles.name.findIndex(res => res == "USER");
        let user_role = msg.guild.roles.find(role => role.id == bot.settings.roles.id[role_index]);
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
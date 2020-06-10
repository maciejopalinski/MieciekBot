const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(!user.kickable || user.id == msg.author.id)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.not_mutable).then(msg => msg.delete(bot.delete_timeout));
    }

    let index = {
        mute: bot.settings.role.nodes.findIndex(r => r.name == "MUTE"),
        user: bot.settings.role.nodes.findIndex(r => r.name == "USER")
    };
    let mute_role = msg.guild.roles.find(r => r.id == bot.settings.role.nodes[index.mute].id);
    let user_role = msg.guild.roles.find(r => r.id == bot.settings.role.nodes[index.user].id);

    if(!mute_role)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(`Muted role (${bot.settings.role[index.mute].id}) was not found on the server. Please, edit your configuration.`)
        .then(msg => msg.delete(bot.delete_timeout));
    }

    let mute_embed = new Discord.RichEmbed()
    .setTitle(`You have been unmuted on ${msg.guild.name}!`)
    .setThumbnail(msg.guild.iconURL)
    .addField(`Unmuted by:`, msg.author.username)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
        
    let info_mute = new Discord.RichEmbed()
    .setTitle(`${user.user.username} has been unmuted!`)
    .setThumbnail(msg.guild.iconURL)
    .addField(`Unmuted by:`, `<@${msg.author.username}>`)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

    msg.delete();

    user.send(mute_embed);
    msg.channel.send(info_mute);

    user.addRole(user_role);
    user.removeRole(mute_role);
}

module.exports.help = {
    name: "unmute",
    aliases: [],
    args: [
        "<@user>"
    ],
    permission: "ADMIN",
    description: "unmutes <@user>"
}

module.exports.error = {
    "not_mutable": "I cannot unmute this user."
}
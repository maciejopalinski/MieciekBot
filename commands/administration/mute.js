const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(" ") || "no reason specified";

    if(!user.kickable || user.id == msg.author.id)
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.not_mutable).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }

    let role_ids = {
        mute: bot.settings.role.nodes.find(r => r.name == "MUTE").id,
        user: bot.settings.role.nodes.find(r => r.name == "USER").id
    }
    let mute_role = msg.guild.roles.cache.find(r => r.id == role_ids.mute);
    let user_role = msg.guild.roles.cache.find(r => r.id == role_ids.user);

    if(!mute_role)
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(`Mute role (${role_ids.mute}) was not found on the server. Please, edit your configuration.`)
        .then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }
    if(!user_role)
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(`User role (${role_ids.user}) was not found on the server. Please, edit your configuration.`)
        .then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }

    let mute_embed = new Discord.MessageEmbed()
    .setTitle(`You have been muted on ${msg.guild.name}!`)
    .setThumbnail(msg.guild.iconURL)
    .addField(`Muted by:`, `<@${msg.author.id}>`)
    .addField(`Reason:`, reason)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
        
    let info_mute = new Discord.MessageEmbed()
    .setTitle(`${user.user.username} has been muted!`)
    .setThumbnail(msg.guild.iconURL)
    .addField(`Muted by:`, `<@${msg.author.id}>`)
    .addField(`Reason:`, reason)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

    msg.delete();

    user.send(mute_embed);
    msg.channel.send(info_mute);

    user.roles.add(mute_role);
    user.roles.remove(user_role);
}

module.exports.help = {
    name: "mute",
    aliases: [
        "shutup",
        "stfu"
    ],
    args: [
        "<@user>",
        "[reason]"
    ],
    permission: "ADMIN",
    description: "mutes <@user>"
}

module.exports.error = {
    "not_mutable": "I cannot mute this user."
}
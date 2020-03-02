const Discord = require("discord.js");
const mongoose = require("mongoose");

const Warns = require("../models/warns.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();
    let reason = args.slice(1).join(" ");

    if(user)
    {
        if(user.id == msg.author.id)
        {
            msg.delete(bot.delete_timeout);
            return msg.channel.send(this.error.not_warnable).then(msg => msg.delete(bot.delete_timeout));
        }

        let warn_embed = new Discord.RichEmbed()
        .setTitle(`You have been warned on ${msg.guild.name}!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Warned by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
        
        let info_warn = new Discord.RichEmbed()
        .setTitle(`${user.displayName} has been warned!`)
        .setThumbnail(msg.guild.iconURL)
        .addField(`Warned by:`, msg.author.username)
        .addField(`Reason:`, reason)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        let date = new Date();
        let date_string = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

        const newWarn = new Warns({
            serverID: msg.guild.id,
            userID: user.id,
            warnedBy: msg.author.id,
            reason: reason,
            timestamp: date_string
        });
        newWarn.save().catch(err => console.log(err));

        msg.delete();
        
        await user.send(warn_embed);
        msg.channel.send(info_warn);
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.user_not_found).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "warn",
    aliases: [],
    args: [
        "<@user>",
        "<reason>"
    ],
    permission: "ADMIN",
    description: "warns <@user> with <reason>"
}

module.exports.error = {
    "user_not_found": "User was not found on the server. Please, try again.",
    "not_warnable": "I cannot warn that user.",
    "unknown": "Unknown error occurred. Please, try again later."
}
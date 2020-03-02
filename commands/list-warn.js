const Discord = require("discord.js");
const mongoose = require("mongoose");

const Warns = require("../models/warns.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(user)
    {
        let warns_embed = new Discord.RichEmbed()
        .setTitle(`WARNS: ${user.displayName}`)
        .setDescription(`List of ${user.displayName} warnings:`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        Warns.find({
            serverID: msg.guild.id,
            userID: user.id
        }, (err, res) => {
            if(!res)
            {
                msg.delete(bot.delete_timeout);
                return msg.channel.send(this.error.unknown).then(msg => msg.delete(bot.delete_timeout));
            }

            res.forEach(element => {
                warns_embed.addField(`Reason: ${element.reason}`, `Warned by: <@${element.warnedBy}>\n${element.timestamp}`);
            });

            if(res.length < 1)
            {
                warns_embed.addField(`There are not any warnings for user`, `<@${user.id}>`);
            }

            msg.channel.send(warns_embed);
        });
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.user_not_found).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "list-warn",
    aliases: [
        "list_warn",
        "warn-list",
        "warn_list",
        "warnlist",
        "listwarn",
        "warns"
    ],
    args: [
        "<@user>"
    ],
    permission: "ADMIN",
    description: "displays all <@user> warnings"
}

module.exports.error = {
    "user_not_found": "User was not found on the server. Please, try again.",
    "unknown": "Unknown error occurred. Please, try again later."
}
const Discord = require("discord.js");
const mongoose = require("mongoose");

const Warn = require("../../models/warn.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(user)
    {
        let warns_embed = new Discord.MessageEmbed()
        .setTitle(`WARNS: ${user.user.username}`)
        .setDescription(`List of <@${user.user.id}> warnings:`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        Warn.find({
            serverID: msg.guild.id,
            userID: user.id
        }, (err, res) => {
            if(!res)
            {
                msg.delete({ timeout: bot.delete_timeout });
                return msg.channel.send(this.error.unknown).then(msg => msg.delete({ timeout: bot.delete_timeout }));
            }

            res.forEach(element => {
                warns_embed.addField(`Reason: ${element.reason}`, `Warned by: <@${element.warnedBy}>\n${element.timestamp}`);
            });

            if(res.length < 1)
            {
                warns_embed.addField(`There are not any warnings for this user.`, `\u200b`);
            }

            msg.channel.send(warns_embed);
        });
    }
    else
    {
        msg.delete({ timeout: bot.delete_timeout });
        msg.channel.send(this.error.user_not_found).then(msg => msg.delete({ timeout: bot.delete_timeout }));
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
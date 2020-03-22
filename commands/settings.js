const Discord = require("discord.js");
const mongoose = require("mongoose");

const Settings = require("../models/settings.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async (bot, msg, args) => {
    if(!args[0])
    {
        let help = new Discord.RichEmbed()
        .setTitle(`Settings:`)
        .addField(`prefix`, `${bot.prefix}`)
        .addField(`delete_timeout`, `${bot.delete_timeout}`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        bot.settings.role.nodes.forEach(role => {
            if(role.name != "@everyone") help.addField(`role:${role.name.toLowerCase()}`, `<@&${role.id}> (${role.id})`);
        });

        msg.channel.send(help);
    }
    else if(args[1])
    {
        let key = args[0], value = args.slice(1).join(" ");

        await Settings.findOne({
            serverID: msg.guild.id
        }, (err, settings) => {
            if(!settings)
            {
                msg.delete(bot.delete_timeout);
                return msg.channel.send(this.error.unknown).then(msg => msg.delete(bot.delete_timeout));
            }

            let info = undefined;
            if(key == "prefix")
            {
                settings.prefix = value;
                info = `'${value}'`;
            }
            else if(key == "delete_timeout")
            {
                settings.delete_timeout = value;
                info = `'${value}'`;
            }
            else if(key.startsWith("role:"))
            {
                let new_role = msg.mentions.roles.first() || msg.guild.roles.find(role => role.id == value) || undefined;

                if(!new_role)
                {
                    msg.delete(bot.delete_timeout);
                    return msg.channel.send(this.error.not_found).then(msg => msg.delete(bot.delete_timeout));
                }

                bot.settings.role.nodes.forEach(role => {
                    if(role.name != "@everyone" && key == `role:${role.name.toLowerCase()}`)
                    {
                        eval(`settings.roles.${role.name.toLowerCase()} = new_role.id;`);
                        info = `<@&${new_role.id}> (${new_role.id})`;
                    }
                });
            }

            settings.save();
            if(info)
            {
                msg.channel.send(`Successfully changed '${key}' value to ${info}.`);
            }
            else
            {
                msg.delete(bot.delete_timeout);
                msg.channel.send(this.error.setting_not_found).then(msg => msg.delete(bot.delete_timeout));
            }
        });
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.no_value).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "settings",
    aliases: [
        "sett",
        "options",
        "config"
    ],
    args: [
        "[key]",
        "[value | @role]"
    ],
    permission: "OWNER",
    description: "edits the server settings"
}

module.exports.error = {
    "no_value": "No key value specified.\nUsage: !settings [key] [value | @role]",
    "not_found": "Role with that ID was not found on the server.",
    "setting_not_found": "That settings was not found in the database.",
    "unknown": "Unknown error occurred. Please, try again later."
}
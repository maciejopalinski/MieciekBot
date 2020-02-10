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
        .addField(`msg:delete_timeout`, `${bot.delete_timeout}`)
        .addField(`role:owner`, `<@&${bot.settings.roles.id[4]}> (${bot.settings.roles.id[4]})`)
        .addField(`role:admin`, `<@&${bot.settings.roles.id[3]}> (${bot.settings.roles.id[3]})`)
        .addField(`role:user`, `<@&${bot.settings.roles.id[2]}> (${bot.settings.roles.id[2]})`)
        .addField(`role:muted`, `<@&${bot.settings.roles.id[0]}> (${bot.settings.roles.id[0]})`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.channel.send(help);
    }
    else if(args[1])
    {
        let key = args[0], value = args.slice(1).join(" ");
        if(key == "prefix")
        {
            Settings.findOne({
                serverID: msg.guild.id
            }, (err, settings) => {
                if(!settings)
                {
                    msg.delete(bot.delete_timeout);
                    return msg.channel.send(this.error.unknown).then(msg => msg.delete(bot.delete_timeout));
                }
                settings.prefix = value;
                settings.save();
                msg.channel.send(`Successfully changed 'prefix' value to '${value}'.`);
            });
        }
        else if(key == "msg:delete_timeout")
        {
            Settings.findOne({
                serverID: msg.guild.id
            }, (err, settings) => {
                if(!settings)
                {
                    msg.delete(bot.delete_timeout);
                    return msg.channel.send(this.error.unknown).then(msg => msg.delete(bot.delete_timeout));
                }
                settings.delete_timeout = value;
                settings.save();
                msg.channel.send(`Successfully changed 'prefix' value to '${value}'.`);
            });
        }
        else if(key.startsWith("role:"))
        {
            let role = msg.mentions.roles.first() || msg.guild.roles.find(role => role.id == value) || undefined;
            
            if(role == undefined)
            {
                msg.delete(bot.delete_timeout);
                return msg.channel.send(`Role with that ID was not found on the server.`).then(msg => msg.delete(bot.delete_timeout));
            }

            Settings.findOne({
                serverID: msg.guild.id
            }, (err, settings) => {
                if(!settings)
                {
                    msg.delete(bot.delete_timeout);
                    return msg.channel.send(this.error.unknown).then(msg => msg.delete(bot.delete_timeout));
                }
                
                if(key == "role:owner")
                {
                    settings.roles.owner = role.id;
                    msg.channel.send(`Successfully changed 'role:owner' value to <@&${role.id}> (${role.id}).`);
                }
                else if(key == "role:admin")
                {
                    settings.roles.admin = role.id;
                    msg.channel.send(`Successfully changed 'role:admin' value to <@&${role.id}> (${role.id}).`);
                }
                else if(key == "role:user")
                {
                    settings.roles.user = role.id;
                    msg.channel.send(`Successfully changed 'role:user' value to <@&${role.id}> (${role.id}).`);
                }
                else if(key == "role:muted")
                {
                    settings.roles.muted = role.id;
                    msg.channel.send(`Successfully changed 'role:muted' value to <@&${role.id}> (${role.id}).`);
                }
                else
                {
                    return msg.delete(bot.delete_timeout);
                }
                settings.save();
            });
        }
        else
        {
            return msg.delete(bot.delete_timeout);
        }
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
    "unknown": "Unknown error occurred. Please, try again later."
}
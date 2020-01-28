const Discord = require("discord.js");
const mongoose = require("mongoose");

const Settings = require("../models/settings.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async (bot, msg, args) => {
    if(bot.settings.roles.actual == 0)
    {
        Settings.findOne({
            serverID: msg.guild.id
        }, (err, settings) => {
            if(!settings)
            {
                msg.delete(bot.delete_timeout);
                return msg.channel.send(this.error.unknown).then(msg => msg.delete(bot.delete_timeout));
            }

            let user_role = msg.guild.roles.find(role => role.id == settings.roles.user);
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
                .setFooter(`Powered by MieciekBot ${bot.settings.package_info.version}`, bot.settings.iconURL);

            return msg.author.send(welcome_embed);
        });
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

module.exports.error = {
    "unknown": "Unknown error occurred. Please, try again later."
}
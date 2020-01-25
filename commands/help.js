const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, msg, args) => {
    let help = new Discord.RichEmbed()
        .setTitle("Commands:")
        .addField(`${bot.prefix}${this.help.name} ${this.help.args}`, `${this.help.description}`);

    bot.commands.forEach((value, index) => {
        if(value.help.name !== "help" && bot.allowed_roles.includes(value.help.permission))
        {
            help.addField(`${bot.prefix}${value.help.name} ${value.help.args}`, `${value.help.description}`);
        }
    });
    
    msg.channel.send(help);
}

module.exports.help = {
    name: "help",
    aliases: [
        "hepl",
        "hlep",
        "?"
    ],
    args: [],
    permission: "USER",
    description: "shows all commands"
}

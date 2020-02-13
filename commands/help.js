const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    if(args[0] != "all")
    {
        bot.settings.roles.actual = bot.settings.roles.name.findIndex(r => r == "USER");
    }

    let help = new Discord.RichEmbed()
    .setTitle("Commands:")
    .addField(`${bot.prefix}${this.help.name} ${this.help.args}`, `${this.help.description}`);

    bot.commands.forEach((value, index) => {
        if(value.help.name !== "help" && bot.settings.roles.allowed_roles[bot.settings.roles.actual].includes(value.help.permission))
        {
            help.addField(`${bot.prefix}${value.help.name} ${value.help.args.join(" ")}`, `${value.help.description}`);
        }
    });
    
    help.setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);
    msg.channel.send(help);
}

module.exports.help = {
    name: "help",
    aliases: [
        "hepl",
        "hlep",
        "?"
    ],
    args: [
        "[all]"
    ],
    permission: "@everyone",
    description: "shows all commands"
}

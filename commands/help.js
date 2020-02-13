const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let actual = bot.settings.role.actual;
    if(args[0] != "all")
    {
        actual = bot.settings.role.nodes.findIndex(r => r.name == "USER");
    }

    let help = new Discord.RichEmbed()
    .setTitle("Commands:")
    .addField(`${bot.prefix}${this.help.name} ${this.help.args}`, `${this.help.description}`);

    let allowed_roles = bot.settings.role.nodes[actual].allowed_roles;
    
    bot.commands.forEach((value, index) => {
        if(value.help.name !== "help" && allowed_roles.includes(value.help.permission))
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

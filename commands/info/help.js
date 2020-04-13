const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let help = new Discord.RichEmbed();

    let actual = bot.settings.role.actual;
    let allowed_roles = bot.settings.role.nodes[actual].allowed_roles;
    let total_commands = 0;

    if(!args[0] || !bot.categories.includes(args[0]))
    {
        help.addField(`Usage: ${bot.prefix}${this.help.name} ${this.help.args}`, '\u200b')
        .addField(`Available categories:`, bot.categories.join(", "));

        return msg.channel.send(help);
    }
    
    help.setTitle(`HELP: ${args[0]}`);

    bot.commands.forEach((value, index) => {
        if(value.help.category == args[0] && allowed_roles.includes(value.help.permission))
        {
            help.addField(`${bot.prefix}${value.help.name} ${value.help.args.join(" ")}`, `${value.help.description}`);
            total_commands++;
        }
    });

    if(total_commands <= 0)
    {
        help.addField(`There weren't any available commands for you.`, '\u200b');
    }
    
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
        "[category]"
    ],
    permission: "@everyone",
    description: "shows all commands"
}

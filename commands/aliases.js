const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    const commandfile = bot.commands.get(args[0]) || bot.aliases.get(args[0]);

    if(!commandfile)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.cmd_not_found).then(msg => msg.delete(bot.delete_timeout));
    }

    let aliases_embed = new Discord.RichEmbed()
    .setTitle(`ALIASES: /command/${commandfile.help.name}`)
    .addField(`${bot.prefix}${commandfile.help.name} ${commandfile.help.args.join(" ")}`, commandfile.help.description)
    .addBlankField()
    .addField(`Aliases:`, commandfile.help.aliases.join(", "))
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

    msg.channel.send(aliases_embed);
}

module.exports.help = {
    name: "aliases",
    aliases: [
        "more",
        "moar"
    ],
    args: [
        "<command>"
    ],
    permission: "USER",
    description: "displays all aliases of <command>"
}

module.exports.error = {
    "cmd_not_found": "Command was not found! Please, try again."
}
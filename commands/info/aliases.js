const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    const commandfile = bot.commands.get(args[0]) || bot.aliases.get(args[0]);

    let actual = bot.settings.role.actual;
    let allowed_roles = bot.settings.role.nodes[actual].allowed_roles;

    if(!commandfile || !allowed_roles.includes(commandfile.help.permission) && commandfile.help.name != "help")
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.cmd_not_found).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }

    let aliases_embed = new Discord.MessageEmbed()
    .setTitle(`ALIASES: /command/${commandfile.help.name}`)
    .addField(`${bot.prefix}${commandfile.help.name} ${commandfile.help.args.join(" ")}`, commandfile.help.description)
    .addField(`Aliases:`, commandfile.help.aliases.join(", ") || "-none-")
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
const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    const commandfile = bot.command_manager.commands.get(args[0]) || bot.command_manager.aliases.get(args[0]);
    let allowed = bot.roles.user.allowed_nodes;

    if(!commandfile || !allowed.includes(commandfile.help.permission) && commandfile.help.name != 'help')
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.cmd_not_found);
    }

    let aliases_embed = new MessageEmbed(bot, msg.guild)
    .setTitle(`ALIASES: /command/${commandfile.help.name}`)
    .addField(`${bot.prefix}${commandfile.help.name} ${commandfile.help.args.join(' ')}`, commandfile.help.description)
    .addField('Aliases:', commandfile.help.aliases.join(', ') || '-none-');

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
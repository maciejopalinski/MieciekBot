const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let help = new MessageEmbed(bot, msg.guild);
    let allowed = bot.roles.user.allowed_nodes;

    if(!args[0] || !bot.command_manager.categories.includes(args[0]))
    {
        help
        .addField(`Usage: ${bot.prefix}${this.help.name} ${this.help.args}`, '\u200b')
        .addField('Available categories:', bot.command_manager.categories.join(', '));
        return msg.channel.send(help);
    }
    
    help.setTitle(`HELP: ${args[0]}`);

    let commands = bot.command_manager.commands.filter(v => v.help.category == args[0] && allowed.includes(v.help.permission));
    commands.forEach(v => help.addField(`${bot.prefix}${v.help.name} ${v.help.args.join(' ')}`, v.help.description));

    if(help.fields.length == 0) help.addField('There weren\'t any available commands for you.', '\u200b');
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

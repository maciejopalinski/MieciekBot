import { MessageEmbed, Command } from '../../lib';

const Help = new Command();

Help.execute = async (bot, msg, args) => {
    let help = new MessageEmbed(bot, msg.guild);
    let allowed = bot.roles.user.allowed_nodes;

    if(!args[0] || !bot.command_manager.categories.includes(args[0]))
    {
        help
        .addField(`Usage: ${bot.prefix}${Help.help.name} ${Help.help.args}`, '\u200b')
        .addField('Available categories:', bot.command_manager.categories.join(', '));
        return msg.channel.send(help);
    }
    
    help.setTitle(`HELP: ${args[0]}`);

    let commands = bot.command_manager.commands.filter(v => v.category == args[0] && allowed.includes(v.help.permission));
    commands.forEach(v => help.addField(`${bot.prefix}${v.help.name} ${v.help.args}`, v.help.description));

    if(help.fields.length == 0) help.addField('There weren\'t any available commands for you.', '\u200b');
    msg.channel.send(help);
}

Help.setHelp({
    name: 'help',
    args: '[category]',
    aliases: ['hepl', 'hlep', '?'],
    description: 'shows all commands',
    permission: '@everyone'
});

export default Help;
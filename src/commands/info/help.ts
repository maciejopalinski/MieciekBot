import { MessageEmbed, Command } from '../../lib';

const Help = new Command();

Help.execute = async (bot, msg, args) => {

    let { prefix } = bot.guild_manager.getGuildConfig(msg.guild.id);
    let allowed = bot.guild_manager.getUserPermission(msg.guild.id, msg.member.id).allowed_nodes;

    let help = new MessageEmbed(bot, msg.guild);

    if (!args[0]) args[0] = '';
    let category = bot.command_manager.categories.find(c => {
        let full_match = c.toLowerCase() == args[0].toLowerCase();
        let partial_match = c.toLowerCase().match(args[0].toLowerCase());

        return full_match || partial_match;
    });

    if(!args[0] || !category)
    {
        help
        .addField(`Usage: ${prefix}${Help.help.name} ${Help.help.args}`, '\u200b')
        .addField('Available categories:', bot.command_manager.categories.join(', '));
        return msg.channel.send(help);
    }

    help.setTitle(`HELP: ${category}`);

    let commands = bot.command_manager.commands.filter(c => c.category == category && allowed.includes(c.help.permission));
    commands.forEach(c => help.addField(`${prefix}${c.help.name} ${c.help.args}`, c.help.description));

    if(help.fields.length == 0) help.addField('There weren\'t any available commands for you.', '\u200b');
    msg.channel.send(help);
}

Help.help = {
    name: 'help',
    args: '[category]',
    aliases: ['hepl', 'hlep', '?'],
    description: 'shows all commands',
    permission: '@everyone'
};

export default Help;
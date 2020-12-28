import { MessageEmbed, Command } from '../../lib';

const Aliases = new Command();

Aliases.execute = async (bot, msg, args) => {
    
    const commandfile = bot.command_manager.getCommand(args[0]);
    let allowed = bot.roles.user.allowed_nodes;

    if(!commandfile || !allowed.includes(commandfile.help.permission) && commandfile.help.name != 'help')
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.cmd_not_found);
    }

    let aliases_embed = new MessageEmbed(bot, msg.guild)
    .setTitle(`ALIASES: /command/${commandfile.help.name}`)
    .addField(`${bot.prefix}${commandfile.help.name} ${commandfile.help.args}`, commandfile.help.description)
    .addField('Aliases:', commandfile.help.aliases.join(', ') || '-none-');

    msg.channel.send(aliases_embed);
}

Aliases.setHelp({
    name: 'aliases',
    args: '<command>',
    aliases: ['more', 'moar'],
    description: 'displays all aliases of <command>',
    permission: 'USER'
});

const error = Aliases.error = {
    cmd_not_found: "Command was not found! Please, try again."
}

export default Aliases;
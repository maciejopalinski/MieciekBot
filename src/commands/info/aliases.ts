import { MessageEmbed, Command } from '../../lib';

const Aliases = new Command();

Aliases.execute = async (bot, msg, args) => {
    
    const commandfile = bot.command_manager.getCommand(args[0]);

    let { prefix } = bot.guild_manager.guilds.get(msg.guild.id);
    let allowed = bot.guild_manager.guild_users.get(msg.guild.id).permission.get(msg.member.id).allowed_nodes;

    if(!commandfile || !allowed.includes(commandfile.help.permission) && commandfile.help.name != 'help')
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.cmd_not_found);
    }

    let aliases_embed = new MessageEmbed(bot, msg.guild)
    .setTitle(`ALIASES: /command/${commandfile.help.name}`)
    .addField(`${prefix}${commandfile.help.name} ${commandfile.help.args}`, commandfile.help.description)
    .addField('Aliases:', commandfile.help.aliases.join(', ') || '-none-');

    msg.channel.send(aliases_embed);
}

Aliases.help = {
    name: 'aliases',
    args: '<command>',
    aliases: ['more', 'moar'],
    description: 'displays all aliases of <command>',
    permission: 'USER'
};

const error = Aliases.error = {
    cmd_not_found: "Command was not found! Please, try again."
}

export default Aliases;
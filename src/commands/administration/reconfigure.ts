import { Command } from '../../lib';
import { onGuildCreate, onGuildDelete } from '../../events/Guild';

const Reconfigure = new Command();

Reconfigure.execute = async (bot, msg, args) => {

    let { prefix } = bot.guild_manager.getGuildConfig(msg.guild.id);
    if(args[0] == `confirm${msg.guild.id}`)
    {
        await bot.sendAndDelete(msg.channel, 'Reseting...');

        await onGuildDelete(bot, msg.guild);
        await onGuildCreate(bot, msg.guild);
    }
    else msg.channel.send(
        `Are you sure you want to reset all bot properties in database?\n` +
        `You will loose all settings, xp values and warns.\n` +
        `If you want to proceed, run following command:\n` +
        `\`\`\`${prefix}reconfigure confirm${msg.guild.id}\`\`\``
    );
}

Reconfigure.help = {
    name: 'reconfigure',
    args: '',
    aliases: [],
    description: 'reconfigures all bot properties in database',
    permission: 'OWNER'
};

export default Reconfigure;
import { Command } from '../../lib';

const Reconfigure = new Command();

Reconfigure.execute = async (bot, msg, args) => {
    if(args[0] == `confirm${msg.guild.id}`)
    {
        await bot.sendAndDelete(msg.channel, 'Reseting...');
        bot.emit('guildDelete', msg.guild);
        bot.emit('guildCreate', msg.guild);
    }
    else msg.channel.send(`Are you sure you want to reset all bot properties in database?\nYou will loose all settings, xp values and warns.\nIf you want to proceed, run following command:\`\`\`${bot.guild.get(msg.guild.id).prefix}reconfigure confirm${msg.guild.id}\`\`\``);
}

Reconfigure.help = {
    name: 'reconfigure',
    args: '',
    aliases: [],
    description: 'reconfigures all bot properties in database',
    permission: 'OWNER'
};

export default Reconfigure;
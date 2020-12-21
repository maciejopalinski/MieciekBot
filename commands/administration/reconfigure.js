const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Reconfigure = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Reconfigure.execute = async (bot, msg, args) => {
    if(args[0] == `confirm${msg.guild.id}`)
    {
        await bot.sendAndDelete(msg.channel, 'Reseting...');
        bot.emit('guildDelete', msg.guild);
        bot.emit('guildCreate', msg.guild);
    }
    else msg.channel.send(`Are you sure you want to reset all bot properties in database?\nYou will loose all settings, xp values and warns.\nIf you want to proceed, run following command:\`\`\`${bot.prefix}reconfigure confirm${msg.guild.id}\`\`\``);
}

Reconfigure.setHelp({
    name: 'reconfigure',
    args: '',
    aliases: [],
    description: 'reconfigures all bot properties in database',
    permission: 'OWNER'
});

module.exports = Reconfigure;
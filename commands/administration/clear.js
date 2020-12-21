const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Clear = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Clear.execute = async (bot, msg, args) => {
    let messages = args[0] || 100;

    if(messages >= 2 && messages <= 100)
    {
        await msg.delete();
        msg.channel.bulkDelete(messages).catch(err => bot.sendAndDelete(msg.channel, err.message));
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.wrong_amount);
    }
};

Clear.setHelp({
    name: 'clear',
    args: '[number]',
    aliases: ['cls', 'clr', 'cl'],
    description: 'deletes last 100 or [number] messages from channel',
    permission: 'ADMIN'
});

const error = Clear.error = {
    wrong_amount: "You can delete 2-100 messages at once."
}

module.exports = Clear;
const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Say = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Say.execute = async (bot, msg, args) => {
    await msg.delete();
    msg.channel.send(args.join(' '));
}

Say.setHelp({
    name: 'say',
    args: '<text>',
    aliases: ['print', 'send', 'announce'],
    description: 'sends a message containing <text>',
    permission: 'ADMIN'
});

module.exports = Say;
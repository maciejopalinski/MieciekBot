const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Skip = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Skip.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue)
    {
        msg.channel.send(error.skipped);
        server_queue.connection.dispatcher.end();
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

Skip.setHelp({
    name: 'skip',
    args: '',
    aliases: [],
    description: 'skips current track',
    permission: 'DJ'
});

const error = Skip.error = {
    music_play: "There must be something in queue to skip it.",
    skipped: "Music skipped."
};

module.exports = Skip;
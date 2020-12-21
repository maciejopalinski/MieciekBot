const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Remove = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Remove.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue)
    {
        args[0] = parseInt(args[0]);
        if(args[0] < 0 || args[0] > server_queue.songs.length - 1)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.invalid_num);
        }
        
        server_queue.removeSong(args[0]);
        msg.channel.send(error.removed.replace('{{pos}}', args[0]));
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.must_play);
    }
}

Remove.setHelp({
    name: 'remove',
    args: '<position>',
    aliases: [],
    description: 'removes track from queue',
    permission: 'DJ'
});

const error = Remove.error = {
    must_play: "There must be something in queue to remove it.",
    removed: "Track {{pos}} removed from the queue.",
    invalid_num: "Invalid number specified."
};

module.exports = Remove;
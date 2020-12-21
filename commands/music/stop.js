const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Stop = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Stop.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue && server_queue.playing.state)
    {
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();
        msg.channel.send(error.stopped);
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel,error.music_play);
    }
}

Stop.setHelp({
    name: 'stop',
    args: '',
    aliases: [],
    description: 'stops played music',
    permission: 'DJ'
});

const error = Stop.error = {
    music_play: "There must be a song in queue to stop it.",
    stopped: "Music stopped."
};

module.exports = Stop;
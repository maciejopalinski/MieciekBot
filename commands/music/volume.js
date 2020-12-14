const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const Command = require('../../lib/command/Command');

const Volume = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Volume.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue && server_queue.playing.state)
    {
        let new_volume = parseInt(args[0]) || undefined;
        if(!new_volume || new_volume < 1 || new_volume > 200)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.value + ` Volume: ${server_queue.volume.current}`);
        }

        server_queue.volume.last = server_queue.volume.current;
        server_queue.volume.current = new_volume;
        server_queue.updateVolume();
        msg.channel.send(error.done + new_volume + '.');
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

Volume.setHelp({
    name: 'volume',
    args: '[0-200]',
    aliases: ['vol'],
    description: 'sets volume to given value (100 - normal).',
    permission: 'DJ'
});

const error = Volume.error = {
    music_play: "There must be a song in queue.",
    value: "Please, enter integer between 1 - 200.",
    done: "Successfully set the volume to "
};

module.exports = Volume;
const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let server_queue = bot.music_queue.get(msg.guild.id);
    if(server_queue && server_queue.playing.state)
    {
        let new_volume = parseInt(args[0]) || undefined;
        if(!new_volume || new_volume < 1 || new_volume > 200)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.value + ` Volume: ${server_queue.volume.current}`);
        }

        server_queue.volume.last = server_queue.volume.current;
        server_queue.volume.current = new_volume;
        server_queue.updateVolume();
        msg.channel.send(this.error.done + new_volume + '.');
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.music_play);
    }
}

module.exports.help = {
    name: "volume",
    aliases: [
        "vol"
    ],
    args: [
        "[0-200]"
    ],
    permission: "DJ",
    description: "sets volume to given value (100 - normal)."
}

module.exports.error = {
    "music_play": "There must be a song in queue.",
    "value": "Please, enter integer between 1 - 200.",
    "done": "Successfully set the volume to "
}
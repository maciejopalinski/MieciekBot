const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    let new_volume = parseInt(args[0]) || undefined;
    if(!new_volume || new_volume < 1 || new_volume > 200)
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.value + ` Volume: ${server_queue.volume}.`).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }

    if(server_queue && server_queue.playing)
    {
        server_queue.last_volume = server_queue.volume;
        server_queue.volume = new_volume;
        server_queue.connection.dispatcher.setVolumeLogarithmic(new_volume / 100);
        msg.channel.send(this.error.done + new_volume + ".");
    }
    else
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.music_play).then(msg => msg.delete({ timeout: bot.delete_timeout }));
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
const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(!args[0] || args[0] < 0 || args[0] > 200)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.value).then(msg => msg.delete(bot.delete_timeout));
    }

    if(server_queue && server_queue.playing)
    {
        server_queue.volume = args[0];
        server_queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
        msg.channel.send(this.error.done + args[0] + ".");
    }
    else
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.music_play).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "volume",
    aliases: [
        "vol"
    ],
    args: [
        "<0-200>"
    ],
    permission: "DJ",
    description: "sets volume to given value (100 - normal)."
}

module.exports.error = {
    "music_play": "There must be a song in queue.",
    "value": "Please, enter number between 0 - 200.",
    "done": "Successfully set the volume to "
}
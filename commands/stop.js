const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(server_queue && server_queue.playing)
    {
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();
        msg.channel.send(this.error.stopped);
    }
    else
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.music_play).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "stop",
    aliases: [],
    args: [],
    permission: "USER",
    description: "stops played music"
}

module.exports.error = {
    "music_play": "There must be a song in queue to stop it.",
    "stopped": "Music stopped."
}
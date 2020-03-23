const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(server_queue && server_queue.playing)
    {
        msg.channel.send(this.error.skipped);
        server_queue.connection.dispatcher.end();
    }
    else
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.music_play).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "skip",
    aliases: [],
    args: [],
    permission: "DJ",
    description: "skips current track"
}

module.exports.error = {
    "music_play": "There must be something in queue to skip it.",
    "skipped": "Music skipped."
}
const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(server_queue)
    {
        if(server_queue.playing)
        {
            server_queue.playing = false;
            server_queue.connection.dispatcher.pause();
            msg.channel.send(this.error.paused);
        }
        else
        {
            server_queue.playing = true;
            server_queue.connection.dispatcher.resume();
            msg.channel.send(this.error.resumed);
        }
    }
    else
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.music_play).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }
}

module.exports.help = {
    name: "pause",
    aliases: [
        "resume"
    ],
    args: [],
    permission: "DJ",
    description: "pauses/resumes played music"
}

module.exports.error = {
    "music_play": "There must be a song in queue to pause/resume it.",
    "paused": "Music paused.",
    "resumed": "Music resumed."
}
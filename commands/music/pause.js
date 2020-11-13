const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let server_queue = bot.music_queue.get(msg.guild.id);
    if(server_queue)
    {
        if(server_queue.playing.state)
        {
            server_queue.playing.state = false;
            server_queue.connection.dispatcher.pause();
            msg.channel.send(this.error.paused);
        }
        else
        {
            server_queue.playing.state = true;
            server_queue.connection.dispatcher.resume();
            msg.channel.send(this.error.resumed);
        }
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.music_play);
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
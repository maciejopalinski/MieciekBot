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
        server_queue.songs = [];
        server_queue.connection.dispatcher.end();
        msg.channel.send(this.error.stopped);
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel,this.error.music_play);
    }
}

module.exports.help = {
    name: "stop",
    aliases: [],
    args: [],
    permission: "DJ",
    description: "stops played music"
}

module.exports.error = {
    "music_play": "There must be a song in queue to stop it.",
    "stopped": "Music stopped."
}
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
        msg.channel.send(this.error.skipped);
        server_queue.connection.dispatcher.end();
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.music_play);
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
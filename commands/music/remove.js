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
        args[0] = parseInt(args[0]);
        if(args[0] < 0 || args[0] > server_queue.songs.length - 1)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.invalid_num);
        }
        
        server_queue.removeSong(args[0]);
        msg.channel.send(this.error.removed.replace('{{pos}}', args[0]));
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.must_play);
    }
}

module.exports.help = {
    name: "remove",
    aliases: [],
    args: [
        "<position>"
    ],
    permission: "DJ",
    description: "removes track from queue"
}

module.exports.error = {
    "must_play": "There must be something in queue to remove it.",
    "removed": "Track {{pos}} removed from the queue.",
    "invalid_num": "Invalid number specified."
}
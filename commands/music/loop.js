const {Client, Message, MessageEmbed, QueueLoopModes} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let server_queue = bot.music_queue.get(msg.guild.id);
    if(server_queue && server_queue.playing.state)
    {
        if(!args[0]) return msg.channel.send(`Current loop mode: ${server_queue.playing.loop_mode}`);
        
        else if(['disabled', 'off'].includes(args[0].toLowerCase())) server_queue.setLoop(QueueLoopModes.DISABLED);
        else if(['loop_track', 'track', 'song', 'current'].includes(args[0].toLowerCase())) server_queue.setLoop(QueueLoopModes.LOOP_TRACK);
        else if(['loop_queue', 'queue', 'all'].includes(args[0].toLowerCase())) server_queue.setLoop(QueueLoopModes.LOOP_QUEUE);
        else if(['shuffle', 'random'].includes(args[0].toLowerCase())) server_queue.setLoop(QueueLoopModes.SHUFFLE);
        else {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.not_found);
        }

        return msg.channel.send(`Current loop mode: ${server_queue.playing.loop_mode}`);
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.music_play);
    }
}

module.exports.help = {
    name: "loop",
    aliases: [],
    args: [
        "[off|track|queue|shuffle]"
    ],
    permission: "DJ",
    description: "loops played music"
}

module.exports.error = {
    "music_play": "Music must be playing to loop it.",
    "not_found": "That loop mode was not found."
}
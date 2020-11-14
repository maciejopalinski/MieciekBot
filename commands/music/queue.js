const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let server_queue = bot.music_queue.get(msg.guild.id);
    if(server_queue && server_queue.connection.dispatcher)
    {
        let queue_embed = new MessageEmbed(bot, msg.guild, false).setTitle('MUSIC QUEUE');

        server_queue.songs.forEach((song, index) => {
            let progress = (song == server_queue.playing.current) ? (`${bot.music_queue.secondsToDuration(Math.floor(server_queue.connection.dispatcher.streamTime / 1000))}/`) : ('');
            
            queue_embed.addField(`[${index}] ${song.title} (${progress}${bot.music_queue.secondsToDuration(song.duration)})`, song.url);
        });

        queue_embed.addField(`LOOP: ${server_queue.playing.loop_mode}`, `Queue size: ${server_queue.songs.length}`);
        msg.channel.send(queue_embed);
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.music_play);
    }
}

module.exports.help = {
    name: "queue",
    aliases: [
        "q",
        "list",
        "playlist"
    ],
    args: [],
    permission: "USER",
    description: "displays music queue"
}

module.exports.error = {
    "music_play": "Queue is empty."
}
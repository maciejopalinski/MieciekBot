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
        let queue_embed = new Discord.RichEmbed()
        .setTitle(`MUSIC QUEUE`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        server_queue.songs.forEach((song, index) => {
            let progress = "";
            if(index == 0) progress = `${secondsToDuration(Math.floor(server_queue.connection.dispatcher.time / 1000))}/`;

            queue_embed.addField(`[${index}] ${song.title} (${progress}${secondsToDuration(song.duration)})`, song.url);
        });

        queue_embed.addBlankField().addField(`LOOP: ${server_queue.loop}`, `Queue size: ${server_queue.songs.length}`);
        msg.channel.send(queue_embed);
    }
    else
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.music_play).then(msg => msg.delete(bot.delete_timeout));
    }
}

module.exports.help = {
    name: "queue",
    aliases: [],
    args: [],
    permission: "USER",
    description: "displays music queue"
}

module.exports.error = {
    "music_play": "Queue is empty."
}

/**
 * Converts total seconds to `HH:MM:SS` or `MM:SS` duration format
 * 
 * @param {Number} sec
 * @returns {String}
 */
function secondsToDuration(sec) {
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);

    if (hours   < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    if(hours > 0) return `${hours}:${minutes}:${seconds}`;
    else return `${minutes}:${seconds}`;
}
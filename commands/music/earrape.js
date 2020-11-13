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
        if(server_queue.volume.current != 500)
        {
            server_queue.setVolume(500);
            msg.channel.send(this.error.turn_on);
        }
        else
        {
            server_queue.restoreVolume();
            msg.channel.send(this.error.turn_off + ` Volume: ${server_queue.volume.current}.`);
        }
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.music_play);
    }
}

module.exports.help = {
    name: "earrape",
    aliases: [
        "music-hehe"
    ],
    args: [],
    permission: "DJ",
    description: "plays music 5x louder"
}

module.exports.error = {
    "music_play": "There must be a song in queue.",
    "turn_on": "Earrape turned on.",
    "turn_off": "Earrape turned off."
}
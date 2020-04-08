const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(server_queue && server_queue.playing)
    {
        if(server_queue.volume != 500)
        {
            server_queue.volume = 500;
            server_queue.connection.dispatcher.setVolumeLogarithmic(500 / 100);
            msg.channel.send(this.error.turn_on);
        }
        else
        {
            server_queue.volume = 100;
            server_queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            msg.channel.send(this.error.turn_off);  
        }
    }
    else
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.music_play).then(msg => msg.delete(bot.delete_timeout));
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
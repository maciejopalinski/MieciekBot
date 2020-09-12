const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(server_queue && server_queue.playing)
    {
        if(server_queue.loop)
        {
            server_queue.loop = false;
            msg.channel.send(this.error.turn_off);
        }
        else
        {
            server_queue.loop = true;
            msg.channel.send(this.error.turn_on);
        }
    }
    else
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.music_play).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }
}

module.exports.help = {
    name: "loop",
    aliases: [],
    args: [],
    permission: "DJ",
    description: "loops played music"
}

module.exports.error = {
    "music_play": "Music must be playing to loop it.",
    "turn_on": "Music looping turned on.",
    "turn_off": "Music looping turned off."
}
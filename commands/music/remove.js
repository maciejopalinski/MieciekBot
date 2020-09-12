const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    args[0] = parseInt(args[0]);
    if(args[0] <= 0 || args[0] > server_queue.songs.length - 1)
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.invalid_num).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }

    if(server_queue)
    {
        msg.channel.send(this.error.removed.replace("{{pos}}", args[0]));
        server_queue.songs.splice(args[0], 1);
    }
    else
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.must_play).then(msg => msg.delete({ timeout: bot.delete_timeout }));
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
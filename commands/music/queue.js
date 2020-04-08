const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(server_queue)
    {
        let queue_embed = new Discord.RichEmbed()
        .setTitle(`MUSIC QUEUE`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        server_queue.songs.forEach((song, index) => {
            queue_embed.addField(`[${index}] ${song.title}`, song.url);
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
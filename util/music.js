const Discord = require("discord.js");

/**
 * 
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 */
module.exports.canModifyQueue = (bot, msg) => {
    const { channel } = msg.member.voice;
    const bot_channel = msg.guild.me.voice.channel;

    const permission_level = bot.settings.role.actual;
    const required_level = bot.settings.role.nodes.findIndex(p => p.name == "ADMIN");

    if (channel == bot_channel || permission_level >= required_level) return true;
    return false;
}

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Object} song 
 */
module.exports.play = (bot, msg, song) => {
    let server_queue = bot.queue.get(msg.guild.id);

    if(!song)
    {
        server_queue.voice_channel.leave();
        return bot.queue.delete(msg.guild.id);
    }

    let dispatcher = server_queue.connection
    .play(YTDL(song.url, { format: 'audioonly' }))
    .on("end", () => {
        if(!server_queue.loop)
        {
            server_queue.songs.shift();
        }
        this.play(bot, msg, server_queue.songs[0]);
    })
    .on("error", console.error);

    dispatcher.setVolumeLogarithmic(server_queue.volume / 100);
    server_queue.text_channel.send(`Now playing: **${song.title}**`);
};
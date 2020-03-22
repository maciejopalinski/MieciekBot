const Discord = require("discord.js");
const YTDL = require("ytdl-core");

module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    let voice_channel = msg.member.voiceChannel;
    if(!voice_channel)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.voice_channel).then(msg => msg.delete(bot.delete_timeout));
    }

    let song_info = await YTDL.getInfo(args[0]);

    if(!server_queue)
    {
        let server_queue_constructor = {
            text_channel: msg.channel,
            voice_channel: voice_channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(msg.guild.id, server_queue_constructor);

        server_queue_constructor.songs.push(song_info);

        try {
            let connection = await voice_channel.join();
            server_queue_constructor.connection = connection;
            this.play(bot, msg, server_queue_constructor.songs[0]);
        } catch(err) {
            console.log(err);
            queue.delete(msg.guild.id);
            return msg.channel.send(`Error: ${err}`);
        }
    }
    else
    {
        server_queue.songs.push(song);
        return msg.channel.send(`${song_info.title} has been added to the queue.`);
    }
}

module.exports.play = (bot, msg, song) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(!song)
    {
        server_queue.voice_channel.leave();
        return queue.delete(msg.guild.id);
    }

    let dispatcher = server_queue.connection
    .playStream(YTDL(song.video_url, {filter: "audioonly"}))
    .on("finish", () => {
        server_queue.songs.shift();
        this.play(bot, msg, server_queue.songs[0]);
    })
    .on("error", (err) => console.log(err));

    dispatcher.setVolumeLogarithmic(server_queue.volume / 5);
    server_queue.text_channel.send(`Now playing: **${song.title}**`);
}

module.exports.help = {
    name: "play",
    aliases: [
        "music",
        "p"
    ],
    args: [
        "<url>"
    ],
    permission: "USER",
    description: "plays music in voice channel"
}

module.exports.error = {
    "voice_channel": "You must be in a voice channel to play music."
}
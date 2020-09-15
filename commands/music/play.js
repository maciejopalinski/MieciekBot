const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const Search = require("youtube-search");
const { canModifyQueue, play } = require("../../util/music.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    const { channel } = msg.member.voice;
    // TODO: test this if statement
    if(!channel || !canModifyQueue(bot, msg))
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(this.error.voice_channel).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }

    let validate = YTDL.validateURL(args[0]);
    if(!validate)
    {
        /** @type {Search.YouTubeSearchOptions} */
        let search_options = { maxResults: 10, key: process.env.GOOGLE_API_KEY };
        let search_results = await Search(args.join(" "), search_options);
        if(search_results.results.length > 0)
        {
            args[0] = search_results.results.find(val => val.kind == "youtube#video").link;
            if(!YTDL.validateURL(args[0]))
            {
                msg.delete({ timeout: bot.delete_timeout });
                return msg.channel.send(this.error.not_found).then(msg => msg.delete({ timeout: bot.delete_timeout }));
            }
        }
        else
        {
            msg.delete({ timeout: bot.delete_timeout });
            return msg.channel.send(this.error.not_found).then(msg => msg.delete({ timeout: bot.delete_timeout }));
        }
    }

    let song_info = await YTDL.getInfo(args[0]);
    let song = {
        title: song_info.videoDetails.title,
        url: song_info.videoDetails.video_url,
        duration: song_info.videoDetails.lengthSeconds
    };

    let server_queue = bot.queue.get(msg.guild.id);
    let server_queue_constructor = {
        text_channel: msg.channel,
        voice_channel: channel,
        connection: null,
        songs: [],
        volume: 100,
        last_volume: 100,
        loop: false,
        playing: true
    };

    if(server_queue)
    {
        if(server_queue.songs.length >= 20)
        {
            msg.delete({ timeout: bot.delete_timeout });
            return msg.channel.send(this.error.queue_length).then(msg => msg.delete({ timeout: bot.delete_timeout }));
        }
        server_queue.songs.push(song);
        return msg.channel.send(`**${song.title}** has been added to the queue.`);
    }

    bot.queue.set(msg.guild.id, server_queue_constructor);
    server_queue_constructor.songs.push(song);

    try {
        let connection = await channel.join();
        connection.on('disconnect', (err) => {
            if(err) console.error(err);

            if(server_queue.connection.dispatcher)
            {
                server_queue.songs = [];
                server_queue.connection.dispatcher.end();
                msg.channel.send(this.error.stopped);
            }
        });

        server_queue_constructor.connection = connection;
        await server_queue_constructor.connection.voice.setSelfDeaf(true);
        play(bot, msg, server_queue_constructor.songs[0]);
    } catch (err) {
        console.error(err);
        bot.queue.delete(msg.guild.id);
        channel.leave();
        return msg.channel.send(`Could not join the channel: ${err}`);
    }
}

module.exports.help = {
    name: "play",
    aliases: [
        "music",
        "p"
    ],
    args: [
        "<url|search>"
    ],
    permission: "DJ",
    description: "plays music in voice channel"
}

module.exports.error = {
    "voice_channel": "You must be in a voice channel to play music.",
    "not_found": "Video with that name or URL was not found on YouTube.",
    "stopped": "Disconnected from voice channel. Music stopped.",
    "queue_length": "Cannot add new tracks to the music queue. Queue can be up to 20 tracks long."
}
const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const Search = require("youtube-search");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    let voice_channel = msg.member.voiceChannel;
    if(!voice_channel)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.voice_channel).then(msg => msg.delete(bot.delete_timeout));
    }

    let validate = YTDL.validateURL(args[0]);
    if(!validate)
    {
        /**
         * @type {Search.YouTubeSearchOptions}
         */
        let search_options = {
            maxResults: 10,
            key: process.env.GOOGLE_API_KEY
        };
        let search_results = await Search(args.join(" "), search_options);
        if(search_results.results.length > 0)
        {
            args[0] = search_results.results.find(val => val.kind == "youtube#video").link;
            if(!YTDL.validateURL(args[0]))
            {
                msg.delete(bot.delete_timeout);
                return msg.channel.send(this.error.not_found).then(msg => msg.delete(bot.delete_timeout));
            }
        }
        else
        {
            msg.delete(bot.delete_timeout);
            return msg.channel.send(this.error.not_found).then(msg => msg.delete(bot.delete_timeout));
        }
    }

    let song_info = await YTDL.getInfo(args[0]);
    let song = {
        title: song_info.title,
        url: song_info.video_url,
        duration: song_info.length_seconds
    };

    if(!server_queue)
    {
        let server_queue_constructor = {
            text_channel: msg.channel,
            voice_channel: voice_channel,
            connection: null,
            songs: [],
            volume: 100,
            last_volume: 100,
            loop: false,
            playing: true
        };

        queue.set(msg.guild.id, server_queue_constructor);

        server_queue_constructor.songs.push(song);

        try {
            let connection = await voice_channel.join();
            connection.on("disconnect", (err) => {
                if(err) console.error(err);
        
                let server_queue = bot.queue.get(msg.guild.id);
                if(server_queue.connection.dispatcher)
                {
                    server_queue.songs = [];
                    server_queue.connection.dispatcher.end();
                    msg.channel.send(this.error.stopped);
                }
            });

            server_queue_constructor.connection = connection;
            this.play(bot, msg, server_queue_constructor.songs[0]);
        } catch(err) {
            console.error(err);
            queue.delete(msg.guild.id);
            return msg.channel.send(`Error: ${err}`);
        }
    }
    else
    {
        if(server_queue.songs.length >= 20)
        {
            msg.delete(bot.delete_timeout);
            return msg.channel.send(this.error.queue_length).then(msg => msg.delete(bot.delete_timeout));
        }
        
        server_queue.songs.push(song);
        return msg.channel.send(`**${song.title}** has been added to the queue.`);
    }
}

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Object} song 
 */
module.exports.play = (bot, msg, song) => {
    let queue = bot.queue;
    let server_queue = bot.queue.get(msg.guild.id);

    if(!song)
    {
        server_queue.voice_channel.leave();
        return queue.delete(msg.guild.id);
    }

    let dispatcher = server_queue.connection
    .playStream(YTDL(song.url, {filter: "audioonly"}))
    .on("end", () => {
        if(!server_queue.loop)
        {
            server_queue.songs.shift();
        }
        this.play(bot, msg, server_queue.songs[0]);
    })
    .on("error", (err) => console.error(err));

    dispatcher.setVolumeLogarithmic(server_queue.volume / 100);
    server_queue.text_channel.send(`Now playing: **${song.title}**`);
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
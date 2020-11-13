const {Client} = require('./mieciekbot.js');
const Discord = require('discord.js');
const YTDL = require('ytdl-core');
const Search = require('youtube-search');

/**
 * @readonly
 * @enum {String}
 */
const QueueLoopModes = {
    DISABLED: 'DISABLED',
    LOOP_TRACK: 'TRACK',
    LOOP_QUEUE: 'QUEUE',
    SHUFFLE: 'SHUFFLE'
};

class Song {
    
    /** @type {Client} */
    client;
    /** @type {YTDL.MoreVideoDetails} */
    details;
    /** @type {String} */
    uuid;

    constructor(client) {
        this.uuid = this.generateUUID(32);
        this.client = client;
    }

    /** @param {String} query */
    async fetchInfo(query) {
        if(!YTDL.validateURL(query)) query = await this.searchYouTube(query);
        this.details = (await YTDL.getInfo(query)).videoDetails;
    }

    /**
     * @param {String} video_name
     * @returns {String}
     */
    async searchYouTube(video_name) {
        /** @type {Search.YouTubeSearchOptions} */
        let search_options = { maxResults: 3, key: process.env.GOOGLE_API_KEY };
        let search_results = this.client.music_queue.cache.get(video_name) || null;
        if(search_results == null) search_results = await Search(video_name, search_options);
        else {
            return search_results;
        }
        
        let link = undefined;
        if(search_results.results.length > 0)
        {
            link = search_results.results.find(v => v.kind == 'youtube#video').link;
            if(!YTDL.validateURL(link)) throw new Error('Video with that name or URL was not found on YouTube.');
            else return link;
        }
        else throw new Error('Video with that name or URL was not found on YouTube.');
    }

    get title() {
        return this.details.title;
    }

    get url() {
        return this.details.video_url;
    }

    get duration() {
        return this.details.lengthSeconds;
    }

    /**
     * @param {number} length
     * @param {String} characters
     */
    generateUUID(length, characters) {
        if(characters == undefined) characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        let result = '';
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }
}

class ServerQueue {
    
    /** @type {Client} */
    client;
    /** @type {Discord.TextChannel} */
    text_channel;
    /** @type {Discord.VoiceChannel} */
    voice_channel;
    /** @type {Discord.VoiceConnection} */
    connection = null;

    /** @type {Array<Song>} */
    songs = [];

    playing = {
        /** @type {QueueLoopModes} */
        loop_mode: QueueLoopModes.DISABLED,
        /** @type {Song} */
        current: null,
        state: false
    };

    volume = { current: 100, last: 100 };

    /**
     * @param {Discord.TextChannel} text_channel
     * @param {Discord.VoiceChannel} voice_channel
     */
    constructor(client, text_channel, voice_channel) {
        this.client = client;
        this.text_channel = text_channel;
        this.voice_channel = voice_channel;
    }

    /**
     * @param {Song} song
     * @param {boolean} [announce]
     * @param {boolean} [bypass_limit]
     */
    addSong(song, announce, bypass_limit) {
        if(bypass_limit == undefined) bypass_limit = false;
        if(announce == undefined) announce = true;

        if(!bypass_limit && this.songs.length >= 20) throw new Error('Cannot add new tracks to the music queue. Queue can be up to 20 tracks long.');
        this.songs.push(song);
        if(this.songs.length == 1) this.playing.current = song;
        
        if(announce) this.text_channel.send(`**${song.title}** has been added to the queue.`);
    }

    removeSong(index) {
        if(this.songs[index].uuid == this.playing.current.uuid) {
            this.songs.splice(index, 1);
            this.connection.dispatcher.end();
        } else {
            this.songs.splice(index, 1);
        }
    }

    /** @param {QueueLoopModes} mode */
    setLoop(mode) {
        this.playing.loop_mode = mode;
    }
    
    nextSong() {
        if(this.playing.loop_mode == QueueLoopModes.SHUFFLE) {
            const get_random_int = (min, max) => Math.round(Math.random() * (max - min)) + min;
            
            this.playing.current = this.songs[get_random_int(0, this.songs.length)];
        }
        else if(this.playing.loop_mode != QueueLoopModes.LOOP_TRACK) {
            let next_song_index = this.songs.findIndex(s => s.uuid == this.playing.current.uuid) + 1;
            if(next_song_index >= this.songs.length) next_song_index = 0;

            this.playing.current = this.songs[next_song_index];
        }
    }

    setVolume(volume) {
        this.volume.last = this.volume.current;
        this.volume.current = volume;
        this.updateVolume();
    }

    updateVolume() {
        return this.connection.dispatcher.setVolumeLogarithmic(this.volume.current / 100);
    }

    restoreVolume() {
        this.setVolume(this.volume.last);
    }

    play() {
        let song = this.playing.current;

        if(!song) {
            this.voice_channel.leave();
            this.client.music_queue.delete(this.text_channel.guild.id);
            return;
        }

        let dispatcher = this.connection
        .play(YTDL(song.url, { format: 'audioonly' }))
        .on('finish', () => {
            this.nextSong();
            this.play();
        })
        .on('error', console.error);

        dispatcher.setVolumeLogarithmic(this.volume.current / 100);
        this.playing.state = true;
        this.text_channel.send(`Now playing: **${this.playing.current.details.title}**`);
    }

    join() {
        return this.voice_channel.join();
    }

    async loadQueue(saved_queue) {
        for (const url of saved_queue.urls) {
            let song = new Song(this.client);
            await song.fetchInfo(url);
            this.addSong(song, false);
        }
        
        await this.text_channel.send(`Queue has been successfully loaded. Total songs: **${this.songs.length}**`);
    }

    async saveQueue(queue_name) {
        let new_queue = this.client.db_manager.defaultSavedQueue(this.voice_channel.guild.id, queue_name);
        this.songs.forEach(song => new_queue.urls.push(song.url));
        await new_queue.save();
        
        this.text_channel.send(`Queue has been successfully saved. Name: *'${queue_name}'*`);
    }
}

class MusicManager {

    /** @type {Discord.Collection<String, ServerQueue>} */
    queues = new Discord.Collection();
    
    /** @type {Map<String, String>} */
    cache = new Map();

    /** 
     * @param {String} guild_id
     */
    get(guild_id) {
        return this.queues.get(guild_id);
    }

    /** 
     * @param {String} guild_id
     */
    delete(guild_id) {
        return this.queues.delete(guild_id);
    }

    /**
     * @param {String} guild_id
     * @param {ServerQueue} server_queue
     */
    set(server_queue) {
        return this.queues.set(server_queue.text_channel.guild.id, server_queue);
    }
}

module.exports = {
    Song: Song,
    ServerQueue: ServerQueue,
    QueueLoopModes: QueueLoopModes,
    MusicManager: MusicManager
};
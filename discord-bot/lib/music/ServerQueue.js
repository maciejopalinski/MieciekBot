const Discord = require('discord.js');
const YTDL = require('ytdl-core');

const Client = require('../client/Client');
const Song = require('./Song');
const QueueLoopModes = require('./QueueLoopModes');

module.exports = class ServerQueue {
    
    /** @type {Client} */ client;
    /** @type {Discord.TextChannel} */ text_channel;
    /** @type {Discord.VoiceChannel} */ voice_channel;
    /** @type {Discord.VoiceConnection} */ connection = null;

    /** @type {Song[]} */ songs = [];

    playing = {
        /** @type {QueueLoopModes} */ loop_mode: QueueLoopModes.DISABLED,
        /** @type {Song} */ current: null,
        state: false
    };

    volume = { current: 100, last: 100 };

    /**
     * @param {Client} client
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
        if(this.songs.length == 1 || !this.playing.current) this.playing.current = song;
        
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
        
        // if shuffle loop mode is set, get random song and play it
        if(this.playing.loop_mode == QueueLoopModes.SHUFFLE) {
            const get_random_int = (min, max) => Math.round(Math.random() * (max - min)) + min;

            this.playing.current = this.songs[get_random_int(0, this.songs.length - 1)];
        }
        else if(this.playing.loop_mode != QueueLoopModes.LOOP_TRACK) {
            let next_song_index = this.songs.findIndex(s => s.uuid == this.playing.current.uuid) + 1;
            
            // check if this is the last song
            if(next_song_index >= this.songs.length) {
                // loop the queue, or...
                if(this.playing.loop_mode == QueueLoopModes.LOOP_QUEUE) next_song_index = 0;
                
                // or... clear playlist and exit
                else if(this.playing.loop_mode == QueueLoopModes.DISABLED) {
                    this.songs = [];
                    this.playing.current = null;
                    return;
                }
            }

            this.playing.current = this.songs[next_song_index];
        }
        
        // if track loop is enabled, do nothing, song will repeat
        return true;
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
            this.client.music_manager.delete(this.text_channel.guild.id);
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
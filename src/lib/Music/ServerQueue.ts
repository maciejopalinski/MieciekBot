import { Guild, TextChannel, NewsChannel, VoiceChannel, VoiceConnection } from 'discord.js';
import YTDL from 'ytdl-core';

import { Client, Channel, Song } from '../';
import { SavedQueue } from '../../models/';

export enum QueueLoopModes {
    DISABLED = 'DISABLED',
    LOOP_TRACK = 'TRACK',
    LOOP_QUEUE = 'QUEUE',
    SHUFFLE = 'SHUFFLE'
};

export interface PlayingState {
    loop_mode: QueueLoopModes;
    current: Song;
    state: boolean;
}

export class ServerQueue {

    guild: Guild;
    client: Client;
    text_channel: TextChannel | NewsChannel;
    voice_channel: VoiceChannel;
    connection: VoiceConnection = null;

    songs: Song[] = [];

    playing: PlayingState = {
        loop_mode: QueueLoopModes.DISABLED,
        current: null, state: false
    };

    volume = { current: 100, last: 100 };

    constructor(client: Client, text_channel: TextChannel | NewsChannel, voice_channel: VoiceChannel) {
        this.client = client;
        this.text_channel = text_channel;
        this.voice_channel = voice_channel;
        this.guild = voice_channel.guild;
    }

    addSong(song: Song, announce: boolean = true, bypass_limit: boolean = false) {

        if(this.songs.length >= 20 && !bypass_limit) {
            throw new Error('Cannot add new tracks to the music queue. Queue can be up to 20 tracks long.');
        }

        this.songs.push(song);

        if(this.songs.length == 1 || !this.playing.current) this.playing.current = song;

        if(announce) this.text_channel.send(`**${song.title}** has been added to the queue.`);
    }

    removeSong(index: number) {
        if(this.songs[index].uuid == this.playing.current.uuid) {
            this.songs.splice(index, 1);
            this.connection.dispatcher.end();
        } else {
            this.songs.splice(index, 1);
        }
    }

    setLoop(mode: QueueLoopModes) {
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

    setVolume(volume: number) {
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
            this.client.music_manager.delete(this.guild.id);
            return;
        }

        let dispatcher = this.connection
        .play(YTDL(song.url, { quality: '140' }))
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
            this.addSong(song, false, true);
        }
        
        await this.text_channel.send(`Queue has been successfully loaded. Total songs: **${this.songs.length}**`);
    }

    async saveQueue(name) {
        let new_queue = await SavedQueue.create({
            guildID: this.voice_channel.guild.id,
            name,
            urls: []
        });

        this.songs.forEach(song => new_queue.urls.push(song.url));
        await new_queue.save();
        
        this.text_channel.send(`Queue has been successfully saved. Name: *'${name}'*`);
    }
}
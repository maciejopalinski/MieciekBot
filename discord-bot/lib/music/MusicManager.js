const Discord = require('discord.js');
const ServerQueue = require('../music/ServerQueue');
const YTDL = require('ytdl-core');

module.exports = class MusicManager {

    /** @type {Discord.Collection<string, ServerQueue>} */
    queues = new Discord.Collection();
    
    /** @type {Map<string, string>} */
    search_cache = new Map();
    /** @type {Map<string, string>} */
    vidinfo_cache = new Map();

    /** @param {string} guild_id */
    get(guild_id) {
        return this.queues.get(guild_id);
    }

    /** @param {string} guild_id */
    delete(guild_id) {
        return this.queues.delete(guild_id);
    }

    /** @param {ServerQueue} server_queue */
    set(server_queue) {
        return this.queues.set(server_queue.text_channel.guild.id, server_queue);
    }

    /**
     * Converts total seconds to `HH:MM:SS` or `MM:SS` duration format
     * 
     * @param {number} sec
     * @returns {string}
     */
    secondsToDuration(sec) {
        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);

        if (hours   < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;

        if(hours > 0) return `${hours}:${minutes}:${seconds}`;
        else return `${minutes}:${seconds}`;
    }

    /**
     * @param {string} url
     * @returns {Promise<YTDL.videoInfo>}
     */
    async getBasicInfo(url) {
        let cache_entry = this.vidinfo_cache.get(url);
        if(cache_entry) return cache_entry;
        else {
            this.vidinfo_cache.set(url, await YTDL.getBasicInfo(url));
            return this.getBasicInfo(url);
        }
    }
}
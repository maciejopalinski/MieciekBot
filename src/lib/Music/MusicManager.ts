import { Collection } from 'discord.js';
import YTDL from 'ytdl-core';
import { ServerQueue } from './';

export class MusicManager {

    queues = new Collection<string, ServerQueue>();
    
    search_cache = new Map<string, string>();
    vidinfo_cache = new Map<string, YTDL.videoInfo>();

    get(guild_id: string) {
        return this.queues.get(guild_id);
    }

    delete(guild_id: string) {
        return this.queues.delete(guild_id);
    }

    set(server_queue: ServerQueue) {
        return this.queues.set(server_queue.guild.id, server_queue);
    }

    /**
     * Converts total seconds to `HH:MM:SS` or `MM:SS` duration format
     */
    secondsToDuration(sec: number) {

        let hours = Math.floor(sec / 3600);
        let minutes = Math.floor((sec - (hours * 3600)) / 60);
        let seconds = sec - (hours * 3600) - (minutes * 60);

        let format = Intl.NumberFormat('en-US', { minimumIntegerDigits: 2, maximumFractionDigits: 0 });
        let minutes_str = format.format(minutes);
        let seconds_str = format.format(seconds);

        if(hours > 0) return `${format.format(hours)}:${minutes_str}:${seconds_str}`;
        else return `${minutes_str}:${seconds_str}`;
    }

    async getBasicInfo(url: string) {
        let cache_entry = this.vidinfo_cache.get(url);
        if(cache_entry) return cache_entry;
        else {
            this.vidinfo_cache.set(url, await YTDL.getBasicInfo(url));
            return this.getBasicInfo(url);
        }
    }
}
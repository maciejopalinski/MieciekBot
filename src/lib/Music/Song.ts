import YTDL from 'ytdl-core';
import Search from 'youtube-search';

import { Client } from '../';

export class Song {

    client: Client;
    details: YTDL.MoreVideoDetails;
    uuid: string;

    constructor(client: Client) {
        this.client = client;
        this.uuid = this.client.generateUUID(32);
    }

    async fetchInfo(query: string) {
        if(!YTDL.validateURL(query)) query = await this.searchYouTube(query);
        this.details = (await this.client.music_manager.getBasicInfo(query)).videoDetails;
    }

    async searchYouTube(video_name: string) {

        let search_options: Search.YouTubeSearchOptions = { maxResults: 3, key: process.env.GOOGLE_API_KEY };
        let search_results: any = this.client.music_manager.search_cache.get(video_name) || null;

        if(search_results == null) search_results = await Search(video_name, search_options);
        else return search_results;

        let link: string = undefined;
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
        return parseFloat(this.details.lengthSeconds);
    }
}
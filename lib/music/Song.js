const Client = require('../client/Client');
const YTDL = require('ytdl-core');
const Search = require('youtube-search');

module.exports = class Song {
    
    /** @type {Client} */ client;
    /** @type {YTDL.MoreVideoDetails} */ details;
    /** @type {string} */ uuid;

    /** @param {Client} client */
    constructor(client) {
        this.client = client;
        this.uuid = this.client.generateUUID(32);
    }

    /** @param {string} query */
    async fetchInfo(query) {
        if(!YTDL.validateURL(query)) query = await this.searchYouTube(query);
        this.details = (await this.client.music_manager.getBasicInfo(query)).videoDetails;
    }

    /**
     * @param {string} video_name
     * @returns {string}
     */
    async searchYouTube(video_name) {
        /** @type {Search.YouTubeSearchOptions} */
        let search_options = { maxResults: 3, key: process.env.GOOGLE_API_KEY };
        let search_results = this.client.music_manager.search_cache.get(video_name) || null;
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
}
import axios from 'axios';

/**
 * @param {string} endpoint
 * @returns {string}
 */
export const API = (endpoint) => process.env.REACT_APP_API_URL + endpoint;

/** @param {string} endpoint */
const CDN = (endpoint) => 'https://cdn.discordapp.com' + endpoint;

export function getUserDetails() {
    return axios.get(API('/discord/@me'), { withCredentials: true });
}

export function getMutualGuilds() {
    return axios.get(API('/discord/guilds/mutual'), { withCredentials: true });
}

export function getUserAvatar(id, avatar, size = 256) {
    return CDN(`/avatars/${id}/${avatar}.jpg?size=${size}`);
}

export function getGuildIcon(id, icon, size = 256) {
    return CDN(`/icons/${id}/${icon}.jpg?size=${size}`);
}
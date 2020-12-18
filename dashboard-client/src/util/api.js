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

export function getUserAvatar(id, avatar) {
    return CDN(`/avatars/${id}/${avatar}.png`);
}
const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');
const axios = require('axios');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let country = '';
    if(!args[0] || args[0] == 'world' || args[0] == 'global') country = 'all';
    else country = args.join(' ');
    
    let url = 'https://covid-193.p.rapidapi.com/';
    /** @type {axios.AxiosRequestConfig} */
    let options = {
        headers: {
            'x-rapidapi-host': 'covid-193.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }, params: {}
    };

    if(country == 'all')
    {
        options.params = { country: country };
        let stats = await axios.default.get(url + 'statistics', options);
        msg.channel.send(create_embed(bot, msg, stats.data, "Global"));
    }
    else
    {
        options.params = { search: country };
        let search = await axios.default.get(url + 'countries', options);
        if(search.data.results == 0) {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, 'That country was not found in the database.');
        }
        
        let verified_country = search.data.response[0];
        options.params = { country: verified_country };
        let stats = await axios.default.get(url + 'statistics', options);
        msg.channel.send(create_embed(bot, msg, stats.data, verified_country));
    }
}

module.exports.help = {
    name: "coronavirus",
    aliases: [
        "cvirus",
        "cvstats"
    ],
    args: [
        "[country|world|global|all]"
    ],
    permission: "USER",
    description: "displays current coronavirus statistics"
}

/**
 * @param {Client} bot
 * @param {Message} msg
 * @param {object} body
 * @param {String} header
 * @returns {Discord.MessageEmbed}
 */
function create_embed(bot, msg, body, header) {
    let time = new Date(Date.parse(body.response[0].time));

    let cv_embed = new MessageEmbed(bot, msg.guild)
    .setTitle(`COVID-19 ${header} Statistics`)
    .addField('Cases:', new Intl.NumberFormat('en-US', { useGrouping: true }).format(body.response[0].cases.total))
    .addField('Deaths:', new Intl.NumberFormat('en-US', { useGrouping: true }).format(body.response[0].deaths.total))
    .addField('Recovered:', new Intl.NumberFormat('en-US', { useGrouping: true }).format(body.response[0].cases.recovered))
    .addField('Last update:', time.toUTCString());

    return cv_embed;
}
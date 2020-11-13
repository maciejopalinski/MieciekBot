const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');
const axios = require('axios').default;

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    
    let joke_embed = new MessageEmbed(bot, msg.guild).setTitle('Chuck Norris Joke');
    
    axios.get('https://api.chucknorris.io/jokes/random/')
    .then(res => {
        joke_embed.setURL(res.data.url).addField(res.data.value, '\u200b');
        return msg.channel.send(joke_embed);
    })
    .catch(err => {
        joke_embed.addField('API Error', err);
        return msg.channel.send(joke_embed);
    });
}

module.exports.help = {
    name: "chuck-norris",
    aliases: [
        "chuck",
        "norris",
        "cnjoke"
    ],
    args: [],
    permission: "USER",
    description: "displays random Chuck Norris joke"
}
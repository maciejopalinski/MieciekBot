const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');
const axios = require('axios').default;

const ChuckNorris = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
ChuckNorris.execute = async (bot, msg, args) => {
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

ChuckNorris.setHelp({
    name: 'chuck-norris',
    args: '',
    aliases: ['chuck', 'norris', 'cnjoke'],
    description: 'displays random Chuck Norris joke',
    permission: 'USER'
});

module.exports = ChuckNorris;
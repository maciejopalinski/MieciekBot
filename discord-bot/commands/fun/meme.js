const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');
const RandomPuppy = require('random-puppy');

const Meme = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Meme.execute = async (bot, msg, args) => {
    let subReddits = [
        'dankmemes',
        'memes',
        'me_irl',
        'cursedimages',
        'blessedimages',
        'blursedimages',
        'ihadastroke'
    ];
    
    let random = subReddits[Math.floor(Math.random() * subReddits.length)];

    let img = await RandomPuppy(random);
    
    let meme_embed = new MessageEmbed(bot, undefined, false)
    .setTitle(`MEME: r/${random}`)
    .setImage(img)
    .setURL(`https://reddit.com/r/${random}`);

    return msg.channel.send(meme_embed);
}

Meme.setHelp({
    name: 'meme',
    args: '',
    aliases: ['funny', 'memee'],
    description: 'sends random meme from reddit',
    permission: 'USER'
});

module.exports = Meme;
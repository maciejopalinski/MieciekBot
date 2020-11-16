const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');
const RandomPuppy = require('random-puppy');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
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

module.exports.help = {
    name: "meme",
    aliases: [
        "funny",
        "memee"
    ],
    args: [],
    permission: "USER",
    description: "sends random meme from reddit"
}
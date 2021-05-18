import { MessageEmbed, Command } from '../../lib';
import RandomPuppy from 'random-puppy';

const Meme = new Command();

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

Meme.help = {
    name: 'meme',
    args: '',
    aliases: ['funny', 'memee'],
    description: 'sends random meme from reddit',
    permission: 'USER'
};

export default Meme;
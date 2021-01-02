import { MessageEmbed, Command } from '../../lib';
import axios from 'axios';

const ChuckNorris = new Command();

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

ChuckNorris.help = {
    name: 'chuck-norris',
    args: '',
    aliases: ['chuck', 'norris', 'cnjoke'],
    description: 'displays random Chuck Norris joke',
    permission: 'USER'
};

export default ChuckNorris;
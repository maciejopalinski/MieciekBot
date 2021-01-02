import { MessageEmbed, Command } from '../../lib';
import RandomNumber from 'random-number-csprng';

const Random = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Random.execute = async (bot, msg, args) => {
    let range = parseInt(args[0]);
    if(range > 1 && range <= 65535)
    {
        RandomNumber(1, range).then(random => {
            let random_embed = new MessageEmbed(bot, msg.guild)
            .setTitle(`Random: 1 - ${range}`)
            .addField(`Random number from 1 to ${range}:`, random);

            msg.channel.send(random_embed);
        });
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.cannot_roll);
    }
}

Random.help = {
    name: 'random',
    args: '<range>',
    aliases: ['roll', 'dice', 'roll-dice', 'roll_dice', 'rand', 'srand'],
    description: 'rolls dice with <range> sides',
    permission: 'USER'
};

const error = Random.error = {
    cannot_roll: "Range must be in range *2 - 65535*. Please, pick different number and try again."
}

export default Random;
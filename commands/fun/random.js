const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');
const RandomNumber = require('random-number-csprng');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
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
        bot.sendAndDelete(msg.channel, this.error.cannot_roll);
    }
}

module.exports.help = {
    name: "random",
    aliases: [
        "roll",
        "dice",
        "roll-dice",
        "roll_dice",
        "rand",
        "srand"
    ],
    args: [
        "<range>"
    ],
    permission: "USER",
    description: "rolls dice with <range> sides"
}

module.exports.error = {
    "cannot_roll": "Range must be in range *2 - 65535*. Please, pick different number and try again."
}
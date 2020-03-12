const Discord = require("discord.js");
const RandomNumber = require("random-number-csprng");

module.exports.run = async (bot, msg, args) => {
    let range = parseInt(args[0]);

    if(range > 1 && range <= 65535)
    {
        RandomNumber(1, range).then(random => {
            let random_embed = new Discord.RichEmbed()
            .setTitle(`Random: 1 - ${range}`)
            .addField(`Random number from 1 to ${range}:`, random)
            .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

            msg.channel.send(random_embed);
        });
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.cannot_roll).then(msg => msg.delete(bot.delete_timeout));
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
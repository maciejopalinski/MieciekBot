const Discord = require("discord.js");
const Request = require("request");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    var options = {
        method: 'GET',
        url: 'https://api.chucknorris.io/jokes/random/'
    };

    Request(options, async (err, res, body) => {
        if(err) return console.error(err);
        body = JSON.parse(body);

        const joke_embed = new Discord.MessageEmbed()
        .setTitle('Chuck Norris Joke')
        .setURL(body.url)
        .addField(body.value, '\u200b')
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.channel.send(joke_embed);
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
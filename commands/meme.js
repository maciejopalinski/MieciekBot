const Discord = require("discord.js");
const RandomPuppy = require("random-puppy");

module.exports.run = async (bot, msg, args) => {
    let subReddits = ["dankmeme", "meme", "me_irl"];
    
    let random = subReddits[Math.floor(Math.random() * subReddits.length)];

    let img = await RandomPuppy(random);
    let meme_embed = new Discord.RichEmbed()
    .setTitle(`MEME: r/${random}`)
    .setImage(img)
    .setURL(`https://reddit.com/r/${random}`)
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

    msg.channel.send(meme_embed);
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
const Discord = require("discord.js");
const mongoose = require("mongoose");

const User = require("../../models/user.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    User.find({
        serverID: msg.guild.id
    }).sort([
        ['xp', 'descending']
    ]).exec((err, res) => {
        if (err) console.error(err);

        let rank_embed = new Discord.MessageEmbed()
        .setTitle(`${msg.guild.name} Leaderboard`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        res = res.filter(elem => elem.xp != 0);
        if(res.length == 0)
        {
            rank_embed.addField(`There are not any members in database.`, '\u200b');
        }
        else if(res.length < 10)
        {
            res.forEach((elem, index) => {
                rank_embed.addField(`${index+1}. @${msg.guild.members.cache.get(elem.userID).user.tag}`, `${elem.xp > 1000 ? (`${(elem.xp / 1000).toFixed(3)}K`) : (elem.xp.toFixed(2))} XP (Level ${elem.level})`);
            });
        }
        else if(res.length > 10)
        {
            for (let i = 0; i < 10; i++)
            {
                let elem = res[i];
                rank_embed.addField(`${i+1}. @${msg.guild.members.cache.get(elem.userID).user.tag}`, `${elem.xp > 1000 ? (`${(elem.xp / 1000).toFixed(3)}K`) : (elem.xp.toFixed(2))} XP (Level ${elem.level})`);
            }
        }

        msg.channel.send(rank_embed);
    });
}

module.exports.help = {
    name: "leaderboard",
    aliases: [
        "rank"
    ],
    args: [],
    permission: "USER",
    description: "displays server activity leaderboard"
}
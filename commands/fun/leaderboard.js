const Discord = require("discord.js");
const mongoose = require("mongoose");

const Users = require("../../models/users.js");

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
    Users.find({
        serverID: msg.guild.id
    }).sort([
        ['xp', 'descending']
    ]).exec((err, res) => {
        if (err) console.error(err);

        let rank_embed = new Discord.RichEmbed()
        .setTitle(`${msg.guild.name} Leaderboard`)
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        let new_res = [];
        res.forEach(elem => {
            if(elem.xp != 0) new_res.push(elem);
        });
        res = new_res;

        if(res.length == 0)
        {
            rank_embed.addField(`There are not any members in database.`, '\u200b');
        }
        else if(res.length < 10)
        {
            res.forEach((elem, index) => {
                rank_embed.addField(`${index+1}. @${msg.guild.members.get(elem.userID).user.tag}`, `${elem.xp > 1000 ? (`${(elem.xp / 1000).toFixed(3)}K`) : (elem.xp.toFixed(2))} XP (Level ${elem.level})`);
            });
        }
        else if(res.length > 10)
        {
            for (let i = 0; i < 10; i++)
            {
                let elem = res[i];
                rank_embed.addField(`${i+1}. @${msg.guild.members.get(elem.userID).user.tag}`, `${elem.xp > 1000 ? (`${(elem.xp / 1000).toFixed(3)}K`) : (elem.xp.toFixed(2))} XP (Level ${elem.level})`);
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
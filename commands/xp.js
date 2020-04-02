const Discord = require("discord.js");
const mongoose = require("mongoose");

const Users = require("../models/users.js");

const XPCalc = require("../lib/experience.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.users.first() || msg.member;

    Users.findOne({
        serverID: msg.guild.id,
        userID: user.id
    }, (err, res) => {
        if (err) console.log(err);

        if(!res)
        {
            const new_user = new Users({
                serverID: msg.guild.id,
                userID: user.id,
                level: 0,
                xp: 0
            });
            new_user.save();
        }
        else
        {
            let progress_bar = `[`;
            let start = XPCalc.getXp(res.level);
            let dest = XPCalc.getXp(res.level + 1);

            let percent = (res.xp - start) / (dest - start) * 100;

            for (let i = 0; i < 20; i++)
            {
                if(i < percent / 5)
                {
                    progress_bar += `=`;
                }
                else
                {
                    progress_bar += `   `;
                }
            }
            progress_bar += `]`;

            msg.channel.send(`Level: ${res.level}\nXP: ${res.xp}\n${progress_bar} ${Math.round(percent)}%\n${start}XP => ${dest}XP`);
        }
    });
}

module.exports.help = {
    name: "xp",
    aliases: [],
    args: [
        "[@user]"
    ],
    permission: "USER",
    description: "displays user experience points"
}
const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Discord = require("discord.js");
const Servers = require("../models/servers.js");
const Users = require("../models/users.js");

bot.on('ready', () => {
    let status = [
        {
            status: "online",
            game: {
                type: "LISTENING",
                name: "Megadeth"
            }
        },
        {
            status: "online",
            game: {
                type: "LISTENING",
                name: "Slipknot"
            }
        },
        {
            status: "online",
            game: {
                type: "PLAYING",
                name: "Visual Studio Code"
            }
        },
        {
            status: "online",
            game: {
                type: "PLAYING",
                name: `on ${bot.guilds.size} ${bot.guilds.size > 1 ? "servers" : "server"}`
            }
        }
    ];

    setInterval(function () {
        let index = Math.floor(Math.random() * status.length);
        bot.user.setPresence(status[index]);
    }, 5000);

    bot.guilds.forEach(guild => {
        Servers.findOne({
            serverID: guild.id
        }, (err, res) => {
            if(err) console.error(err);

            if(!res)
            {
                let custom_guild = guild;
                guild.members = new Discord.Collection();
                bot.emit('guildCreate', custom_guild);
                console.warn(`Added new guild to the database.\nGuildID: ${guild.id}`);
            }
        });

        guild.members.forEach(member => {
            Users.findOne({
                serverID: guild.id,
                userID: member.id
            }, (err, res) => {
                if(err) console.error(err);

                if(!res && !member.user.bot)
                {
                    bot.emit('guildMemberAdd', member);
                    console.warn(`Added new guild member to the database.\nGuildID: ${guild.id}\nMemberID: ${member.id}`)
                }
            })
        });
    });

    console.info(`Running...`);
});
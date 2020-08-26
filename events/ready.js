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
                console.debug(`Adding new guild to the database... (GID:${guild.id})`);
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
                    console.debug(`Adding new guild member to the database... (GID:${guild.id} UID:${member.id})`);
                }
            });
        });

        Users.find({
            serverID: guild.id
        }, (err, res) => {
            let guild_users = guild.members.filter(member => !member.user.bot);
            res.forEach(member => {
                if(!guild_users.delete(member.userID))
                {
                    bot.emit('guildMemberRemove', {
                        id: member.userID,
                        guild: {
                            id: guild.id
                        }
                    });
                    console.debug(`Deleting old guild member from the database... (GID:${guild.id} UID:${member.userID})`);
                }
            });
        });
    });

    console.info(`Running...`);
});
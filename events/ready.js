const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Discord = require("discord.js");
const Server = require("../models/server.js");
const User = require("../models/user.js");

bot.on('ready', async () => {

    let status = [
        {
            status: "online",
            activity: {
                type: "LISTENING",
                name: "Megadeth",
                url: "https://github.com/PoProstuMieciek/"
            }
        },
        {
            status: "online",
            activity: {
                type: "LISTENING",
                name: "Slipknot",
                url: "https://github.com/PoProstuMieciek/"
            }
        },
        {
            status: "online",
            activity: {
                type: "PLAYING",
                name: "Visual Studio Code",
                url: "https://github.com/PoProstuMieciek/"
            }
        },
        {
            status: "online",
            activity: {
                type: "PLAYING",
                name: `on ${bot.guilds.cache.size} ${bot.guilds.cache.size > 1 ? "servers" : "server"}`,
                url: "https://github.com/PoProstuMieciek/"
            }
        }
    ];

    setInterval(function () {
        let index = Math.floor(Math.random() * status.length);
        bot.user.setPresence(status[index]);
    }, 5000);

    console.info(`Running...`);

    // database cleanup
    bot.guilds.cache.forEach(async guild => {

        // delete old members
        let db_guild_members = await User.find({ serverID: guild.id }).exec();
        let guild_users = guild.members.cache.filter(member => !member.user.bot);
        db_guild_members.forEach(member => {
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

        // add new guilds
        let db_guild = await Server.findOne({ serverID: guild.id }).exec();
        if(!db_guild)
        {
            bot.emit('guildCreate', guild, true);
            console.debug(`Adding new guild to the database... (GID:${guild.id})`);
        }
        
        // add new members
        guild.members.cache.forEach(async member => {
            let db_member = await User.findOne({ serverID: guild.id, userID: member.id }).exec();
            if(!db_member && !member.user.bot)
            {
                bot.emit('guildMemberAdd', member);
                console.debug(`Adding new guild member to the database... (GID:${guild.id} UID:${member.id})`);
            }
        });
    });

    // delete old guilds
    let db_guilds = await Server.find({}).exec();
    let bot_guilds = bot.guilds.cache;
    db_guilds.forEach(guild => {
        if(!bot_guilds.delete(guild.serverID))
        {
            bot.emit('guildDelete', { id: guild.serverID });
            console.debug(`Deleting old guild and its members from the database... (GID:${guild.serverID})`);
        } 
    });
});
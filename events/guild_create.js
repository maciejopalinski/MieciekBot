const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Server = require("../models/server.js");
const User = require("../models/user.js");

bot.on('guildCreate', (guild, ignore_members) => {
    const new_server = new Server({
        serverID: guild.id,
        prefix: "!",
        delete_timeout: 3000,
        roles: {
            owner: "",
            admin: "",
            dj: "",
            user: "",
            mute: ""
        },
        spam_channels: []
    });
    new_server.save().catch(err => console.error(err));

    if(ignore_members != true)
    {
        let guild_members = [];
        guild.members.cache.forEach(member => {
            if(!member.user.bot)
            {
                guild_members.push({
                    serverID: member.guild.id,
                    userID: member.id,
                    level: 0,
                    xp: 0
                });
            }
        });

        User.insertMany(guild_members, err => {
            if(err) console.error(err);
        });
    }
    
    let owner = bot.users.cache.get(guild.ownerID);
    if(!owner) return guild.leave();

    owner.send(`Hi! I just configured your '${guild.name}' server. Please, set up all required permissions, roles and other useful properties. Have a good time!`).catch(err => {
        if(err) return console.error(err);
    });
});
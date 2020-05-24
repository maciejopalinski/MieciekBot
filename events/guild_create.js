const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Servers = require("../models/servers.js");
const Users = require("../models/users.js");

bot.on('guildCreate', guild => {
    const new_server = new Servers({
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

    let guild_members = [];
    guild.members.forEach(member => {
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

    Users.insertMany(guild_members, err => {
        if(err) console.error(err);
    });

    let owner = bot.users.get(guild.ownerID);
    if(!owner) guild.leave();
    
    owner.send(`Hi! I just configured your '${guild.name}' server. Please, set up all required permissions, roles and other useful properties. Have a good time!`).catch(err => {
        if(err) return console.error(err);
    });
});
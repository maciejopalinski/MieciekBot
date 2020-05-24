const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Servers = require("../models/servers.js");
const Users = require("../models/users.js");
const Warns = require("../models/warns.js");

bot.on('guildDelete', guild => {
    Servers.findOneAndDelete({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });

    Users.deleteMany({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });

    Warns.deleteMany({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });
});
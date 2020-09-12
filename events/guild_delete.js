const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Server = require("../models/server.js");
const User = require("../models/user.js");
const Warn = require("../models/warn.js");

bot.on('guildDelete', guild => {
    Server.findOneAndDelete({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });

    User.deleteMany({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });

    Warn.deleteMany({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });
});
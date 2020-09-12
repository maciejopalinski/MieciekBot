const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = require("../models/user.js");
const Warn = require("../models/warn.js");

bot.on('guildMemberRemove', member => {
    User.findOneAndDelete({
        serverID: member.guild.id,
        userID: member.id
    }, err => {
        if(err) console.error(err);
    });

    Warn.deleteMany({
        serverID: member.guild.id,
        userID: member.id
    }, err => {
        if(err) console.error(err);
    })
});
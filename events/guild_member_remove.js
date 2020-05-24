const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Users = require("../models/users.js");
const Warns = require("../models/warns.js");

bot.on('guildMemberRemove', member => {
    Users.findOneAndDelete({
        serverID: member.guild.id,
        userID: member.id
    }, err => {
        if(err) console.error(err);
    });

    Warns.deleteMany({
        serverID: member.guild.id,
        userID: member.id
    }, err => {
        if(err) console.error(err);
    })
});
const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Users = require("../models/users.js");

bot.on('guildMemberAdd', member => {
    const new_member = new Users({
        serverID: member.guild.id,
        userID: member.id,
        level: 0,
        xp: 0
    });
    new_member.save().catch(err => console.error(err));
});
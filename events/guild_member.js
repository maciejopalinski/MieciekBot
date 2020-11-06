const {bot} = require("../index.js");

bot.on('guildMemberAdd', member => {
    bot.db_manager.defaultUser(member.guild.id, member.id).save().catch(err => console.error);
});

bot.on('guildMemberRemove', member => {
    bot.db_manager.deleteUser(member.guild.id, member.id);
});
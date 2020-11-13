const {bot} = require('../index.js');

bot.on('guildMemberRemove', member => {
    bot.db_manager.deleteUser(member.guild.id, member.id);
});
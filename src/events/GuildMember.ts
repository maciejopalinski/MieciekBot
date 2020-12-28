import { bot } from '../';

bot.on('guildMemberRemove', async member => {
    (await bot.db_manager.getUser(member.guild.id, member.id)).delete();

    if(bot.announce_options.toggles.remove_member) bot.announce(undefined, `**<@${member.id}> left the server.**`);
});

bot.on('guildMemberAdd', member => {
    if(bot.announce_options.toggles.add_member) bot.announce(undefined, `**<@${member.id}> joined the server!**`);
});
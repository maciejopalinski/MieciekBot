const Discord = require('discord.js');
const Client = require('../../lib/client/Client');
const MessageEmbed = require('../../lib/message/MessageEmbed');
const Command = require('../../lib/command/Command');

const Leaderboard = new Command();

/**
 * @param {Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
Leaderboard.execute = async (bot, msg, args) => {
    await msg.guild.members.fetch();
    
    let server_users = await bot.db_manager.getServerUsers(msg.guild.id);
    server_users = server_users.filter(user => user.xp != 0);
    server_users.sort((a, b) => b.xp - a.xp);

    let rank_embed = new MessageEmbed(bot, msg.guild).setTitle(`${msg.guild.name} Leaderboard`);

    if(server_users.length == 0) rank_embed.addField('There are not any members in database.', '\u200b');
    else if(server_users.length < 10)
    {
        server_users.forEach((elem, i) => {
            rank_embed.addField(`${i+1}. @${msg.guild.members.cache.get(elem.userID).user.tag}`, `${elem.xp > 1000 ? (`${(elem.xp / 1000).toFixed(3)}K`) : (elem.xp.toFixed(2))} XP (Level ${elem.level})`);
        });
    }
    else if(server_users.length > 10)
    {
        for (let i = 0; i < 10; i++) {
            let elem = server_users[i];
            rank_embed.addField(`${i+1}. @${msg.guild.members.cache.get(elem.userID).user.tag}`, `${elem.xp > 1000 ? (`${(elem.xp / 1000).toFixed(3)}K`) : (elem.xp.toFixed(2))} XP (Level ${elem.level})`);
        }
    }
    
    msg.channel.send(rank_embed);
}

Leaderboard.setHelp({
    name: 'leaderboard',
    args: '',
    aliases: ['rank'],
    description: 'displays server activity leaderboard',
    permission: 'USER'
});

module.exports = Leaderboard;
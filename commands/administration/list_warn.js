const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first();

    if(user)
    {
        let warns_embed = new MessageEmbed(bot, msg.guild)
        .setTitle(`WARNS: ${user.user.username}`)
        .setDescription(`List of <@${user.user.id}> warnings:`);

        let warns = await bot.db_manager.getWarns(msg.guild.id, user.id);
        if(!warns)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.unknown);
        }
        
        warns.forEach(entry => {
            warns_embed.addField(`Reason: ${entry.reason}`, `Warned by: <@${entry.warnedBy}>\n${entry.timestamp}`);
        });

        if(warns.length < 1) warns_embed.addField('There are not any warnings for this user.', '\u200b');
        
        msg.channel.send(warns_embed);
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, this.error.user_not_found);
    }
}

module.exports.help = {
    name: "list-warn",
    aliases: [
        "list_warn",
        "warn-list",
        "warn_list",
        "warnlist",
        "listwarn",
        "warns"
    ],
    args: [
        "<@user>"
    ],
    permission: "ADMIN",
    description: "displays all <@user> warnings"
}

module.exports.error = {
    "user_not_found": "User was not found on the server. Please, try again.",
    "unknown": "Unknown error occurred. Please, try again later."
}
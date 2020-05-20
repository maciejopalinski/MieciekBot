const Discord = require("discord.js");
const Users = require("../../models/users.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    console.info(`Starting database cleanup requested by <@${msg.author.id}> in ${msg.guild.id} server...`);

    await Users.find({}, (err, res) => {
        if (err) return console.error(err);

        let removed = 0;
        res.forEach(val => {
            let user = bot.users.get(val.userID);

            if(user.bot)
            {
                console.debug(`Deleting bot... (UNM:${user.username}, UID:${user.id}, SID:${val.serverID})`);

                Users.deleteOne({
                    serverID: val.serverID,
                    userID: user.id
                }, err => {
                    if(err) return console.error(err);
                });
                removed++;
            }
        });

        msg.channel.send(`Database cleanup finished. Removed ${removed} bots from database.`)
        console.info(`Database cleanup finished. Removed ${removed} bots from database.`);
    });
}

module.exports.help = {
    name: "database-cleanup",
    aliases: [],
    args: [],
    permission: "BOT_OWNER",
    description: "executes database cleanup"
}
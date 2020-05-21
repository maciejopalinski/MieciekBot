const Discord = require("discord.js");
const Users = require("../../models/users.js");
const Servers = require("../../models/servers.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    console.info(`Starting database cleanup requested by <@${msg.author.id}> in ${msg.guild.id} server...`);

    await Users.find({}, (err, res) => {
        if (err) return console.error(err);

        let bots = 0;
        res.forEach(val => {
            let user = bot.users.get(val.userID);

            if(user && user.bot)
            {
                console.debug(`Deleting bot... (UNM:${user.username}, UID:${user.id}, SID:${val.serverID})`);

                Users.deleteOne({
                    serverID: val.serverID,
                    userID: user.id
                }, err => {
                    if(err) return console.error(err);
                });
                bots++;
            }
        });

        Servers.find({}, (err, res) => {
            if (err) return console.error(err);

            let servers = 0;
            res.forEach(val => {
                let server = bot.guilds.get(val.serverID) || undefined;

                if(!server)
                {
                    console.debug(`Deleting guild... (GID:${val.serverID})`);

                    bot.emit("guildDelete", {id: val.serverID});
                    servers++;
                }
            });

            let info = `Database cleanup finished. Removed ${bots} bots and ${servers} servers from database.`;
            msg.channel.send(info);
            console.info(info);
        });
    });
}

module.exports.help = {
    name: "database-cleanup",
    aliases: [],
    args: [],
    permission: "BOT_OWNER",
    description: "executes database cleanup"
}
const Discord = require("discord.js");

const Servers = require("../../models/servers.js");
const Users = require("../../models/users.js");
const Warns = require("../../models/warns.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {    
    if(args[0] == `confirm${msg.guild.id}`)
    {
        msg.channel.send(`Reseting...`).then(msg => msg.delete(bot.delete_timeout));

        Servers.findOneAndDelete({
            serverID: msg.guild.id
        }, err => {
            if(err) console.error(err);
        });
    
        Users.deleteMany({
            serverID: msg.guild.id
        }, err => {
            if(err) console.error(err);
        });
    
        Warns.deleteMany({
            serverID: msg.guild.id
        }, err => {
            if(err) console.error(err);
        });
        
        const new_server = new Servers({
            serverID: msg.guild.id,
            prefix: "!",
            delete_timeout: 3000,
            roles: {
                owner: "",
                admin: "",
                dj: "",
                user: "",
                mute: ""
            },
            spam_channels: []
        });
        new_server.save().catch(err => console.error(err));
    
        let guild_members = [];
        msg.guild.members.forEach(member => {
            if(!member.user.bot)
            {
                guild_members.push({
                    serverID: member.guild.id,
                    userID: member.id,
                    level: 0,
                    xp: 0
                });
            }
        });
    
        Users.insertMany(guild_members, err => {
            if(err) console.error(err);
        });
    
        msg.guild.owner.send(`Hi! I just configured your server. Please, set up all required permissions, roles and other useful properties. Have a good time!`).catch(err => {
            if (err) guild.leave();
        });
    }
    else
    {
        msg.channel.send(`Are you sure you want to reset all bot properties in database?\nYou will loose all settings, xp values and warns.\nIf you want to proceed, run following command:\`\`\`${bot.prefix}reconfigure confirm${msg.guild.id}\`\`\``);
    }
}

module.exports.help = {
    name: "reconfigure",
    aliases: [],
    args: [],
    permission: "OWNER",
    description: "reconfigures all bot properties in database"
}
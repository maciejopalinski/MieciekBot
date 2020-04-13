const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    args = args.join(" ");
    msg.delete();
    msg.channel.send(args);
}

module.exports.help = {
    name: "say",
    aliases: [
        "print",
        "send",
        "announce"
    ],
    args: [
        "<text>"
    ],
    permission: "ADMIN",
    description: "sends a message containing <text>"
}
const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    args = args.join(" ");
    msg.delete();
    msg.channel.send(args);
}

module.exports.help = {
    name: "say",
    args: [
        "<text>"
    ],
    permission: "ADMIN",
    description: "sends a message containing <text>"
}
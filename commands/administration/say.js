const Discord = require("discord.js");

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
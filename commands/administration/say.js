const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    await msg.delete();
    msg.channel.send(args.join(' '));
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
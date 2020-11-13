const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let messages = args[0] || 100;

    if(messages >= 2 && messages <= 100)
    {
        await msg.delete();
        msg.channel.bulkDelete(messages).catch(err => bot.sendAndDelete(msg.channel, err.message));
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, this.error.wrong_amount);
    }
}

module.exports.help = {
    name: "clear",
    aliases: [
        "cls",
        "clr",
        "cl"
    ],
    args: [
        "[number]"
    ],
    permission: "ADMIN",
    description: "deletes last 100 or [number] messages from channel"
}

module.exports.error = {
    "wrong_amount": "You can delete 2-100 messages at once."
}
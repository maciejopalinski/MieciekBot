const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
    let messages = args[0] || 100;
    if(messages >= 2 && messages <= 100)
    {
        msg.delete();
        msg.channel.bulkDelete(messages).catch(err => {
            msg.channel.send(err.message).then(msg => msg.delete(bot.delete_timeout));
        });
    }
    else
    {
        msg.delete(bot.delete_timeout);
        msg.channel.send(this.error.wrong_amount).then(msg => msg.delete(bot.delete_timeout));
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
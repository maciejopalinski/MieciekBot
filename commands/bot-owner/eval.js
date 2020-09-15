const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    try {
        const code = args.join(" ");
        let evaled = eval(code);
   
        if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
        let clean_out = clean(evaled);

        if(clean_out.length < 1900) msg.channel.send(clean(evaled), { code: "xl" });
        else throw new Error('Output is longer than 2000 characters.');
    } catch (err) {
        msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}

module.exports.help = {
    name: "eval",
    aliases: [],
    args: [
        "<expression>"
    ],
    permission: "BOT_OWNER",
    description: "evaluates given expression"
}

const clean = (text) => {
    if (typeof(text) === "string")
    {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else return text;
}
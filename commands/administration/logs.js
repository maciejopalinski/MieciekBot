const Discord = require("discord.js");
const Archiver = require("archiver");
const fs = require("fs");
const exec = require("child_process").exec;

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let date = new Date();
    let logs_dirname = __dirname + `/../../logs/`;
    let logs = fs.readdirSync(logs_dirname);

    if(args[0] == "last")
    {
        await msg.author.send({ files: [__dirname + '/../../logs/' + logs.reverse()[0]] });
    }
    else if(args[0] == "all")
    {
        let zip_filename = __dirname + `/../../tmp/mieciekbot-logs-${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.zip`;
        
        let output = fs.createWriteStream(zip_filename);
        let archive = Archiver('zip', {
            zlib: { level: 9 }
        });
        output.on('finish', () => {
            msg.author.send({ files: [zip_filename] }).then(() => {
                exec(`rm ${__dirname}/../../tmp/*.zip`);
            });
        });
        archive.pipe(output);
        archive.directory(logs_dirname, false);
        archive.finalize();
    }
}

module.exports.help = {
    name: "logs",
    aliases: [],
    args: [
        "<last/all>"
    ],
    permission: "BOT_OWNER",
    description: "sends logs to bot owner"
}
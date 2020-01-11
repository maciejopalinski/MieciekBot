const Discord = require("discord.js");
const fs = require("fs");

const bot = new Discord.Client();

bot.prefix = "!";
bot.commands = new Discord.Collection();
bot.command_details = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) throw err;

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0)
    {
        console.log(`ERR: Commands not found!`);
        return;
    }
    jsfiles.forEach((file, index) => {
        let props = require(`./commands/${file}`);
        console.log(`INFO: ${file} loaded`);
        bot.commands.set(props.help.name, props);
        bot.command_details.set(props.help);
    });
});

bot.on('ready', async () => {
    let status = [
        {
            status: "online",
            game: {
                name: "Metallica",
                type: "LISTENING"
            }
        },
        {
            status: "idle",
            game: {
                name: "Visual Studio Code",
                type: "PLAYING"
            }
        }
    ];

    setInterval(function() {
        let index = Math.floor(Math.random() * status.length);
        bot.user.setPresence(status[index]);
    }, 5000);

    console.log(`INFO: Running...`);
});

bot.on('message', async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(bot.prefix.length));
    if(commandfile)
    {
        if(msg.content.startsWith(bot.prefix))
        {
            commandfile.run(bot, msg, args);
        }
    }
});

bot.login(process.env.BOT_TOKEN);
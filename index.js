const Discord = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");

const Settings = require("./models/settings.js");

const bot = new Discord.Client();
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

bot.prefix = "!";
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) throw err;

    console.log(`INFO: Initializing...\n`);
    console.log(`INFO: Starting commands loading...`);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0)
    {
        console.log(`WARN: Commands not found!\n`);
        return;
    }
    jsfiles.forEach((file, index) => {
        let props = require(`./commands/${file}`);
        console.log(`INFO: ${file} loaded`);
        bot.commands.set(props.help.name, props);
    });
    console.log(`INFO: ${jsfiles.length} commands loaded\n`)
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

bot.on('guildCreate', guild => {
    const newSettings = new Settings({
        serverID: guild.id,
        prefix: "!",
        delete_timeout: 2000,
        roles: {
            owner: "",
            admin: "",
            user: ""
        }
    });
    newSettings.save().catch(err => console.log(err));
});

bot.on('guildDelete', guild => {
    Settings.findOneAndDelete({
        serverID: guild.id
    }, (err, res) => {
        res.save().catch(err => console.log(err));
    });
});

bot.on('message', async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    Settings.findOne({
        serverID: msg.guild.id
    }, (err, res) => {
        if(err) console.log(err);

        bot.prefix = res.prefix;
        bot.delete_timeout = res.delete_timeout;
    });

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(bot.prefix.length));
    if(commandfile)
    {
        if(msg.content.startsWith(bot.prefix))
        {
            Settings.findOne({
                serverID: msg.guild.id
            }, (err, res) => {
                if(err) console.log(err);

                let member = msg.member.roles;
                let role_user = res.roles.user;
                let role_admin = res.roles.admin;
                let role_owner = res.roles.owner;

                
                let allowed_roles = [];
                if(commandfile.help.permission === "OWNER")
                {
                    allowed_roles = [role_owner];
                }
                if(commandfile.help.permission === "ADMIN")
                {
                    allowed_roles = [role_owner, role_admin];
                }
                if(commandfile.help.permission === "USER")
                {
                    allowed_roles = [role_owner, role_admin, role_user];
                }

                let role = member.find(role => allowed_roles.includes(role.id));
                if(role)
                {
                    if(args.length >= commandfile.help.args.length)
                    {
                        bot.allowed_roles = [];
                        if(role.id == role_owner)
                        {
                            bot.allowed_roles = ["OWNER", "ADMIN", "USER"];
                        }
                        if(role.id == role_admin)
                        {
                            bot.allowed_roles = ["ADMIN", "USER"];
                        }
                        if(role.id == role_user)
                        {
                            bot.allowed_roles = ["USER"];
                        }
                        commandfile.run(bot, msg, args);
                    }
                    else
                    {
                        let err = `Usage: ${bot.prefix}${commandfile.help.name} `;
                        commandfile.help.args.forEach((value, index) => {
                            err += value;
                        });
                        msg.delete(bot.delete_timeout);
                        msg.channel.send(err).then(msg => msg.delete(bot.delete_timeout));
                    }
                }
                else
                {
                    msg.delete(bot.delete_timeout);
                }
            });
        }
    }
});

bot.login(process.env.BOT_TOKEN);
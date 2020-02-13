const Discord = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const package_info = require("./package.json");

const Settings = require("./models/settings.js");

const bot = new Discord.Client();
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

bot.prefix = "!";
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {
    if(err) throw err;

    console.log(`[INFO] Initializing...\n`);
    console.log(`[INFO] Starting commands loading...`);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0)
    {
        console.log(`[WARN] Commands not found!\n`);
        return;
    }
    jsfiles.forEach((file, index) => {
        let props = require(`./commands/${file}`);
        props.help.aliases.forEach(value => {
            bot.aliases.set(value, props);
        });
        console.log(`[INFO] ${file} loaded`);
        bot.commands.set(props.help.name, props);
    });
    console.log(`[INFO] ${jsfiles.length} commands loaded\n`);
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

    console.log(`[INFO] Running...`);
});

bot.on('guildCreate', guild => {
    const newSettings = new Settings({
        serverID: guild.id,
        prefix: "!",
        delete_timeout: 3000,
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

    await Settings.findOne({
        serverID: msg.guild.id
    }, (err, res) => {
        if(err) console.log(err);

        bot.prefix = res.prefix;
        bot.delete_timeout = res.delete_timeout;
    });

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(bot.prefix.length)) || bot.aliases.get(cmd.slice(bot.prefix.length));
    if(commandfile)
    {
        if(msg.content.startsWith(bot.prefix))
        {
            Settings.findOne({
                serverID: msg.guild.id
            }, (err, res) => {
                if(err) console.log(err);

                let member = msg.member.roles;
                let permission = {
                    actual: -1,
                    nodes: [
                        {
                            name: "@everyone",
                            id: msg.guild.defaultRole.id,
                            allowed_roles: ["@everyone"]
                        },
                        {
                            name: "MUTE",
                            id: res.roles.mute,
                            allowed_roles: ["MUTE"]
                        },
                        {
                            name: "USER",
                            id: res.roles.user,
                            allowed_roles: ["USER"]
                        },
                        {
                            name: "ADMIN",
                            id: res.roles.admin,
                            allowed_roles: ["USER", "ADMIN"]
                        },
                        {
                            name: "OWNER",
                            id: res.roles.owner,
                            allowed_roles: ["USER", "ADMIN", "OWNER"]
                        }
                    ]
                };

                let last_max = -1;
                permission.nodes.forEach((value, index) => {
                    if(member.some(r => r.id == value.id) && index > last_max)
                    {
                        last_max = index;
                    }
                });
                permission.actual = last_max;

                let ok = false;
                permission.nodes.forEach((value, index) => {
                    if(commandfile.help.permission == value.name && last_max >= index)
                    {
                        ok = true;
                    }
                });

                if(ok)
                {
                    let required_args = 0, optional_args = 0;
                    commandfile.help.args.forEach(value => {
                        if(value.startsWith('<'))
                        {
                            required_args += 1;
                        }
                        if(value.startsWith('['))
                        {
                            optional_args += 1;
                        }
                    });
                    
                    if(args.length >= required_args)
                    {
                        bot.settings = {
                            role: permission,
                            version: package_info.version,
                            repository: package_info.repository.url,
                            iconURL: "https://cdn.discordapp.com/avatars/510925936393322497/15784b2d9cf8df572617b493bc79c707.png?size=4096"
                        };

                        if(process.env.DEBUG == "true")
                        {
                            bot.settings.version += "-beta";
                        }

                        commandfile.run(bot, msg, args);
                    }
                    else
                    {
                        let err = `Usage: ${bot.prefix}${commandfile.help.name} ${commandfile.help.args.join(" ")}`;
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
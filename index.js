const Discord = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");
const package_info = require("./package.json");

const Servers = require("./models/servers.js");
const Users = require("./models/users.js");
const Warns = require("./models/warns.js");

const XPCalc = require("./util/experience.js");
const Logging = require("./util/logging.js");

const bot = new Discord.Client();
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

bot.prefix = "!";
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.queue = new Map();
bot.categories = [];
bot.spam_channels = [];

bot.game = { hangman: new Map() };

console.info(`Initializing...\n`);
console.info(`Starting commands loading...`);

let categories = fs.readdirSync("./commands");
let total_commands = 0;
categories.forEach(category => {
    let commands = fs.readdirSync(`./commands/${category}`);
    let jsfiles = commands.filter(f => f.split(".").pop() === "js");
    total_commands += jsfiles.length;
    
    commands.forEach(command => {
        let props = require(`./commands/${category}/${command}`);
        props.help.category = category;

        if(!bot.categories.includes(category))
        {
            bot.categories.push(category);
        }

        props.help.aliases.forEach(value => {
            bot.aliases.set(value, props);
        });
        bot.commands.set(props.help.name, props);

        console.info(`${category}/${command} loaded`);
    });
});

if(total_commands > 0)
{
    console.info(`${total_commands} commands loaded`);
    console.info(`${bot.categories.length} categories loaded\n`);
}
else
{
    console.warn(`Commands not found!\n`);
}

bot.on('ready', () => {
    let status = [
        {
            status: "online",
            game: {
                type: "LISTENING",
                name: "Megadeth"
            }
        },
        {
            status: "online",
            game: {
                type: "LISTENING",
                name: "Slipknot"
            }
        },
        {
            status: "online",
            game: {
                type: "PLAYING",
                name: "Visual Studio Code"
            }
        },
        {
            status: "online",
            game: {
                type: "PLAYING",
                name: `on ${bot.guilds.size} ${bot.guilds.size > 1 ? "servers" : "server"}`
            }
        }
    ];

    setInterval(function () {
        let index = Math.floor(Math.random() * status.length);
        bot.user.setPresence(status[index]);
    }, 5000);

    bot.guilds.forEach(guild => {
        Servers.findOne({
            serverID: guild.id
        }, (err, res) => {
            if(err) console.error(err);

            if(!res)
            {
                let custom_guild = guild;
                guild.members = new Discord.Collection();
                bot.emit('guildCreate', custom_guild);
                console.warn(`Added new guild to the database.\nGuildID: ${guild.id}`);
            }
        });

        guild.members.forEach(member => {
            Users.findOne({
                serverID: guild.id,
                userID: member.id
            }, (err, res) => {
                if(err) console.error(err);

                if(!res && !member.user.bot)
                {
                    bot.emit('guildMemberAdd', member);
                    console.warn(`Added new guild member to the database.\nGuildID: ${guild.id}\nMemberID: ${member.id}`)
                }
            })
        });
    });

    console.info(`Running...`);
});

bot.on('guildCreate', guild => {
    const new_server = new Servers({
        serverID: guild.id,
        prefix: "!",
        delete_timeout: 3000,
        roles: {
            owner: "",
            admin: "",
            dj: "",
            user: "",
            mute: ""
        },
        spam_channels: []
    });
    new_server.save().catch(err => console.error(err));

    let guild_members = [];
    guild.members.forEach(member => {
        if(!member.user.bot)
        {
            guild_members.push({
                serverID: member.guild.id,
                userID: member.id,
                level: 0,
                xp: 0
            });
        }
    });

    Users.insertMany(guild_members, err => {
        if(err) console.error(err);
    });

    let owner = bot.users.get(guild.ownerID);
    if(!owner) guild.leave();
    
    owner.send(`Hi! I just configured your '${guild.name}' server. Please, set up all required permissions, roles and other useful properties. Have a good time!`);
});

bot.on('guildDelete', guild => {
    Servers.findOneAndDelete({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });

    Users.deleteMany({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });

    Warns.deleteMany({
        serverID: guild.id
    }, err => {
        if(err) console.error(err);
    });
});

bot.on('guildMemberAdd', member => {
    const new_member = new Users({
        serverID: member.guild.id,
        userID: member.id,
        level: 0,
        xp: 0
    });
    new_member.save().catch(err => console.error(err));
});

bot.on('guildMemberRemove', member => {
    Users.findOneAndDelete({
        serverID: member.guild.id,
        userID: member.id
    }, err => {
        if(err) console.error(err);
    });

    Warns.deleteMany({
        serverID: member.guild.id,
        userID: member.id
    }, err => {
        if(err) console.error(err);
    })
});

bot.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;

    await Servers.findOne({
        serverID: msg.guild.id
    }, (err, res) => {
        if (err) console.error(err);

        if (!res)
        {
            msg.channel.send(`Oops! I did not properly configure your server... Please, invite me once again. https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8`);
            return msg.guild.leave();
        }

        bot.prefix = res.prefix;
        bot.delete_timeout = res.delete_timeout;
        bot.spam_channels = res.spam_channels;
    });

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(bot.prefix.length)) || bot.aliases.get(cmd.slice(bot.prefix.length));
    if (msg.content.startsWith(bot.prefix) && commandfile)
    {
        Servers.findOne({
            serverID: msg.guild.id
        }, (err, res) => {
            if (err) console.error(err);

            if (!res)
            {
                msg.channel.send(`Oops! I did not properly configure your server... Please, invite me once again. https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8`);
                return msg.guild.leave();
            }

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
                        name: "DJ",
                        id: res.roles.dj,
                        allowed_roles: ["USER", "DJ"]
                    },
                    {
                        name: "ADMIN",
                        id: res.roles.admin,
                        allowed_roles: ["USER", "DJ", "ADMIN"]
                    },
                    {
                        name: "OWNER",
                        id: res.roles.owner,
                        allowed_roles: ["USER", "DJ", "ADMIN", "OWNER"]
                    },
                    {
                        name: "BOT_OWNER",
                        id: "510925936393322497",
                        allowed_roles: ["USER", "DJ", "ADMIN", "OWNER", "BOT_OWNER"]
                    }
                ]
            };

            let last_max = -1;
            permission.nodes.forEach((value, index) => {
                if (member.some(r => r.id == value.id) && index > last_max)
                {
                    last_max = index;
                }
            });
            permission.actual = last_max;
            
            if(msg.author.id == msg.guild.ownerID)
            {
                permission.actual = permission.nodes.findIndex(n => n.name == "OWNER");
                last_max = permission.actual;
            }
            if(msg.author.id == "510925936393322497")
            {
                permission.actual = permission.nodes.findIndex(n => n.name == "BOT_OWNER");
                last_max = permission.actual;
            }

            let ok = false;
            permission.nodes.forEach((value, index) => {
                if (commandfile.help.permission == value.name && last_max >= index)
                {
                    ok = true;
                }
            });

            if (ok)
            {
                let required_args = 0, optional_args = 0;
                commandfile.help.args.forEach(value => {
                    if (value.startsWith('<'))
                    {
                        required_args += 1;
                    }
                    if (value.startsWith('['))
                    {
                        optional_args += 1;
                    }
                });

                if (args.length >= required_args)
                {
                    bot.settings = {
                        role: permission,
                        version: package_info.version,
                        repository: package_info.repository.url,
                        iconURL: "https://cdn.discordapp.com/avatars/510925936393322497/15784b2d9cf8df572617b493bc79c707.png?size=4096"
                    };

                    if (process.env.DEBUG == "true")
                    {
                        bot.settings.version += "-dev";
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
    else if(!bot.spam_channels.includes(msg.channel.id))
    {
        Users.findOne({
            serverID: msg.guild.id,
            userID: msg.member.id
        }, (err, res) => {
            if (err) console.error(err);

            if(!res)
            {
                const new_user = new Users({
                    serverID: msg.guild.id,
                    userID: msg.member.id,
                    level: 0,
                    xp: 0
                });

                new_user.save();
            }
            else
            {
                res.xp += 1;

                if(res.xp >= XPCalc.getXp(res.level + 1))
                {
                    res.level += 1;
                    msg.channel.send(`${msg.member.displayName} advanced to level ${res.level}!`);
                }

                res.save();
            }
        })
    }
});

bot.login(process.env.BOT_TOKEN);

process.on("SIGUSR1", () => console.info("Exiting..."));
process.on("SIGUSR2", () => console.info("Exiting..."));
process.on("SIGINT", () => console.info("Exiting..."));
const {bot} = require("../index.js");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const EmojiRegex = require("emoji-regex");
const package_info = require("../package.json");
const Server = require("../models/server.js");
const User = require("../models/user.js");
const XPCalc = require("../util/experience.js");

bot.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;

    await Server.findOne({
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
        Server.findOne({
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
                        id: msg.guild.roles.everyone.id,
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
                if (member.cache.some(r => r.id == value.id) && index > last_max)
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
                    msg.delete({ timeout: bot.delete_timeout });
                    msg.channel.send(err).then(msg => msg.delete({ timeout: bot.delete_timeout }));
                }
            }
            else
            {
                msg.delete({ timeout: bot.delete_timeout });
            }
        });
    }
    else if(!bot.spam_channels.includes(msg.channel.id))
    {
        User.findOne({
            serverID: msg.guild.id,
            userID: msg.member.id
        }, (err, res) => {
            if (err) console.error(err);

            if(!res)
            {
                const new_user = new User({
                    serverID: msg.guild.id,
                    userID: msg.member.id,
                    level: 0,
                    xp: 0
                });

                new_user.save();
            }
            else
            {
                const regex = EmojiRegex();

                // remove spaces, @everyone, @here, custom discord emojis and unicode emojis
                msg.content = msg.content
                .replace(/\s/g, "")
                .replace(/@everyone/g, "")
                .replace(/@here/g, "")
                .replace(/<:[A-Za-z0-9_]+:[0-9]+>/g, "")
                .replace(regex, "");

                // <@!> - user
                // <#> - channel
                // <@&> - role
                // remove channel, role and user mentions
                let length = msg.content.length;
                length -= msg.mentions.channels.size * 21;
                length -= msg.mentions.roles.size * 22;
                length -= msg.mentions.users.size * 22;

                let add_exp = length <= 3 ? 0 : parseFloat((length/20).toFixed(2));
                if(add_exp > 2) add_exp = 2;

                res.xp += add_exp;

                if(res.xp >= XPCalc.getXp(res.level + 1))
                {
                    res.level += 1;
                    msg.channel.send(`<@${msg.member.id}> advanced to level ${res.level}!`);
                }

                res.save();
            }
        })
    }
});
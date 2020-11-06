const {bot} = require("../index.js");
const EmojiRegex = require("emoji-regex");

bot.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;

    let guild = await bot.db_manager.getServer(msg.guild.id);
    if (!guild) return msg.channel.send(`Oops! I did not properly configure your server... Please, invite me once again. ${bot.generateBotInvite()}`).then(msg => msg.guild.leave());
    bot.prefix = guild.prefix;
    bot.delete_timeout = guild.delete_timeout;
    bot.spam_channels = guild.spam_channels;

    let messageArray = msg.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    let commandfile = bot.command_manager.commands.get(cmd.slice(bot.prefix.length)) || bot.command_manager.aliases.get(cmd.slice(bot.prefix.length));
    if (msg.content.startsWith(bot.prefix) && commandfile)
    {
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
            if (member.cache.some(r => r.id == value.id) && index > last_max) last_max = index;
        });
        permission.actual = last_max;
        
        if (msg.author.id == msg.guild.ownerID)
        {
            permission.actual = permission.nodes.findIndex(n => n.name == "OWNER");
            last_max = permission.actual;
        }
        if (msg.author.id == "510925936393322497")
        {
            permission.actual = permission.nodes.findIndex(n => n.name == "BOT_OWNER");
            last_max = permission.actual;
        }

        let ok = false;
        permission.nodes.forEach((value, index) => {
            if (commandfile.help.permission == value.name && last_max >= index) ok = true;
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

            // all ok, run command
            if (args.length >= required_args)
            {
                bot.roles = permission;
                if (process.env.DEBUG == "true") bot.settings.version += "-dev";
                commandfile.run(bot, msg, args);
            }
            else
            {
                let err = `Usage: ${bot.prefix}${commandfile.help.name} ${commandfile.help.args.join(" ")}`;
                msg.delete({ timeout: bot.delete_timeout });
                bot.sendAndDelete(msg.channel, err)
            }
        }
        // no permissions
        else msg.delete({ timeout: bot.delete_timeout });
    }
    else if(!bot.spam_channels.includes(msg.channel.id))
    {
        let user = await bot.db_manager.getUser(msg.guild.id, msg.member.id);
        if(!user) bot.emit('guildMemberAdd', { id: msg.member.id, guild: { id: msg.guild.id } });
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

            // REMOVE MENTIONS
            // <#> - channels
            // <@&> - roles
            // <@!> - users
            let length = msg.content.length;
            length -= msg.mentions.channels.size * 21;
            length -= msg.mentions.roles.size * 22;
            length -= msg.mentions.users.size * 22;

            let add_exp = length <= 3 ? 0 : parseFloat((length/20).toFixed(2));
            if(add_exp > 2) add_exp = 2;
            user.xp += add_exp;

            if(user.xp >= bot.db_manager.exp_system.getEXP(user.level + 1))
            {
                user.level += 1;
                msg.channel.send(`<@${msg.member.id}> advanced to level ${user.level}!`);
            }
            user.save();
        }
    }
});
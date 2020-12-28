import { bot } from '../';
import { PermissionNodesManager, RolePermissionNode } from '../lib';

import EmojiRegex from 'emoji-regex';
import { IUser } from '../models';

bot.on('message', async msg => {
    if (msg.author.bot) return;
    if (msg.channel.type === 'dm') return;

    let guild = await bot.db_manager.getGuild(msg.guild.id);
    if (!guild) return msg.channel.send(`Oops! I did not properly configure your server... Please, invite me once again. ${bot.generateBotInvite()}`).then(msg => msg.guild.leave());
    
    bot.prefix = guild.prefix;
    bot.delete_timeout = guild.delete_timeout;
    bot.spam_channels = guild.spam_channels;
    
    bot.setAnnounceChannel(guild.announce.channel_id);
    bot.setAnnounceOptions(guild);

    let messageArray = msg.content.split(' ');
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    let command = bot.command_manager.getCommand(cmd.slice(bot.prefix.length));
    if (msg.content.startsWith(bot.prefix) && command)
    {
        let nodes = new PermissionNodesManager(msg.guild);
        nodes.addNode(new RolePermissionNode('MUTE',  guild.roles.mute,  1));
        nodes.addNode(new RolePermissionNode('USER',  guild.roles.user,  2));
        nodes.addNode(new RolePermissionNode('DJ',    guild.roles.dj,    3, ['USER', 'DJ']));
        nodes.addNode(new RolePermissionNode('ADMIN', guild.roles.admin, 4, ['USER', 'DJ', 'ADMIN']));
        nodes.addNode(new RolePermissionNode('OWNER', guild.roles.owner, 5, ['USER', 'DJ', 'ADMIN', 'OWNER']));

        bot.roles = { user: nodes.getMemberNode(msg.member), manager: nodes };

        if (nodes.hasCommandPermission(command, msg.member))
        {
            let required_args = 0, optional_args = 0;
            command.args_array.forEach(value => {
                if (value.startsWith('<')) required_args += 1;
                if (value.startsWith('[')) optional_args += 1;
            });

            // all required arguments are present, run a command
            if (args.length >= required_args)
            {
                command.execute(bot, msg, args).catch(err => {
                    console.error(err);
                    
                    if(bot.debug) msg.channel.send(`**ERROR:** \`\`\`xl\n${err.stack}\n\`\`\``);
                    else msg.channel.send('Unknown error occurred!');
                });
            }
            else
            {
                let err = `Usage: ${bot.prefix}${command.help.name} ${command.help.args}`;
                bot.deleteMsg(msg);
                bot.sendAndDelete(msg.channel, err)
            }
        }
        // no permissions
        else bot.deleteMsg(msg);
    }
    else if(!bot.spam_channels.includes(msg.channel.id))
    {
        let user = await bot.db_manager.getUser(msg.guild.id, msg.member.id);
        if(!user)
        {
            // if user does not exist in database, insert him
            await bot.db_manager.models.User.create({
                guildID: msg.guild.id,
                userID: msg.member.id
            }).catch(err => console.error);
        }
        else
        {
            // remove spaces, @everyone, @here, custom discord emojis and unicode emojis
            msg.content = msg.content
            .replace(/\s/g, '')
            .replace(/@everyone/g, '')
            .replace(/@here/g, '')
            .replace(/<:[A-Za-z0-9_]+:[0-9]+>/g, '')
            .replace(EmojiRegex(), '');

            // REMOVE MENTIONS
            // <#> - channels
            // <@&> - roles
            // <@!> - users
            let length = msg.content.length;
            length -= msg.mentions.channels.size * 21;
            length -= msg.mentions.roles.size * 22;
            length -= msg.mentions.users.size * 22;

            let add_exp = length <= 3 ? 0 : parseFloat((length/20).toFixed(2));
            if(add_exp > 4) add_exp = 4;
            user.xp += add_exp;

            if(user.xp >= bot.db_manager.exp_system.getExperience(user.level + 1))
            {
                user.level += 1;
                bot.announce(msg.channel, `<@${msg.member.id}> advanced to level ${user.level}!`);
            }
            user.save();
        }
    }
});
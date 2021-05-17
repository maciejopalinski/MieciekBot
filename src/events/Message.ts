import { Message } from 'discord.js';
import EmojiRegex from 'emoji-regex';
import { Client } from '../lib/';
import { User } from '../models/';

export const onMessage = async (client: Client, msg: Message) => {
    
    if (msg.author.bot) return;
    if (msg.channel.type === 'dm') return;

    let guild = client.guild_manager.guilds.get(msg.guild.id);
    if (!guild) return msg.channel.send(`Oops! I did not properly configure your server... Please, invite me once again. ${client.generateBotInvite()}`).then(msg => msg.guild.leave());

    let prefix = guild.prefix;

    let messageArray = msg.content.split(' ');
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    let command = client.command_manager.getCommand(cmd.slice(guild.prefix.length));
    if (msg.content.startsWith(guild.prefix) && command)
    {
        let node_manager = client.guild_manager.guild_permission_manager.get(msg.guild.id);
        await client.guild_manager.guild_users.get(msg.guild.id).fetchDiscord(msg.member);

        if (node_manager.hasCommandPermission(command, msg.member))
        {
            let required_args = 0, optional_args = 0;
            command.help.args.split(' ').forEach(value => {
                if (value.startsWith('<')) required_args += 1;
                if (value.startsWith('[')) optional_args += 1;
            });

            // all required arguments are present, run a command
            if (args.length >= required_args)
            {
                command.execute(client, msg, args).catch(err => {
                    console.error(err);
                    
                    if(client.debug) msg.channel.send(`**ERROR:** \`\`\`xl\n${err.stack}\n\`\`\``);
                    else msg.channel.send('Unknown error occurred!');
                });
            }
            else
            {
                let err = `Usage: ${prefix}${command.help.name} ${command.help.args}`;
                client.deleteMsg(msg);
                client.sendAndDelete(msg.channel, err)
            }
        }
        // no permissions
        else client.deleteMsg(msg);
    }
    else if(!guild.spam_channels.includes(msg.channel.id))
    {
        let user = await client.db_manager.getUser(msg.guild.id, msg.member.id);
        if(!user)
        {
            // if user does not exist in database, create it
            await User.create({
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

            if(user.xp >= client.db_manager.exp_system.getExperience(user.level + 1))
            {
                user.level += 1;
                client.announce(msg.guild, `<@${msg.member.id}> advanced to level ${user.level}!`, msg.channel);
            }
            user.save();
        }
    }
}

export default (client: Client) => {
    client.on('message', async msg => onMessage(client, msg));
}
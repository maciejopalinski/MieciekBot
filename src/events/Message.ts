import { Message } from 'discord.js';
import EmojiRegex from 'emoji-regex';
import { Client } from '../lib/';
import { User } from '../models/';

export const onMessageCreate = async (client: Client, msg: Message) => {

    if (msg.author.bot) return;
    if (msg.channel.type === 'DM') return;

    let guild = client.guild_manager.getGuildConfig(msg.guild.id);
    if (!guild) {
        msg.channel.send(`Oops! I did not properly configure your server... Please, invite me once again. ${client.generateBotInvite()}`)
        .then(msg => msg.guild.leave());
        return;
    }

    let prefix = guild.prefix;
    let messageArray = msg.content.split(/ +/);
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    let command = client.command_manager.getCommand(cmd.slice(guild.prefix.length));
    if (msg.content.startsWith(guild.prefix) && command)
    {
        let node_manager = client.guild_manager.getPermissionManager(msg.guild.id);
        await client.guild_manager.fetchUser(msg.member);

        if (node_manager.hasCommandPermission(command, msg.member))
        {
            let { required } = client.command_manager.calculateArgs(command);

            // if all required arguments are present, run a command
            if (args.length >= required)
            {
                command.executeFromMessage(client, msg, args).catch(err => {
                    console.error(err);

                    if(client.debug) {
                        msg.channel.send(`**ERROR:** \`\`\`xl\n${err.stack}\n\`\`\``);
                    }
                    else {
                        msg.channel.send('Unknown error occurred!');
                    }
                });
            }
            else
            {
                let err = `Usage: ${prefix}${command.data.name} ${command.args}`;
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
            msg.content = msg.content
            .replace(/\s/g, '')                            // remove spaces
            .replace(/@everyone/g, '')                     // remove @everyone
            .replace(/@here/g, '')                         // remove @here
            .replace(/<(?::\w+:|@!*&*|#)[0-9]+>/g, '')     // remove mentions (user, role, channel, custom emoji)
            .replace(EmojiRegex(), '');                    // remove unicode emojis

            let length = msg.content.length;
            let add_exp = length <= 3 ? 0 : length / 20;
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
    client.on('messageCreate', msg => onMessageCreate(client, msg));
}
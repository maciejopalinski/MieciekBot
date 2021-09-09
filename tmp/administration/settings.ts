import { MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Settings = new Command();

Settings.execute = async (bot, msg, args) => {

    let { prefix, delete_timeout, roles, spam_channels, announce } = bot.guild_manager.getGuildConfig(msg.guild.id);
    let permission_manager = bot.guild_manager.getPermissionManager(msg.guild.id);

    if(!args[0])
    {
        let spam_channels_info = '[]';
        if(spam_channels.length >= 1) spam_channels_info = `[<#${spam_channels.join('>, <#')}>]`;

        let help = new MessageEmbed(bot, msg.guild)
        .setTitle('Settings:')
        .addField('prefix', prefix)
        .addField('delete_timeout', delete_timeout.toString())
        .addField('spam_channels', spam_channels_info);

        permission_manager.nodes.forEach(node => {
            if(node instanceof RolePermissionNode && node.name != '@everyone') {
                help.addField(`role:${node.name.toLowerCase()}`, `<@&${node.role_id}> (${node.role_id})`);
            }
        });

        help.addField('anc:channel', `<#${announce.channel_id}> (${announce.channel_id})`);
        help.addField(`anc:add_member`, announce.toggles.add_member ? 'true' : 'false', true);
        help.addField(`anc:remove_member`, announce.toggles.remove_member ? 'true' : 'false', true);

        msg.channel.send({ embeds: [help] });
    }
    else if(args[1])
    {
        let key = args[0], value = args.slice(1)[0];

        let settings = await bot.db_manager.getGuild(msg.guild.id);
        if(!settings)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.unknown);
        }
        
        let info = undefined;
        if(key == 'prefix')
        {
            settings.prefix = value;
            info = `'${value}'`;
        }
        else if(key == 'delete_timeout')
        {
            settings.delete_timeout = parseInt(value);
            info = `'${value}'`;
        }
        else if(key.startsWith('role:'))
        {
            let new_role = msg.mentions.roles.first() || msg.guild.roles.cache.find(role => role.id == value) || undefined;
            
            if(!new_role)
            {
                bot.deleteMsg(msg);
                return bot.sendAndDelete(msg.channel, error.not_found);
            }
            
            permission_manager.nodes.forEach(node => {
                if(node instanceof RolePermissionNode && node.name != '@everyone' && key == `role:${node.name.toLowerCase()}`)
                {
                    settings.roles[node.name.toLowerCase()] = new_role.id;
                    info = `<@&${new_role.id}> (${new_role.id})`;
                }
            });
        }
        else if(key.startsWith('anc:'))
        {
            if(key == 'anc:channel')
            {
                let new_channel = msg.mentions.channels.first();
                if(new_channel)
                {
                    settings.announce.channel_id = new_channel.id;
                    info = `<#${new_channel.id}> (${new_channel.id})`;
                }
                else if(value == 'clear')
                {
                    settings.announce.channel_id = '000000000';
                    info = `<#000000000> (000000000)`;
                }
                else return msg.channel.send(`This channel cannot be found on the server.\nIf you want to remove \`anc:channel\` property, run: \`${prefix}settings anc:channel clear\``);
            }
            else {
                for (let anc_key in announce.toggles) {
                    if(key == `anc:${anc_key}`) {
                        if(value == 'true') settings.announce.toggles[anc_key] = true
                        else if(value == 'false') settings.announce.toggles[anc_key] = false
                        else {
                            bot.deleteMsg(msg);
                            return bot.sendAndDelete(msg.channel, 'Acceptable values are: `true`, `false`');
                        }
                        info = `${settings.announce.toggles[anc_key]}`;
                    }
                }
            }
        }
        else if(key == 'spam_channels')
        {
            let channel = msg.mentions.channels.first();
            if(!channel)
            {
                bot.deleteMsg(msg);
                return bot.sendAndDelete(msg.channel, error.no_value(prefix));
            }

            if(value == 'add')
            {
                let exists = settings.spam_channels.includes(channel.id);
                if(!exists) settings.spam_channels.push(channel.id);
            }
            else if(value == 'remove') settings.spam_channels = settings.spam_channels.filter(e => e != channel.id);

            info = '[]';
            if(settings.spam_channels.length >= 1) info = `[<#${settings.spam_channels.join('>, <#')}>]`;
        }

        let saved = await settings.save();
        // await bot.guild_manager.fetchOne(saved);
        // not needed because of /src/events/Database.ts change stream

        if(info) msg.channel.send(`Successfully changed '${key}' value to ${info}.`);
        else
        {
            bot.deleteMsg(msg);
            bot.sendAndDelete(msg.channel, error.setting_not_found);
        }
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.no_value(prefix));
    }
}

Settings.help = {
    name: 'settings',
    args: '[key] [value | @role | #channel]',
    aliases: ['options', 'config'],
    description: 'edits the server settings',
    permission: 'OWNER'
};

const error = Settings.error = {
    no_value: (prefix: string) => `No value specified.\nUsage: \`${prefix}settings ${Settings.help.args}\``,

    not_found: "Role with that ID was not found on the server.",
    setting_not_found: "That settings was not found in the database.",
    unknown: "Unknown error occurred. Please, try again later."
};

export default Settings;
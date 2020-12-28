import { Role } from 'discord.js';
import { MessageEmbed, Command, RolePermissionNode } from '../../lib';

const Settings = new Command();

Settings.execute = async (bot, msg, args) => {
    if(!args[0])
    {
        let spam_channels_info = '[]';
        if(bot.spam_channels.length >= 1) spam_channels_info = `[<#${bot.spam_channels.join('>, <#')}>]`;

        let help = new MessageEmbed(bot, msg.guild)
        .setTitle('Settings:')
        .addField('prefix', bot.prefix)
        .addField('delete_timeout', bot.delete_timeout)
        .addField('spam_channels', spam_channels_info);

        bot.roles.manager.permission_nodes.forEach(node => {
            if(node instanceof RolePermissionNode && node.name != '@everyone') {
                help.addField(`role:${node.name.toLowerCase()}`, `<@&${node.role_id}> (${node.role_id})`);
            }
        });

        help.addField('anc:channel', `<#${bot.announce_options.channel_id}> (${bot.announce_options.channel_id})`);
        for (let key in bot.announce_options.toggles) {
            help.addField(`anc:${key}`, bot.announce_options.toggles[key], true);
        }

        msg.channel.send(help);
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
            
            bot.roles.manager.permission_nodes.forEach(node => {
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
                else return msg.channel.send(`This channel cannot be found on the server.\nIf you want to remove \`anc:channel\` property, run: \`${bot.prefix}settings anc:channel clear\``);
            }
            else {
                for (let anc_key in bot.announce_options.toggles) {
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
                return bot.sendAndDelete(msg.channel, error.no_value(bot));
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

        settings.save();
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
        bot.sendAndDelete(msg.channel, error.no_value(bot));
    }
}

Settings.setHelp({
    name: 'settings',
    args: '[key] [value | @role | #channel]',
    aliases: ['options', 'config'],
    description: 'edits the server settings',
    permission: 'OWNER'
});

const error = Settings.error = {
    /** @param {Client} bot */
    no_value: (bot) => `No value specified.\nUsage: \`${bot.prefix}settings ${Settings.help.args}\``,

    not_found: "Role with that ID was not found on the server.",
    setting_not_found: "That settings was not found in the database.",
    unknown: "Unknown error occurred. Please, try again later."
};

export default Settings;
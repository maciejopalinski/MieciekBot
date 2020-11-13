const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
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
            if(node.name != '@everyone' && node.name != 'BOT_OWNER') help.addField(`role:${node.name.toLowerCase()}`, `<@&${node.role_id}> (${node.role_id})`);
        });

        msg.channel.send(help);
    }
    else if(args[1])
    {
        let key = args[0], value = args.slice(1).join(' ');

        let settings = await bot.db_manager.getServer(msg.guild.id);
        if(!settings)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, this.error.unknown);
        }
        
        let info = undefined;
        if(key == 'prefix')
        {
            settings.prefix = value;
            info = `'${value}'`;
        }
        else if(key == 'delete_timeout')
        {
            settings.delete_timeout = value;
            info = `'${value}'`;
        }
        else if(key.startsWith('role:'))
        {
            let new_role = msg.mentions.roles.first() || msg.guild.roles.find(role => role.id == value) || undefined;
            
            if(!new_role)
            {
                bot.deleteMsg(msg);
                return bot.sendAndDelete(msg.channel, this.error.not_found);
            }
            
            bot.roles.manager.permission_nodes.forEach(node => {
                if(node.name != '@everyone' && key == `role:${node.name.toLowerCase()}`)
                {
                    // TODO: is this secure? i think it is, but...
                    eval(`settings.roles.${node.name.toLowerCase()} = new_role.id;`);
                    info = `<@&${new_role.id}> (${new_role.id})`;
                }
            });
        }
        else if(key == 'spam_channels')
        {
            if(value == 'add')
            {
                let exists = settings.spam_channels.some(v => v == msg.channel.id);
                if(!exists) settings.spam_channels.push(msg.channel.id);
            }
            else if(value == 'remove') settings.spam_channels = settings.spam_channels.filter(e => e != msg.channel.id);

            info = '[]';
            if(settings.spam_channels.length >= 1) info = `[<#${settings.spam_channels.join('>, <#')}>]`;
        }

        settings.save();
        if(info) msg.channel.send(`Successfully changed '${key}' value to ${info}.`);
        else
        {
            bot.deleteMsg(msg);
            bot.sendAndDelete(msg.channel, this.error.setting_not_found);
        }
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, this.error.no_value);
    }
}

module.exports.help = {
    name: "settings",
    aliases: [
        "sett",
        "options",
        "config"
    ],
    args: [
        "[key]",
        "[value | @role]"
    ],
    permission: "OWNER",
    description: "edits the server settings"
}

module.exports.error = {
    "no_value": "No value specified.\nUsage: !settings [key] [value | @role]",
    "not_found": "Role with that ID was not found on the server.",
    "setting_not_found": "That settings was not found in the database.",
    "unknown": "Unknown error occurred. Please, try again later."
}
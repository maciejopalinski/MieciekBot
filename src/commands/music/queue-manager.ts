import { Command, MessageEmbed } from "../../lib";

const QueueManager = new Command();

QueueManager.execute = async (bot, msg, args) => {
    let alias = msg.content.split(' ')[0].slice(bot.prefix.length);
    let subcommand = args[0];
    let subcommand_args = args.slice(1);

    if((subcommand != 'list' && subcommand_args.length < 1) || !subcommand)
    {
        let subcommands_embed = new MessageEmbed(bot, msg.guild, false)
        .setTitle('Queue Manager: Subcommands')
        .addField(`${bot.prefix}${alias} list`, 'lists all saved queues')
        .addField(`${bot.prefix}${alias} view <name>`, 'views content of saved queue')
        .addField(`${bot.prefix}${alias} save <name>`, 'saves current queue')
        .addField(`${bot.prefix}${alias} load <name>`, 'loads saved queue')
        .addField(`${bot.prefix}${alias} delete <name>`, 'deletes saved queue');

        return msg.channel.send(subcommands_embed);
    }

    let queue_name = subcommand_args.join(' ');
    if(subcommand == 'list')
    {
        let qm_list_embed = new MessageEmbed(bot, msg.guild)
        .setTitle('Server Saved Playlists')
        .setDescription(`Run \`${bot.prefix}${alias} view <name>\` to view content of the queue.`);

        let all_queues = await bot.db_manager.getAllSavedQueues(msg.guild.id);

        // TODO: make pages to list subcommand to allow > 20 queues
        if(all_queues.length > 20) return msg.channel.send('There are more than 20 queues in the database. Work in progress!');

        all_queues.forEach(queue => {
            qm_list_embed.addField(queue.name, `Total tracks: ${queue.urls.length}`);
        });
        if(all_queues.length < 1) qm_list_embed.addField('There are no saved playlists for this server.', `Save some more using \`${bot.prefix}${alias} save <name>\` command!`);

        return msg.channel.send(qm_list_embed);
    }
    else if(subcommand == 'view')
    {
        let found_embed = new MessageEmbed(bot, msg.guild);
        let found_queue = await bot.db_manager.getSavedQueue(msg.guild.id, queue_name);
        if(!found_queue) found_embed.addField(`Queue with name *'${queue_name}'* was not found in the database.`, '\u200b');
        else {
            found_embed.setTitle(`Queue: '${queue_name}'`);

            let length = found_queue.urls.length;
            for (let i = 0; i < Math.min(found_queue.urls.length, 10); i++)
            {
                const url = found_queue.urls[i];
                let song = await bot.music_manager.getBasicInfo(url);
                found_embed.addField(song.videoDetails.title, url);
                length--;
            }
            if(length > 0) found_embed.addField('\u200b', `And... ${length} more...`);
        }

        msg.channel.send(found_embed);
    }
    else if(subcommand == 'save')
    {
        let server_queue = bot.music_manager.get(msg.guild.id);
        if(!server_queue) {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, 'There must be something in queue to save it for later!');
        }
        else if(queue_name.length < 3 || queue_name.length > 96) {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, 'Queue name must be 3-96 charaters long!');
        } else {
            await server_queue.saveQueue(queue_name);
        }
    }
    else if(subcommand == 'load')
    {
        let server_queue = bot.music_manager.get(msg.guild.id);
        if(server_queue) {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, 'There is a current queue playing at the moment. Please stop it.');
        }

        let found_queue = await bot.db_manager.getSavedQueue(msg.guild.id, queue_name);
        if(!found_queue) msg.channel.send(new MessageEmbed(bot, msg.guild).addField(`Queue with name *'${queue_name}'* was not found in the database.`, '\u200b'));
        else {
            bot.command_manager.getCommand('play').execute(bot, msg, undefined, found_queue);
        }
    }
    else if(subcommand == 'delete')
    {
        await (await bot.db_manager.getSavedQueue(msg.guild.id, queue_name)).delete();
        msg.channel.send(new MessageEmbed(bot, msg.guild).addField(`Queue with name *'${queue_name}'* was successfull deleted from the database.`, '\u200b'));
    }
    else {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.subcmd_notfound);
    }
}

QueueManager.help = {
    name: 'queue-manager',
    args: '[subcommand]',
    aliases: ['qman', 'qmanager', 'queueman'],
    description: 'manages saved queues, run with no args to show subcommands',
    permission: 'ADMIN'
};

const error = QueueManager.error = {
    music_play: "Queue is empty.",
    subcmd_notfound: "That subcommand was not found. Run commands with no args to show subcommands."
};

export default QueueManager;
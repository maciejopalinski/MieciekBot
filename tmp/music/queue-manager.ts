import { Command, MessageEmbed } from '../../lib';
import { SavedQueue } from '../../models';

const QueueManager = new Command();

QueueManager.execute = async (bot, msg, args) => {
    let { prefix } = bot.guild_manager.getGuildConfig(msg.guild.id);

    let alias = msg.content.split(' ')[0].slice(prefix.length);
    let subcommand = args[0];
    let subcommand_args = args.slice(1);

    if((subcommand != 'list' && subcommand_args.length < 1) || !subcommand)
    {
        let subcommands_embed = new MessageEmbed(bot, msg.guild, false)
        .setTitle('Queue Manager: Subcommands')
        .addField(`${prefix}${alias} list`, 'lists all saved queues')
        .addField(`${prefix}${alias} view <name>`, 'views content of saved queue')
        .addField(`${prefix}${alias} save <name>`, 'saves current queue')
        .addField(`${prefix}${alias} load <name>`, 'loads saved queue')
        .addField(`${prefix}${alias} delete <name>`, 'deletes saved queue')
        .addField(`${prefix}${alias} share <name>`, 'creates unique id to share playlist across servers')
        .addField(`${prefix}${alias} import <id>`, 'imports playlist to current server');

        return msg.channel.send({ embeds: [subcommands_embed] });
    }

    let queue_name = subcommand_args.join(' ');
    if(subcommand == 'list')
    {
        let qm_list_embed = new MessageEmbed(bot, msg.guild)
        .setTitle('Server Saved Playlists')
        .setDescription(`Run \`${prefix}${alias} view <name>\` to view content of the queue.`);

        let all_queues = await bot.db_manager.getAllSavedQueues(msg.guild.id);

        // TODO: make pages to list subcommand to allow > 20 queues
        if(all_queues.length > 20) return msg.channel.send('There are more than 20 queues in the database. Work in progress!');

        all_queues.forEach(queue => {
            qm_list_embed.addField(queue.name, `Total tracks: ${queue.urls.length}`);
        });
        if(all_queues.length < 1) qm_list_embed.addField('There are no saved playlists for this server.', `Save some more using \`${prefix}${alias} save <name>\` command!`);

        return msg.channel.send({ embeds: [qm_list_embed] });
    }
    else if(subcommand == 'view')
    {
        let found_embed = new MessageEmbed(bot, msg.guild);
        let found_queue = await bot.db_manager.getSavedQueue(msg.guild.id, queue_name);
        if(!found_queue) {
            found_embed.addField(`Queue with name *'${queue_name}'* was not found in the database.`, '\u200b');
        }
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

        msg.channel.send({ embeds: [found_embed] });
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
        }
        else {
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
        if(!found_queue) {
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField(`Queue with name *'${queue_name}'* was not found in the database.`, '\u200b')
                ]
            });
        }
        else {
            bot.command_manager.getCommand('play').execute(bot, msg, undefined, found_queue);
        }
    }
    else if(subcommand == 'delete')
    {
        await (await bot.db_manager.getSavedQueue(msg.guild.id, queue_name)).delete();

        msg.channel.send({
            embeds: [
                new MessageEmbed(bot, msg.guild)
                .addField(`Queue with name *'${queue_name}'* was successfull deleted from the database.`, '\u200b')
            ]
        });
    }
    else if(subcommand == 'share')
    {
        let found_queue = await bot.db_manager.getSavedQueue(msg.guild.id, queue_name);
        if(!found_queue) {
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField(`Queue with name *'${queue_name}'* was not found in the database.`, '\u200b')
                ]
            });
        }
        else {
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField('To import queue in another server, run following command:', `\`${prefix}${alias} import ${found_queue.queueID}\``)
                ]
            });
        }
    }
    else if(subcommand == 'import')
    {
        let id = queue_name;

        let found_queue = await SavedQueue.findOne({ queueID: id });
        let same_name = await SavedQueue.findOne({ guildID: msg.guild.id, name: found_queue.name });
        if(!found_queue) {
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField(`Queue with ID *'${id}'* was not found in the database.`, '\u200b')
                ]
            });
        }
        else if(found_queue.guildID == msg.guild.id) {
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField(`You cannot import your own/existing queue.`, '\u200b')
                ]
            });
        }
        else if(same_name) {
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField(`Another queue with that name already exists!`, `Name: ${same_name.name}`)
                ]
            });
        }
        else {
            let imported = await SavedQueue.create({
                guildID: msg.guild.id,
                name: found_queue.name,
                urls: found_queue.urls
            });
            
            msg.channel.send({
                embeds: [
                    new MessageEmbed(bot, msg.guild)
                    .addField(`Queue '${imported.name}' has been successfully imported.`, '\u200b')
                    .addField('You can load it by running following command:', `\`${prefix}${alias} load ${imported.name}\``)
                ]
            });
        }
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
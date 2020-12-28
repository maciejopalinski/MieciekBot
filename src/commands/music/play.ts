import { Command, ServerQueue, Song } from "../../lib";

const Play = new Command();

Play.execute = async (bot, msg, args, load) => {
    
    if(!msg.member.voice.channel || !canModify(bot, msg.member))
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.voice_channel);
    }

    let song = null;
    if(!load)
    {
        song = new Song(bot);
        try {
            await song.fetchInfo(args.join(' '));

            // TODO: prevent this from saving link as key into cache
            bot.music_manager.search_cache.set(args.join(' '), song.url);
        } catch (error) {
            console.error(error);
            return msg.channel.send(error.message);
        }
    }

    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue) {
        try {
            server_queue.addSong(song, true);
        } catch (error) {
            msg.channel.send(error.message);
        }
        return;
    }

    server_queue = new ServerQueue(bot, msg.channel, msg.member.voice.channel);

    if(load) await server_queue.loadQueue(load);
    else server_queue.addSong(song, false);
    
    bot.music_manager.set(server_queue);

    try {
        server_queue.connection = await server_queue.join();
        server_queue.connection.on('disconnect', (err) => {
            if(err) console.error(err);

            server_queue.songs = [];
            if(server_queue.connection.dispatcher) server_queue.connection.dispatcher.end();
            msg.channel.send(error.stopped);
            return bot.music_manager.delete(msg.guild.id);
        });

        server_queue.play();
        server_queue.connection.voice.setSelfDeaf(true);
    } catch (err) {
        console.error(err);
        server_queue.voice_channel.leave();
        bot.music_manager.delete(msg.guild.id);
        return msg.channel.send(`Could not join the channel: ${err}`);
    }
}

Play.setHelp({
    name: 'play',
    args: '<url|search>',
    aliases: ['p'],
    description: 'plays music in voice channel',
    permission: 'DJ'
});

const error = Play.error = {
    voice_channel: "You must be in a voice channel to play music.",
    stopped: "Disconnected from voice channel. Music stopped."
};

/**
 * @param {Client} bot
 * @param {Discord.GuildMember} member
 */
function canModify(bot, member) {
    const same_channel = (member.voice.channel == member.guild.me.voice.channel);
    const is_admin = (bot.roles.user.priority >= bot.roles.manager.getNode('ADMIN').priority);

    if(!member.guild.me.voice.channel) return true;
    if(same_channel || is_admin) return true;
    return false;
}

export default Play;
const {Client, Message, MessageEmbed, GuildMember, Song, ServerQueue} = require('../../lib/mieciekbot.js');
const YTDL = require('ytdl-core');
const Search = require('youtube-search');

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args
 * @param {ServerQueue} [load]
 */
module.exports.run = async (bot, msg, args, load) => {
    if(!msg.member.voice.channel || !canModify(bot, msg.member))
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, this.error.voice_channel);
    }

    let song = null;
    if(!load)
    {
        song = new Song(bot);
        try {
            await song.fetchInfo(args.join(' '));
            bot.music_queue.cache.set(args.join(' '), song.url);
        } catch (error) {
            console.error(error);
            return msg.channel.send(error.message);
        }
    }

    let server_queue = bot.music_queue.get(msg.guild.id);
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
    bot.music_queue.set(server_queue);

    try {
        server_queue.connection = await server_queue.join();
        server_queue.connection.on('disconnect', (err) => {
            if(err) console.error(err);

            server_queue.songs = [];
            if(server_queue.connection.dispatcher) server_queue.connection.dispatcher.end();
            msg.channel.send(this.error.stopped);
            return bot.music_queue.delete(msg.guild.id);
        });

        server_queue.play();
        await server_queue.connection.voice.setSelfDeaf(true);
    } catch (err) {
        console.error(err);
        server_queue.voice_channel.leave();
        bot.music_queue.delete(msg.guild.id);
        return msg.channel.send(`Could not join the channel: ${err}`);
    }
}

module.exports.help = {
    name: "play",
    aliases: [
        "music",
        "p"
    ],
    args: [
        "<url|search>"
    ],
    permission: "DJ",
    description: "plays music in voice channel"
}

module.exports.error = {
    "voice_channel": "You must be in a voice channel to play music.",
    "stopped": "Disconnected from voice channel. Music stopped."
}

/**
 * @param {Client} bot
 * @param {GuildMember} member
 */
function canModify(bot, member) {
    const same_channel = (member.voice.channel == member.guild.me.voice.channel);
    const is_admin = (bot.roles.user.priority >= bot.roles.manager.getNode('ADMIN').priority);

    if(!member.guild.me.voice.channel) return true;
    if(same_channel || is_admin) return true;
    return false;
}
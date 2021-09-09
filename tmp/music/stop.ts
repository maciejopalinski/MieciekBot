import { Command } from '../../lib';

const Stop = new Command();

Stop.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue && server_queue.playing.state)
    {
        server_queue.songs = [];
        server_queue.playing.current = null;
        server_queue.player.stop();
        msg.channel.send(error.stopped);
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel,error.music_play);
    }
}

Stop.help = {
    name: 'stop',
    args: '',
    aliases: [],
    description: 'stops played music',
    permission: 'DJ'
};

const error = Stop.error = {
    music_play: "There must be a song in queue to stop it.",
    stopped: "Music stopped."
};

export default Stop;
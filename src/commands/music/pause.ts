import { Command } from "../../lib";

const Pause = new Command();

Pause.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue)
    {
        if(server_queue.playing.state)
        {
            server_queue.playing.state = false;
            server_queue.connection.dispatcher.pause();
            msg.channel.send(error.paused);
        }
        else
        {
            server_queue.playing.state = true;
            server_queue.connection.dispatcher.resume();
            msg.channel.send(error.resumed);
        }
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

Pause.help = {
    name: 'pause',
    args: '',
    aliases: ['resume'],
    description: 'pauses/resumes played music',
    permission: 'DJ'
};

const error = Pause.error = {
    music_play: "There must be a song in queue to pause/resume it.",
    paused: "Music paused.",
    resumed: "Music resumed."
};

export default Pause;
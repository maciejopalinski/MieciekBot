import { Command } from "../../lib";

const Skip = new Command();

Skip.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue)
    {
        msg.channel.send(error.skipped);
        server_queue.connection.dispatcher.end();
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

Skip.help = {
    name: 'skip',
    args: '',
    aliases: [],
    description: 'skips current track',
    permission: 'DJ'
};

const error = Skip.error = {
    music_play: "There must be something in queue to skip it.",
    skipped: "Music skipped."
};

export default Skip;
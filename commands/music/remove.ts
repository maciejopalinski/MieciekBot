import { Command } from "../../lib";

const Remove = new Command();

Remove.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue)
    {
        let index = parseInt(args[0]);
        if(index < 0 || index > server_queue.songs.length - 1)
        {
            bot.deleteMsg(msg);
            return bot.sendAndDelete(msg.channel, error.invalid_num);
        }
        
        server_queue.removeSong(index);
        msg.channel.send(error.removed.replace('{{pos}}', index.toString()));
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.must_play);
    }
}

Remove.setHelp({
    name: 'remove',
    args: '<position>',
    aliases: [],
    description: 'removes track from queue',
    permission: 'DJ'
});

const error = Remove.error = {
    must_play: "There must be something in queue to remove it.",
    removed: "Track {{pos}} removed from the queue.",
    invalid_num: "Invalid number specified."
};

export default Remove;
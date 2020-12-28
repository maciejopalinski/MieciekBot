import { Command } from '../../lib';

const Earrape = new Command();

Earrape.execute = async (bot, msg, args) => {
    
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue && server_queue.playing.state)
    {
        if(server_queue.volume.current != 500)
        {
            server_queue.setVolume(500);
            msg.channel.send(error.turn_on);
        }
        else
        {
            server_queue.restoreVolume();
            msg.channel.send(error.turn_off + ` Volume: ${server_queue.volume.current}.`);
        }
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

Earrape.setHelp({
    name: 'earrape',
    args: '',
    aliases: ['music-hehe'],
    description: 'plays music 5x louder',
    permission: 'DJ'
});

const error = Earrape.error = {
    music_play: "There must be a song in queue.",
    turn_on: "Earrape turned on.",
    turn_off: "Earrape turned off."
};

export default Earrape;
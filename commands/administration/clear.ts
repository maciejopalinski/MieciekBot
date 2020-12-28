import { TextChannel } from 'discord.js';
import { Command } from '../../lib';

const Clear = new Command();

Clear.execute = async (bot, msg, args) => {
    let messages = parseInt(args[0]) || 100;

    if(messages >= 2 && messages <= 100)
    {
        await msg.delete();
        (<TextChannel> msg.channel).bulkDelete(messages).catch(err => bot.sendAndDelete(msg.channel, err.message));
    }
    else
    {
        bot.deleteMsg(msg);
        bot.sendAndDelete(msg.channel, error.wrong_amount);
    }
};

Clear.setHelp({
    name: 'clear',
    args: '[number]',
    aliases: ['cls', 'clr', 'cl'],
    description: 'deletes last 100 or [number] messages from channel',
    permission: 'ADMIN'
});

const error = Clear.error = {
    wrong_amount: "You can delete 2-100 messages at once."
}

export default Clear;
import { Command } from '../../lib';

const Say = new Command();

Say.execute = async (bot, msg, args) => {
    await msg.delete();
    msg.channel.send(args.join(' '));
}

Say.setHelp({
    name: 'say',
    args: '<text>',
    aliases: ['print', 'send', 'announce'],
    description: 'sends a message containing <text>',
    permission: 'ADMIN'
});

export default Say;
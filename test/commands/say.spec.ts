import Say from '../../src/commands/administration/say';

import * as Discord from 'discord.js';
jest.mock('discord.js');
import * as MieciekBot from '../../src/lib';
jest.mock('../../src/lib');

const client = new MieciekBot.Client('', '', {});
const guild = new Discord.Guild(client, {});
const channel = new Discord.TextChannel(guild, {});
const message = new Discord.Message(client, {}, channel);
message.channel = channel;

describe('Say Command', () => {

    it('should reply with the joined args', async () => {
        const args = 'test test 123 test test';
        await Say.execute(client, message, args.split(' '));

        expect(channel.send).toHaveBeenCalledWith(args);
    });

});
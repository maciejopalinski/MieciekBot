import MockDiscord from '../../../mocks';
jest.mock('discord.js');
let mock = new MockDiscord();
const client = mock.getClient();
const message = mock.getMessage();
const channel = mock.getTextChannel();

const Say = client.command_manager.getCommand('say');

describe('Say Command', () => {

    beforeEach(() => jest.clearAllMocks());

    it('should reply with args', async () => {
        const args = 'test test 123 test test';
        await Say.execute(client, message, args.split(' '));

        expect(channel.send).toHaveBeenCalledWith(args);
    });

});
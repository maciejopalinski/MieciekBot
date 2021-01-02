import MockDiscord from '../../../mocks';
jest.mock('discord.js');
let mock = new MockDiscord();
const client = mock.getClient();
const message = mock.getMessage();
const channel = mock.getTextChannel();

const Eval = client.command_manager.getCommand('eval');

describe('Eval Command', () => {

    beforeEach(() => jest.clearAllMocks());

    it('should throw ReferenceError', async () => {
        const args = 'foo.bar(\'5\')';
        await Eval.execute(client, message, args.split(' '));

        expect(channel.send).toHaveBeenCalledTimes(1);
        
        let send_args = (channel.send as jest.Mock<any, any>).mock.calls[0];
        expect(send_args[0]).toContain('ReferenceError: foo is not defined');
    });

    it('should return correct answer for math equation', async () => {
        const args = '1691269241534 + 354732438455';
        const expected = '2046001679989';
        await Eval.execute(client, message, args.split(' '));

        expect(channel.send).toHaveBeenCalledTimes(1);

        let send_args = (channel.send as jest.Mock<any, any>).mock.calls[0];
        expect(send_args[0]).toContain(expected);
    });

    it('should throw OutputLengthError', async () => {
        const args = 'bot';
        await Eval.execute(client, message, args.split(' '));
        
        expect(channel.send).toHaveBeenCalledTimes(1);

        let send_args = (channel.send as jest.Mock<any, any>).mock.calls[0];
        expect(send_args[0]).toContain('Output is longer than 2000 characters');
    });

});
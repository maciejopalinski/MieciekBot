import Eval from '../../../src/commands/bot-owner/eval';

import MockDiscord from '../../../mocks';
jest.mock('discord.js');
let mock = new MockDiscord();
const client = mock.getClient();
const message = mock.getMessage();
const channel = mock.getTextChannel();

describe('Eval Command', () => {

    beforeEach(() => jest.clearAllMocks());

    it('should throw ReferenceError', async () => {
        const args = 'foo.bar(\'5\')';
        await Eval.execute(client, message, args.split(' '));

        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send).toHaveBeenCalledWith(expect.stringContaining('not defined'), expect.anything());
    });

    it('should return correct answer for math equation', async () => {
        const args = '1691269241534 + 354732438455';
        const expected = '2046001679989';
        await Eval.execute(client, message, args.split(' '));

        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send).toHaveBeenCalledWith(expected, expect.anything());
    });

    it('should throw OutputLengthError', async () => {
        await Eval.execute(client, message, ['bot']);
        
        expect(channel.send).toHaveBeenCalledTimes(1);
        expect(channel.send).toHaveBeenCalledWith(expect.stringContaining('longer than 2000 characters'), expect.anything());
    });

});
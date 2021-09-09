import { Command, CommandType } from '../../lib';
import { inspect } from 'util';
import { MessageAttachment } from 'discord.js';

const Eval = new Command({
    type: CommandType.BOTH,
    aliases: [],
    permission: 'BOT_OWNER'
});

Eval.data
    .setName('eval')
    .setDescription('evaluates given JavaScript expression')
    .addStringOption(opt =>
        opt
            .setName('expression')
            .setDescription('JavaScript expression to evaluate')
            .setRequired(true)
    );

Eval.executeFromMessage = async (bot, msg, args) => {

    const code = args.join(' ');
    const output = evaluate(code);

    msg.channel.send({ files: [new MessageAttachment(Buffer.from(output), 'output.txt')] });
}

Eval.executeFromInteraction = async (bot, interaction) => {

    await interaction.deferReply();
    const code = interaction.options.getString('expression');
    const output = evaluate(code);

    interaction.editReply({ files: [new MessageAttachment(Buffer.from(output), 'output.txt')] });
}

const evaluate = (code: string): string | any => {

    try {
        // jailed inside this function! cannot access bot, msg, interaction, etc.
        let evaled = eval(code);
        if (typeof evaled !== 'string') evaled = inspect(evaled);

        return clean(evaled);
    }
    catch (err) {
        if (typeof err !== 'string') err = inspect(err);

        return clean(err);
    }
}

const clean = (text: any): string | any => {
    if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else return text;
}

export default Eval;
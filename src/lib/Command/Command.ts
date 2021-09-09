import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, BitField } from 'discord.js';
import { type } from 'os';
import { Client } from '../';
import { PermissionNodeName } from './Permissions/Nodes';

export enum CommandType {
    MESSAGE     = 1 << 0,
    INTERACTION = 1 << 1,
    BOTH        = MESSAGE | INTERACTION,
}

export interface CommandHelp {
    type: CommandType;
    aliases: string[];
    permission: PermissionNodeName;
}

export class Command {

    constructor(help: CommandHelp) {
        this.help = help;

        // if (this.help.permission == '@everyone') this.data.setDefaultPermission(true);
        // else this.data.setDefaultPermission(false);
    }

    init() {
        this.data.options.forEach(opt => {
            const option = opt.toJSON();

            if (option.required) this.args += `<${option.name}> `;
            else this.args += `[${option.name}] `;
        });
    }

    async executeFromInteraction(bot: Client, interaction: CommandInteraction) {}
    async executeFromMessage(bot: Client, msg: Message, args: string[]) {}

    get hasInteractionHandler() {
        return (this.help.type & CommandType.INTERACTION) != 0;
    }

    get hasMessageHandler() {
        return (this.help.type & CommandType.MESSAGE) != 0;
    }

    category: string = '';
    path: string = '';
    args: string = '';

    help: CommandHelp;
    data: SlashCommandBuilder = new SlashCommandBuilder();
}
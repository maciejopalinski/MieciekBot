import { Message } from 'discord.js';
import { Client } from '../';
import { PermissionNodeName } from './Permissions/Nodes';

export interface CommandHelp {

    name: string;
    args: string;
    description: string;
    aliases: string[];
    permission: PermissionNodeName;
}

export class Command {

    async execute(bot: Client, msg: Message, args: string[], ...rest: any[]): Promise<void | Message> {}

    help: CommandHelp;
    category: string = "";
    path: string = "";

    error = {};
}
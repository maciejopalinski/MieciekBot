import { Collection, Message } from 'discord.js';
import fs from 'fs';
import { Client } from './';

export interface CommandOptions {

    name: string
    args: string
    description: string
    aliases: string[]
    permission: string
}

export class Command {

    async execute(bot: Client, msg: Message, args: string[], optional?: any): Promise<void | Message> {}

    help: CommandOptions;
    args_array: string[] = [];
    category: string = "";
    path: string = "";

    error = {};

    setHelp(help: CommandOptions) {
        this.help = help;
        this.args_array = this.help.args.split(' ');
    }
}

export class CommandManager {

    categories: string[] = [];

    commands: Collection<string, Command> = new Collection();

    constructor() {
        this.loadCommands();
    }

    private loadCommands() {
        console.info('Starting commands loading...');

        let commands_dir = `${__dirname}/../commands`;

        let categories = fs.readdirSync(commands_dir);
        categories.forEach(category => {
            
            let commands = fs.readdirSync(`${commands_dir}/${category}`);
            
            let jsfiles = commands.filter(f => {
                let file_extension = f.split('.').pop();
                return ['js', 'ts'].includes(file_extension);
            });

            jsfiles.forEach(command => {
                
                let path = `${commands_dir}/${category}/${command}`;
                let props: Command = require(path).default;

                props.category = category;
                props.path = `commands/${category}/${command}`;

                try {
                    this.registerCommand(props);
                } catch(err) {
                    console.error(err);
                }
            });
        });

        if(this.commands.size > 0) {
            console.info(`${this.commands.size} commands loaded`);
            console.info(`${this.categories.length} categories loaded\n`);
        }
        else console.warn(`Commands not found!\n`);
    }

    registerCommand(command: Command) {

        // check for name duplications
        if(this.commands.find(v => v.help.name == command.help.name)) {
            throw new Error(`Command with name '${command.help.name}' has been already registered!`);
        }

        // check for alias duplications
        command.help.aliases.forEach(alias => {
            if(this.commands.find(v => v.help.aliases.includes(alias))) {
                throw new Error(`Command with alias '${alias}' has been already registered! (${command.path})`);
            }
        });

        let v = this.commands.set(command.help.name, command);
        
        if(!this.categories.includes(command.category)) this.categories.push(command.category);
        
        console.info(`${command.path} loaded`);
        return v;
    }

    getCommand(query: string) : Command | null {
        let by_name = this.commands.find(v => v.help.name == query);
        let by_alias = this.commands.find(v => v.help.aliases.includes(query));

        if(by_name) return by_name;
        else if(by_alias) return by_alias;
        else return null;
    }
}
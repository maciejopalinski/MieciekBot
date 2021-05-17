import { GuildMember } from 'discord.js';
import fs from 'fs';
import { Command } from './Command';

export class CommandManager {

    categories: string[] = [];
    commands: Command[] = [];

    loadCommands() {
        console.info('Starting commands loading...');

        let commands_dir = `${__dirname}/../../commands`;

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

        if(this.commands.length > 0) {
            console.info(`${this.commands.length} commands loaded`);
            console.info(`${this.categories.length} categories loaded\n`);
        }
        else console.warn(`Commands not found!\n`);
    }

    registerCommand(command: Command) {

        // check for name duplications
        if(this.getCommandByName(command.help.name)) {
            throw new Error(`Command with name '${command.help.name}' has been already registered!`);
        }

        // check for alias duplications
        command.help.aliases.forEach(alias => {
            if(this.getCommandByAlias(alias)) {
                throw new Error(`Command with alias '${alias}' has been already registered! (${command.path})`);
            }
        });

        if(!this.categories.includes(command.category)) this.categories.push(command.category);

        this.commands.push(command);

        console.info(`${command.path} loaded`);
    }

    getCommand(query: string): Command | undefined {
        return this.getCommandByName(query) || this.getCommandByAlias(query) || undefined;
    }

    getCommandByName(name: string): Command | undefined {
        return this.commands.find(v => v.help.name == name) || undefined;
    }

    getCommandByAlias(alias: string): Command | undefined {
        return this.commands.find(v => v.help.aliases.includes(alias)) || undefined;
    }
}
import fs from 'fs';
import { Client } from '../';
import { Command } from './Command';
import { REST } from '@discordjs/rest';
import { GuildDefaultMessageNotifications, Routes } from 'discord-api-types/v9';
import { GuildApplicationCommandPermissionData } from 'discord.js';
import { RolePermissionNode, UserPermissionNode } from '.';

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

                let path = `/${category}/${command}`;
                let props = require(commands_dir + path).default;

                if (props instanceof Command)
                {
                    props.category = category;
                    props.path = path;
                    props.init();

                    try {
                        this.registerCommand(props);
                    } catch(err) {
                        console.error(err);
                    }
                }
                else
                {
                    console.error(`${path} is not a valid command file`);
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
        if(this.getCommandByName(command.data.name)) {
            throw new Error(`Command with name '${command.data.name}' has been already registered!`);
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

    async deploySlashCommands(client: Client) {

        const rest = new REST({ version: '9' }).setToken(client.token);

        let slash_commands = this.commands.filter(c => c.hasInteractionHandler).map(c => c.data.toJSON());

        try {
            if (client.debug)
            {
                const guild = client.guilds.cache.get(client.debug_guild_id);
                if (guild)
                {
                    console.info(`Deploying guild slash commands (GID: ${guild.id})...`);

                    guild.commands.cache.map(c => c.toJSON());

                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guild.id),
                        { body: slash_commands }
                    );

                    console.info(`Deployed ${slash_commands.length} guild slash commands`);
                }
            }
            else
            {
                console.info('Deploying global slash commands...');

                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: slash_commands }
                );

                console.info(`Deployed ${slash_commands.length} application slash commands`);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    getCommand(query: string): Command | undefined {
        return this.getCommandByName(query) || this.getCommandByAlias(query) || undefined;
    }

    getCommandByName(name: string): Command | undefined {
        return this.commands.find(c => c.data.name == name) || undefined;
    }

    getCommandByAlias(alias: string): Command | undefined {
        return this.commands.find(c => c.help.aliases.includes(alias)) || undefined;
    }

    calculateArgs(command: Command) {
        let required = 0, optional = 0;

        command.data.options.forEach(opt => {
            if (opt.toJSON().required) required++;
            else optional++;
        });

        return { required, optional };
    }
}
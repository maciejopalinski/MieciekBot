const Discord = require('discord.js');
const fs = require('fs');

const Command = require('./Command');

class CommandManager {
    /** @type {string[]} */
    categories = [];

    /** @type {Discord.Collection<string, Command>} */
    commands = new Discord.Collection();

    constructor() {
        this.loadCommands();
    }

    loadCommands() {
        console.info(`Starting commands loading...`);
        
        let categories = fs.readdirSync('./commands');
        categories.forEach(category => {
            let commands = fs.readdirSync(`./commands/${category}`);
            let jsfiles = commands.filter(f => f.split('.').pop() === 'js');

            jsfiles.forEach(command => {
                let path = `commands/${category}/${command}`;
                /** @type {Command} */ let props = require('../../' + path);
                
                props.category = category;
                props.path = path;

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

    /** @param {Command} command */
    registerCommand(command) {
        if(!command) throw new Error('Wrong argument provided! registerCommand(command)');

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

    /** 
     * @param {string} query
     * @returns {Command | null}
     */
    getCommand(query) {
        let by_name = this.commands.find(v => v.help.name == query);
        let by_alias = this.commands.find(v => v.help.aliases.includes(query));

        if(by_name) return by_name;
        else if(by_alias) return by_alias;
        else return null;
    }
}

module.exports = CommandManager;
const Discord = require('discord.js');
const fs = require('fs');

class CommandManager {
    categories = [];
    commands = new Discord.Collection();
    aliases = new Discord.Collection();

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
                let props = require(`../commands/${category}/${command}`);
                props.help.category = category;

                if(!this.categories.includes(category)) this.categories.push(category);
                props.help.aliases.forEach(value => this.aliases.set(value, props));
                this.commands.set(props.help.name, props);

                console.info(`commands/${category}/${command} loaded`);
            });
        });

        if(this.commands.size > 0) {
            console.info(`${this.commands.size} commands loaded`);
            console.info(`${this.categories.length} categories loaded\n`);
        }
        else console.warn(`Commands not found!\n`);
    }
}

module.exports = CommandManager;
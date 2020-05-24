const fs = require("fs");
const package_info = require("../package.json");

module.exports.init = () => {
    console.info(`Initializing MieciekBot ${package_info.version}...\n`);
}

module.exports.events = bot => {
    console.info(`Starting events loading...`);

    let total_events = 0;

    let files = fs.readdirSync("./events/");
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    total_events += jsfiles.length;

    jsfiles.forEach(event => {
        require(`../events/${event}`);
        console.info(`${event} loaded`);
    });

    if(total_events > 0)
    {
        console.info(`${total_events} events loaded\n`);
    }
    else
    {
        console.warn(`Events not found!\n`);
    }
}

module.exports.commands = bot => {
    console.info(`Starting commands loading...`);

    let total_commands = 0;
    
    let categories = fs.readdirSync("./commands");
    categories.forEach(category => {
        let commands = fs.readdirSync(`./commands/${category}`);
        let jsfiles = commands.filter(f => f.split(".").pop() === "js");
        total_commands += jsfiles.length;
        
        commands.forEach(command => {
            let props = require(`../commands/${category}/${command}`);
            props.help.category = category;

            if(!bot.categories.includes(category))
            {
                bot.categories.push(category);
            }

            props.help.aliases.forEach(value => {
                bot.aliases.set(value, props);
            });
            bot.commands.set(props.help.name, props);

            console.info(`${category}/${command} loaded`);
        });
    });

    if(total_commands > 0)
    {
        console.info(`${total_commands} commands loaded`);
        console.info(`${bot.categories.length} categories loaded\n`);
    }
    else
    {
        console.warn(`Commands not found!\n`);
    }
}
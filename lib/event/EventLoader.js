const fs = require('fs');

module.exports = class EventLoader {
    constructor() {
        this.loadEvents();
    }

    loadEvents() {
        console.info(`Starting events loading...`);

        let files = fs.readdirSync('./events/');
        let jsfiles = files.filter(f => f.split('.').pop() === 'js');
        let total_events = jsfiles.length;

        jsfiles.forEach(event => {
            require(`../../events/${event}`);
            console.info(`events/${event} loaded`);
        });

        if(total_events > 0) console.info(`${total_events} events loaded\n`);
        else console.warn(`Events not found!\n`);
    }
}
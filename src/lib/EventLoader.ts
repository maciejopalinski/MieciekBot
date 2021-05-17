import fs from 'fs';
import { Client } from './';

export class EventLoader {

    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    loadEvents() {
        console.info('Starting events loading...');

        let events_dir = `${__dirname}/../events`;

        let files = fs.readdirSync(events_dir);
        let jsfiles = files.filter(f => {
            let file_extension = f.split('.').pop();
            return ['js', 'ts'].includes(file_extension);
        });
        let total_events = jsfiles.length;

        jsfiles.forEach(event_file => {
            let event = require(`${events_dir}/${event_file}`).default;
            event(this.client);

            console.info(`events/${event_file} loaded`);
        });

        if(total_events > 0) console.info(`${total_events} events loaded\n`);
        else console.warn(`Events not found!\n`);
    }
}
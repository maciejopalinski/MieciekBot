import { ChangeEventUpdate, ChangeEvent } from 'mongodb';
import { Client } from "../lib";
import { Guild, IGuild } from '../models';

export const onGuildChange = (client: Client, doc: ChangeEventUpdate<IGuild>) => {
    client.guild_manager.fetchOne(doc.fullDocument);
}

export default (client: Client) => {
    let stream = Guild.watch(undefined, { fullDocument: 'updateLookup' });
    
    stream.on('change', (doc: ChangeEventUpdate<IGuild>) => onGuildChange(client, doc));
}
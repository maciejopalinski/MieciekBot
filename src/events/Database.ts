import { ChangeEventUpdate, ChangeEvent } from 'mongodb';
import { Client } from '../lib';
import { Guild, IGuild } from '../models';

export const onGuildChange = (client: Client, doc: ChangeEventUpdate<IGuild>) => {
    if (!['update', 'insert'].includes(doc.operationType)) return;

    client.guild_manager.fetchGuild(doc.fullDocument);
}

export default (client: Client) => {
    let stream = Guild.watch(undefined, { fullDocument: 'updateLookup' });
    
    stream.on('change', (doc: ChangeEventUpdate<IGuild>) => onGuildChange(client, doc));
}
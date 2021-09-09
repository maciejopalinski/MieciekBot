import { ChangeStreamDocument } from 'mongodb';
import { Client } from '../lib';
import { Guild, IGuild } from '../models';

export const onGuildChange = (client: Client, data: ChangeStreamDocument<IGuild>) => {

    if (!['update', 'insert'].includes(data.operationType)) return;

    client.guild_manager.fetchGuild(data.fullDocument);
}

export default (client: Client) => {
    let stream = Guild.watch(undefined, { fullDocument: 'updateLookup' });
    
    stream.on('change', (data: ChangeStreamDocument<IGuild>) => onGuildChange(client, data));
}
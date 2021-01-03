import { ChangeEventUpdate } from 'mongodb';
import { Client } from "../lib";
import { IGuild } from '../models';

export const onGuildChange = (client: Client, doc: ChangeEventUpdate<IGuild>) => {
    client.guild.fetchOne(doc.fullDocument);
}

export default (client: Client) => {
    const guild_change_stream = client.db_manager.models.Guild.watch();

    guild_change_stream.on('change', (doc: ChangeEventUpdate<IGuild>) => onGuildChange(client, doc));
}
import { Guild } from 'discord.js';
import mongoose from 'mongoose';

import { Client, ExperienceSystem } from '../';
import * as Models from '../../models';

export class DatabaseManager {

    exp_system = new ExperienceSystem();

    constructor(db_uri: string) {
        this.connect(db_uri);
    }

    private connect(uri: string) {
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    }

    // GET
    async getGuild(guildID: string) {
        return await Models.Guild.findOne({ guildID });
    }
    async getUser(guildID: string, userID: string) {
        return await Models.User.findOne({ guildID, userID }).exec();
    }
    async getGuildUsers(guildID: string) {
        return await Models.User.find({ guildID }).exec();
    }
    async getWarns(guildID: string, userID: string) {
        return await Models.Warn.find({ guildID, userID }).exec();
    }
    async getSavedQueue(guildID: string, name: string) {
        return await Models.SavedQueue.findOne({ guildID, name }).exec();
    }
    async getAllSavedQueues(guildID: string) {
        return await Models.SavedQueue.find({ guildID }).exec();
    }

    // DELETE
    async deleteGuildData(guildID: string) {
        await (await this.getGuild(guildID)).delete();

        await Models.User.deleteMany({ guildID });
        await Models.Warn.deleteMany({ guildID });
        await Models.SavedQueue.deleteMany({ guildID });
    }

    async databaseCleanup(client: Client) {

        // add new guilds
        client.guilds.cache.forEach(async guild => {
            let db_guild = await this.getGuild(guild.id);

            if(!db_guild) client.emit('guildCreate', guild);
        });

        // delete old guilds
        let db_guilds = await Models.Guild.find({});

        db_guilds.forEach(guild => {
            if(!client.guilds.cache.has(guild.guildID))
            {
                client.emit('guildDelete', <Guild> { id: guild.guildID });
                console.debug(`Deleting old guild and its members from the database... (GID:${guild.guildID})`);
            }
        });
    }
}
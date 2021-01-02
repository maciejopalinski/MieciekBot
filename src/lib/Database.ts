import * as Discord from 'discord.js';
import mongoose from 'mongoose';

import { ExperienceSystem, Client } from './';
import * as Models from '../models';
import { ISavedQueue, IUser, IWarn } from '../models';

export class DatabaseManager {

    exp_system = new ExperienceSystem();

    models = Models;

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
        return await this.models.Guild.findOne({ guildID });
    }
    async getUser(guildID: string, userID: string) {
        return await this.models.User.findOne({ guildID, userID }).exec();
    }
    async getGuildUsers(guildID: string) {
        return await this.models.User.find({ guildID }).exec();
    }
    async getWarns(guildID: string, userID: string) {
        return await this.models.Warn.find({ guildID, userID }).exec();
    }
    async getSavedQueue(guildID: string, name: string) {
        return await this.models.SavedQueue.findOne({ guildID, name }).exec();
    }
    async getAllSavedQueues(guildID: string) {
        return await this.models.SavedQueue.find({ guildID }).exec();
    }

    // DELETE
    async deleteGuildData(guildID: string) {
        await (await this.getGuild(guildID)).delete();

        await this.models.User.deleteMany( <IUser> { guildID });
        await this.models.Warn.deleteMany( <IWarn> { guildID });
        await this.models.SavedQueue.deleteMany( <ISavedQueue> { guildID });
    }

    async databaseCleanup(client: Client) {
        
        // add new guilds
        client.guilds.cache.forEach(async guild => {            
            let db_guild = await this.getGuild(guild.id);
            
            if(!db_guild) client.emit('guildCreate', guild);
        });
        
        // delete old guilds
        let db_guilds = await this.models.Guild.find({}).exec();
        db_guilds.forEach(guild => {
            if(!client.guilds.cache.has(guild.guildID))
            {
                client.emit('guildDelete', <Discord.Guild>{ id: guild.guildID });
                console.debug(`Deleting old guild and its members from the database... (GID:${guild.guildID})`);
            }
        });
    }
}
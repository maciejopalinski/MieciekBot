import mongoose from 'mongoose';
import { client } from '../index';

export interface ISavedQueue extends mongoose.Document {
    guildID: string,
    queueID: string,
    name: string,
    urls: string[]
}

const SavedQueueSchema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    queueID: {
        type: String,
        default: () => client.generateUUID(24),
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    urls: {
        type: [String],
        required: true
    }
});

export const SavedQueue = mongoose.model<ISavedQueue>('SavedQueue', SavedQueueSchema);
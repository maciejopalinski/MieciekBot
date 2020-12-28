import mongoose from 'mongoose';

export interface ISavedQueue extends mongoose.Document {
    guildID: string,
    name: string,
    urls: string[]
}

const SavedQueueSchema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    urls: {
        type: [String],
        required: true
    }
});

export const SavedQueue = mongoose.model<ISavedQueue>('SavedQueue', SavedQueueSchema);
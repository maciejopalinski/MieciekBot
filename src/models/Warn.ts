import mongoose from 'mongoose';

export interface IWarn extends mongoose.Document {
    guildID: string,
    userID: string,
    warnedBy: string,
    reason: string,
    timestamp: string
}

const WarnSchema = new mongoose.Schema({
	guildID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
	warnedBy: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    }
});

export const Warn = mongoose.model<IWarn>('Warn', WarnSchema);
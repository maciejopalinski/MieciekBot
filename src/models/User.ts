import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    guildID: string,
    userID: string,
    level: number,
    xp: number
}

const UserSchema = new mongoose.Schema({
	guildID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    }
});

export const User = mongoose.model<IUser>('User', UserSchema);
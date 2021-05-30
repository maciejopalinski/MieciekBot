import mongoose from 'mongoose';

export interface ServerPermissionRoles {
	owner: string,
	admin: string,
	dj: string,
	user: string,
	mute: string
}

export interface ServerAnnounceToggles {
    add_member: boolean;
    remove_member: boolean;
}

export interface ServerAnnounceOptions {
    channel_id: string;
	toggles: ServerAnnounceToggles;
}

export interface IGuild extends mongoose.Document {
	guildID: string;
	prefix: string;
	delete_timeout: number;
	roles: ServerPermissionRoles,
	announce: ServerAnnounceOptions,
	spam_channels: string[]
}

const GuildSchema = new mongoose.Schema({
	guildID: {
		type: String,
		required: true,
		unique: true
	},
	prefix: {
		type: String,
		default: '!'
	},
	delete_timeout: {
		type: Number,
		default: 3000
	},
	roles: {
		owner: { type: String, default: '000000000' },
		admin: { type: String, default: '000000000' },
		dj: { type: String, default: '000000000' },
		user: { type: String, default: '000000000' },
		mute: { type: String, default: '000000000' }
	},
	announce: {
		channel_id: { type: String, default: '000000000' },
		toggles: {
			add_member: { type: Boolean, default: false },
			remove_member: { type: Boolean, default: false }
		}
	},
	spam_channels: {
		type: [String],
		default: []
	}
});

export const Guild = mongoose.model<IGuild>('Guild', GuildSchema);
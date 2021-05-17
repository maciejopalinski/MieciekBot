import { Guild, MessageEmbed as DJSMessageEmbed, MessageEmbedOptions } from 'discord.js';

import { Client } from './';

export class MessageEmbed extends DJSMessageEmbed {

    client: Client;
    guild: Guild;

    constructor(client: Client, guild: Guild, guild_icon: boolean = true, data?: DJSMessageEmbed | MessageEmbedOptions) {
        super(data);
        this.client = client;
        this.guild = guild;
        this.setCustomFooter();

        if(guild_icon) this.setThumbnail(this.guild.iconURL({ format: 'png', size: 4096 }));
    }

    setCustomFooter() {
        return this.setFooter(`Powered by MieciekBot ${this.client.version}`, this.client.user.avatarURL({ format: 'png', size: 4096 }));
    }
}
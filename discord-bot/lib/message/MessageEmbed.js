const Discord = require('discord.js');
const Client = require('../client/Client');

module.exports = class MessageEmbed extends Discord.MessageEmbed {

    /** @type {Client} */ client;
    /** @type {Discord.Guild} */ guild;

    /**
     * @param {Client} client
     * @param {Discord.Guild} [guild]
     * @param {Boolean} [guild_icon]
     * @param {Discord.MessageEmbed | Discord.MessageEmbedOptions} [data]
     */
    constructor(client, guild, guild_icon, data) {
        super(data);
        this.client = client;
        this.guild = guild;
        this.setCustomFooter();

        if(guild_icon == undefined) guild_icon = true;
        if(guild_icon) this.setThumbnail(this.guild.iconURL({ format: 'png', size: 4096 }));
    }

    setCustomFooter() {
        return this.setFooter(`Powered by MieciekBot ${this.client.version}`, this.client.user.avatarURL({ format: 'png', size: 4096 }));
    }
}
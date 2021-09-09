import { Interaction } from 'discord.js';
import EmojiRegex from 'emoji-regex';
import { Client } from '../lib';
import { User } from '../models/';

export const onInteractionCreate = async (client: Client, interaction: Interaction) => {

    if (!interaction.isCommand()) return;
    if (!interaction.inGuild()) return;

    let guild_config = client.guild_manager.getGuildConfig(interaction.guildId);
    if (!guild_config)
    {
        interaction.reply(`Oops! I did not properly configure your server... Please, invite me once again. ${client.generateBotInvite()}`)
        .then(() => interaction.guild.leave());
        return;
    }

    const guild = interaction.guild;
    const gid = guild.id;
    const uid = interaction.member.user.id;
    const member = guild.members.cache.get(uid);

    let command = client.command_manager.getCommand(interaction.commandName);
    if (command)
    {
        let node_manager = client.guild_manager.getPermissionManager(gid);
        await client.guild_manager.fetchUser(member);

        if (node_manager.hasCommandPermission(command, member))
        {
            command.executeFromInteraction(client, interaction)
            .catch(err => {

                console.error(err);

                if (client.debug) {
                    interaction.channel.send({ content: `**ERROR:** \`\`\`xl\n${err.stack}\n\`\`\`` });
                }
                else {
                    interaction.channel.send({ content: 'Unknown error occurred!' });
                }
            });
        }
        else
        {
            interaction.reply({ content: 'You have no permissions to run that command!' });
        }
    }
    else
    {
        interaction.reply({ content: 'Command not found!' });
    }
}

export default (client: Client) => {
    client.on('interactionCreate', interaction => onInteractionCreate(client, interaction));
}
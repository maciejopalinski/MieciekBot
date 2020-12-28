import { MessageEmbed, Command } from '../../lib';

import GitHub from 'octonode';
const GitHubClient = GitHub.client(process.env.GITHUB_API_TOKEN);

const Changelog = new Command();

Changelog.execute = async (bot, msg, args) => {
    let repository = GitHubClient.repo('PoProstuMieciek/MieciekBot');
    repository.releases((err, res) => {
        if(err) console.error(err);
        let latest = res[0];

        let changelog_embed = new MessageEmbed(bot, msg.guild)
        .setTitle('CHANGELOG: MieciekBot')
        .setURL(latest.html_url)
        .addField(latest.name, `Released by ${latest.author.login}`)
        .addField('Notes', latest.body.split('#').join(''));

        msg.channel.send(changelog_embed);
    });
}

Changelog.setHelp({
    name: 'changelog',
    args: '',
    aliases: ['changes', 'github', 'updates'],
    description: 'displays changelog of the latest MieciekBot release',
    permission: 'USER'
});

export default Changelog;
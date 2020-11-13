const {Client, Message, MessageEmbed} = require('../../lib/mieciekbot.js');
// const GitHub = require('octonode');
// const GitHubClient = GitHub.client(process.env.GITHUB_API_TOKEN);

/**
 * @param {Client} bot 
 * @param {Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    // let repository = GitHubClient.repo('PoProstuMieciek/MieciekBot');
    // repository.releases((err, res) => {
    //     if(err) console.error(err);
    //     let latest = res[0];

    //     let changelog_embed = new MessageEmbed()
    //     .setTitle('CHANGELOG: MieciekBot')
    //     .setURL(latest.html_url)
    //     .addField(latest.name, `Released by ${latest.author.login}`)
    //     .addField('Notes', latest.body.split('#').join(''));

    //     msg.channel.send(changelog_embed);
    // });
}

module.exports.help = {
    name: "changelog",
    aliases: [
        "changes",
        "github",
        "updates",
    ],
    args: [],
    permission: "USER",
    description: "displays changelog of the latest MieciekBot release"
}
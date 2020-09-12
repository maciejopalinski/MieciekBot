const Discord = require("discord.js");
const GitHub = require("octonode");

const Client = GitHub.client(process.env.GITHUB_API_TOKEN);

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let repository = Client.repo("PoProstuMieciek/MieciekBot");
    
    let releases = repository.releases((err, res) => {
        if(err) console.error(err);

        let latest = res[0];

        let changelog_embed = new Discord.MessageEmbed()
        .setTitle(`CHANGELOG: MieciekBot`)
        .setURL(latest.html_url)
        .addField(latest.name, `Released by ${latest.author.login}`)
        .addField(`Notes`, latest.body.split("#").join(""))
        .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

        msg.channel.send(changelog_embed);
    });
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

// this.run();
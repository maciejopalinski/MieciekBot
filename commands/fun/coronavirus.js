const Discord = require("discord.js");
const Request = require("request");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let country = new String();
    if(!args[0] || args[0] == "world" || args[0] == "global" || args[0] == "all") country = "all";
    else country = args[0];

    var options = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/',
        qs: {},
        headers: {
            'x-rapidapi-host': 'covid-193.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY
        }
    };

    if(country == "all")
    {
        options.url += 'statistics';
        options.qs = { country: country };
        Request(options, async (err, res, body) => {
            if(err) return console.error(err);
            body = JSON.parse(body);

            msg.channel.send(create_embed(bot, body, "Global"));
        });
    }
    else
    {
        options.url += 'countries';
        options.qs = { search: country };

        Request(options, async (err, res, body) => {
            if(err) return console.error(err);
            body = JSON.parse(body);

            if(body.results == 0)
            {
                msg.delete(bot.delete_timeout);
                return msg.channel.send(`That country was not found in the database.`).then(msg => msg.delete(bot.delete_timeout));
            }

            let verified_country = body.response[0];
            options.url = 'https://covid-193.p.rapidapi.com/statistics';
            options.qs = { country: verified_country };

            Request(options, async (err, res, body) => {
                if(err) return console.error(err);
                body = JSON.parse(body);

                msg.channel.send(create_embed(bot, body, verified_country));
            });
        });
    }
}

module.exports.help = {
    name: "coronavirus",
    aliases: [
        "cvirus",
        "cvstat"
    ],
    args: [
        "[country|world|global|all]"
    ],
    permission: "USER",
    description: "displays current coronavirus statistics"
}

/**
 * @param {Object} body
 * @param {String} header
 * 
 * @returns {Discord.RichEmbed}
 */
function create_embed(bot, body, header) {
    let time = new Date(Date.parse(body.response[0].time));

    let cv_embed = new Discord.RichEmbed()
    .setTitle(`COVID-19 ${header} Statistics`)
    .addField(`Total cases:`, new Intl.NumberFormat('en-US', { useGrouping: true }).format(body.response[0].cases.total))
    .addField(`Total deaths:`, new Intl.NumberFormat('en-US', { useGrouping: true }).format(body.response[0].deaths.total))
    .addField(`Last update:`, time.toUTCString())
    .setFooter(`Powered by MieciekBot ${bot.settings.version}`, bot.settings.iconURL);

    return cv_embed;
}
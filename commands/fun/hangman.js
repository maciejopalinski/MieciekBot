const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if (bot.game.hangman.has(msg.guild.id))
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(`The game already exists!`).then(msg => msg.delete(bot.delete_timeout));
    }

    msg.channel.send(`<@${msg.member.id}> is picking a sentence...`);

    msg.author.createDM()
    .then(async dmchannel => {
        await dmchannel.send(`Please enter a sentence for a new hangman game... (will expire in 15 seconds)`);
        
        const filter = m => m.author.id === msg.member.id;
        dmchannel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
        .then(async collected => {
            let word = collected.first().content.toLowerCase();
            let guess_word = [];
            for(let char of word)
            {
                let mode = "hidden";
                if(char == " ") mode = "space";

                guess_word.push({
                    char: char,
                    mode: mode
                });
            }

            msg.author.deleteDM();
            msg.channel.send(`<@${msg.member.id}> picked a sentence!\nStarting a new hangman game...`);
            let guess_msg = await msg.channel.send(`\`\`\`Health: 10/10\n\n${word.replace(/\w/g, "_ ")}\`\`\``);
            guess_msg.sentence_picked_by = msg.author;

            bot.game.hangman.set(msg.guild.id, true);
            await collect(bot, msg.channel, word, guess_word, guess_msg, 10, 10);
        })
        .catch(async collected => {
            await dmchannel.send(`Canceled.`);
            msg.author.deleteDM();
        });
    });
}

module.exports.help = {
    name: "hangman",
    aliases: [],
    args: [],
    permission: "USER",
    description: "starts a new hangman game"
}

/**
 * @param {Discord.Client} bot 
 * @param {Discord.TextChannel} channel 
 * @param {String} word 
 * @param {Array<Object>} guess_word 
 * @param {Discord.Message} guess_msg 
 * @param {Number} health 
 * @param {Number} maxHealth 
 */
async function collect(bot, channel, word, guess_word, guess_msg, health, maxHealth) {
    const filter = m => m.content != " " && m.author != guess_msg.sentence_picked_by;
    channel.awaitMessages(filter, { maxMatches: 1, time: 20000, errors: ['time'] })
    .then(async collected => {
        let first = collected.first();
        first.content = first.content.toLowerCase();

        let match_text = "";
        guess_word.forEach((elem, index) => {
            if(elem.char == first.content.charAt(0) || elem.mode == "shown")
            {
                guess_word[index].mode = "shown";
                match_text += `${elem.char} `;
            }
            else if(elem.char != " " || elem.mode == "hidden")
            {
                match_text += `_ `;
            }
            else
            {
                match_text += ` `;
            }
        });

        if(first.content.length > 1)
        {
            if(first.content == word)
            {
                await first.react("✅");
                bot.game.hangman.delete(channel.guild.id);
                await guess_msg.edit(`\`\`\`Health: ${health}/${maxHealth}\n\n${word}\nYou won!\`\`\``);
                return;
            }
            else
            {
                await first.react("🚫");
                await first.delete(300);
                collect(bot, channel, word, guess_word, guess_msg, health - 1, maxHealth);
            }
        }
        else
        {
            if(guess_word.every(v => v.mode != "space" && v.mode == "shown"))
            {
                bot.game.hangman.delete(channel.guild.id);
                return guess_msg.edit(`\`\`\`Health: ${health}/${maxHealth}\n\n${match_text}\nYou won!\`\`\``);
            }
    
            if(word.includes(first.content))
            {
                await first.react("✅");
                await first.delete(300);
    
                guess_msg.edit(`\`\`\`Health: ${health}/${maxHealth}\n\n${match_text}\`\`\``);
                collect(bot, channel, word, guess_word, guess_msg, health, maxHealth);
            }
            else
            {
                await first.react("🚫");
                await first.delete(300);
    
                if(health - 1 <= 0)
                {
                    bot.game.hangman.delete(channel.guild.id);
                    return guess_msg.edit(`\`\`\`Health: 0/${maxHealth}\n\nYou lose!\`\`\``);
                }
    
                guess_msg.edit(`\`\`\`Health: ${health-1}/${maxHealth}\n\n${match_text}\`\`\``);
                collect(bot, channel, word, guess_word, guess_msg, health - 1, maxHealth);
            }
        }
    })
    .catch(() => {
        bot.game.hangman.delete(channel.guild.id);
        guess_msg.edit(`\`\`\`20 seconds passed. Game aborted.\`\`\``);
    });
}
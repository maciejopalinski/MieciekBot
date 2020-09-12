const Discord = require("discord.js");

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    if (bot.game.hangman.has(msg.guild.id))
    {
        msg.delete({ timeout: bot.delete_timeout });
        return msg.channel.send(`The game already exists!`).then(msg => msg.delete({ timeout: bot.delete_timeout }));
    }
    
    bot.game.hangman.set(msg.guild.id, true);
    msg.channel.send(`<@${msg.member.id}> is picking a sentence...`);

    msg.author.createDM()
    .then(async dmchannel => {
        await dmchannel.send(`Please enter a sentence for a new hangman game... (will expire in 15 seconds)`);
        
        const filter = m => m.author.id === msg.member.id && !m.content.includes(bot.prefix) && !m.author.bot;
        dmchannel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
        .then(async collected => {
            let word = collected.first().content.toLowerCase();

            if(word.length < 4 || word.length > 25)
            {
                bot.game.hangman.delete(msg.guild.id);
                await dmchannel.send(`Your sentence should be 4-25 characters long. Game aborted.`);
                msg.author.deleteDM();
                return msg.channel.send(`<@${msg.member.id}> canceled. Game aborted.`);
            }
            if(!word.match(/^[a-zA-Z\s]+$/g))
            {
                bot.game.hangman.delete(msg.guild.id);
                await dmchannel.send(`Your sentence contains not allowed characters. Game aborted.`);
                msg.author.deleteDM();
                return msg.channel.send(`<@${msg.member.id}> canceled. Game aborted.`);
            }

            let guess_word = [];
            for(let char of word)
            {
                let mode = "hidden";
                if(char == " ") mode = "shown";

                guess_word.push({
                    char: char,
                    mode: mode
                });
            }

            msg.author.deleteDM();
            msg.channel.send(`<@${msg.member.id}> picked a sentence!\nStarting a new hangman game...`);
            let guess_msg = await msg.channel.send(`\`\`\`Health: 10/10\n\n${word.replace(/\S/g, "_ ")}\`\`\``);
            guess_msg.sentence_picked_by = msg.author;

            await collect(bot, msg.channel, word, guess_word, guess_msg, 10, 10);
        })
        .catch(async collected => {
            bot.game.hangman.delete(msg.guild.id);
            await dmchannel.send(`Canceled. Game aborted.`);
            msg.author.deleteDM();
            msg.channel.send(`<@${msg.member.id}> canceled. Game aborted.`);
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
    const filter = m => m.content != " " && !m.content.includes(bot.prefix) && !m.author.bot && m.author != guess_msg.sentence_picked_by;
    channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
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

        if(guess_msg.deleted)
        {
            bot.game.hangman.delete(channel.guild.id);
            return channel.send(`Error occurred. Game aborted.`);
        }

        if(guess_word.every(v => v.mode == "shown"))
        {
            first.react("✅");
            first.react("🎉");
            bot.game.hangman.delete(channel.guild.id);
            return guess_msg.edit(`\`\`\`Health: ${health}/${maxHealth}\n\n${match_text}\nYou won!\`\`\``);
        }

        // guess passphrase
        if(first.content.length > 1)
        {
            if(first.content == word)
            {
                first.react("✅");
                first.react("🎉");
                bot.game.hangman.delete(channel.guild.id);
                return guess_msg.edit(`\`\`\`Health: ${health}/${maxHealth}\n\n${word}\nYou won!\`\`\``);
            }
            else
            {
                await first.react("🚫");
                first.delete(300);
                guess_msg.edit(`\`\`\`Health: ${health-1}/${maxHealth}\n\n${match_text}\`\`\``);
                collect(bot, channel, word, guess_word, guess_msg, health - 1, maxHealth);
            }
        }
        // guess letter
        else
        {    
            if(word.includes(first.content))
            {
                await first.react("✅");
                first.delete(300);
    
                guess_msg.edit(`\`\`\`Health: ${health}/${maxHealth}\n\n${match_text}\`\`\``);
                collect(bot, channel, word, guess_word, guess_msg, health, maxHealth);
            }
            else
            {
                await first.react("🚫");
                first.delete(300);

                if(health - 1 <= 0)
                {
                    bot.game.hangman.delete(channel.guild.id);
                    return guess_msg.edit(`\`\`\`Health: 0/${maxHealth}\n\n${word}\nYou lose!\`\`\``);
                }

                guess_msg.edit(`\`\`\`Health: ${health-1}/${maxHealth}\n\n${match_text}\`\`\``);
                collect(bot, channel, word, guess_word, guess_msg, health - 1, maxHealth);
            }
        }
    })
    .catch(collected => {
        if(guess_msg.deleted)
        {
            bot.game.hangman.delete(channel.guild.id);
            return channel.send(`Error occurred. Game aborted.`);
        }
        bot.game.hangman.delete(channel.guild.id);
        guess_msg.edit(`\`\`\`30 seconds passed. Game aborted.\`\`\``);
    });
}

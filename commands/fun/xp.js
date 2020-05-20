const Discord = require("discord.js");
const mongoose = require("mongoose");
const Canvas = require("canvas");

Canvas.registerFont("assets/fonts/Bebas-Regular.ttf", {family: "Bebas-Regular"});
Canvas.registerFont("assets/fonts/AldotheApache.ttf", {family: "AldoTheApache"});

const Users = require("../../models/users.js");

const XPCalc = require("../../util/experience.js");

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

/**
 * @param {Discord.Client} bot 
 * @param {Discord.Message} msg 
 * @param {Array<String>} args 
 */
module.exports.run = async (bot, msg, args) => {
    let user = msg.mentions.members.first() || msg.member;
    
    if(user.user.bot)
    {
        msg.delete(bot.delete_timeout);
        return msg.channel.send(this.error.bot).then(msg => msg.delete(bot.delete_timeout));
    }

    Users.findOne({
        serverID: msg.guild.id,
        userID: user.id
    }, async (err, res) => {
        if (err) console.error(err);

        if(!res)
        {
            const new_user = new Users({
                serverID: msg.guild.id,
                userID: user.id,
                level: 0,
                xp: 0
            });
            new_user.save();

            var res = {level: 0, xp: 0};
        }

        let level = res.level;
        let xp = res.xp;
        
        let size = { width: 900, height: 300 };
        let level_graphics = Canvas.createCanvas(size.width, size.height);
        let ctx = level_graphics.getContext("2d");

        // background
        ctx.fillStyle = "rgb(34, 37, 43)";
        ctx.fillRect(0, 0, size.width, size.height);

        // nickname
        ctx.font = "80px AldoTheApache";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(user.user.tag, 320, 110, 540);

        // progress bar
        let start = XPCalc.getXp(level);
        let dest = XPCalc.getXp(level + 1);
        let percent = (xp - start) / (dest - start) * 100;

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(320, 200, 540, 40);

        ctx.fillStyle = "rgb(113, 235, 52)";
        ctx.fillRect(320, 200, Math.ceil(540 * percent / 100), 40);

        // xp text
        ctx.font = "35px Bebas-Regular";
        ctx.fillStyle = "rgb(255, 255, 255)";
        if(dest >= 1000) { text = `${xp / 1000}K / ${dest / 1000}K XP`; } else { text = `${xp} / ${dest} XP`; }
        let text_box = ctx.measureText(text);

        ctx.fillText(text, 860-text_box.width, 192);

        // level text
        ctx.font = "45px Bebas-Regular";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(`Level ${level}`, 320, 192);

        // avatar
        let avatar = await Canvas.loadImage(user.user.avatarURL);
            
        ctx.strokeStyle = "rgb(54, 57, 63)";
        ctx.beginPath();
        ctx.arc(128+30, 128+22, 128, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 30, 22, 256, 256);

        // send attachment
        let attachment = new Discord.Attachment(level_graphics.toBuffer());
        msg.channel.send(attachment);
    });
}

module.exports.help = {
    name: "xp",
    aliases: [],
    args: [
        "[@user]"
    ],
    permission: "USER",
    description: "displays user experience points"
}

module.exports.error = {
    "bot": "This user is a bot. It cannot collect XP points."
};
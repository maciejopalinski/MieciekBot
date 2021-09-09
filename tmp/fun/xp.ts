import { MessageAttachment } from 'discord.js';
import Canvas, { freetypeVersion } from 'canvas';
import { Command } from '../../lib';
import { User } from '../../models';

Canvas.registerFont('src/assets/fonts/Bebas-Regular.ttf', { family: 'Bebas-Regular' });
Canvas.registerFont('src/assets/fonts/AldotheApache.ttf', { family: 'AldoTheApache' });

const XP = new Command();

XP.execute = async (bot, msg, args) => {
    let member = msg.mentions.members.first() || msg.member;
    
    if(member.user.bot) {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.bot);
    }

    let user = await bot.db_manager.getUser(msg.guild.id, member.id);
    if(!user) {
        user = await User.create({
            guildID: msg.guild.id,
            userID: member.id
        });

        user.level = 0;
        user.xp = 0;
    }
    
    let level = user.level;
    let xp = user.xp;
        
    let size = { width: 900, height: 300 };
    let level_graphics = Canvas.createCanvas(size.width, size.height);
    let ctx = level_graphics.getContext('2d');

    // background
    ctx.fillStyle = 'rgb(34, 37, 43)';
    ctx.fillRect(0, 0, size.width, size.height);

    // nickname
    ctx.font = '80px AldoTheApache';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText(member.user.tag, 320, 110, 540);

    // progress bar
    let start = bot.db_manager.exp_system.getExperience(level);
    let dest = bot.db_manager.exp_system.getExperience(level + 1);
    let percent = (xp - start) / (dest - start) * 100;

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(320, 200, 540, 40);

    ctx.fillStyle = 'rgb(113, 235, 52)';
    ctx.fillRect(320, 200, Math.ceil(540 * percent / 100), 40);

    // xp text
    ctx.font = '35px Bebas-Regular';
    ctx.fillStyle = 'rgb(255, 255, 255)';

    let text: string;
    if(dest >= 1000)
        text = `${(xp / 1000).toFixed(3)}K / ${(dest / 1000).toFixed(3)}K XP`;
    else
        text = `${xp.toFixed(2)} / ${dest.toFixed(2)} XP`;

    let text_box = ctx.measureText(text);

    ctx.fillText(text, 860-text_box.width, 192);

    // level text
    ctx.font = '45px Bebas-Regular';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText(`Level ${level}`, 320, 192);

    // avatarq
    let avatar = await Canvas.loadImage(member.user.avatarURL({ format: 'png', size: 512 }) || member.user.defaultAvatarURL);
        
    ctx.strokeStyle = 'rgb(54, 57, 63)';
    ctx.beginPath();
    ctx.arc(128+30, 128+22, 128, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 30, 22, 256, 256);

    // send attachment
    msg.channel.send({ files: [new MessageAttachment(level_graphics.toBuffer())] });
}

XP.help = {
    name: 'xp',
    args: '[@user]',
    aliases: [],
    description: 'displays user experience points',
    permission: 'USER'
};

const error = XP.error = {
    bot: "This user is a bot. It cannot collect XP points."
};

export default XP;
import { MessageAttachment } from 'discord.js';
import { Command, QueueLoopModes } from '../../lib';

import Canvas from 'canvas';
Canvas.registerFont('src/assets/fonts/Bebas-Regular.ttf', {family: 'Bebas-Regular'});
Canvas.registerFont('src/assets/fonts/AldotheApache.ttf', {family: 'AldoTheApache'});

const NowPlaying = new Command();

NowPlaying.execute = async (bot, msg, args) => {
    let server_queue = bot.music_manager.get(msg.guild.id);
    if(server_queue && server_queue.connection.dispatcher)
    {
        const Buttons = {
            LOOP: {
                DISABLED: await Canvas.loadImage('src/assets/icons/loop_disabled.png'),
                QUEUE: await Canvas.loadImage('src/assets/icons/loop_queue.png'),
                SHUFFLE: await Canvas.loadImage('src/assets/icons/loop_shuffle.png'),
                TRACK: await Canvas.loadImage('src/assets/icons/loop_track.png')
            },
            PAUSE: await Canvas.loadImage('src/assets/icons/pause.png'),
            PLAY: await Canvas.loadImage('src/assets/icons/play.png'),
            SKIP_BACK: await Canvas.loadImage('src/assets/icons/skip.back.png'),
            SKIP_FORWARD: await Canvas.loadImage('src/assets/icons/skip.forward.png'),
            VOLUME: {
                FULL: await Canvas.loadImage('src/assets/icons/volume_full.png'),
                OFF: await Canvas.loadImage('src/assets/icons/volume_off.png')
            }
        };

        let size = { width: 1200, height: 500 };
        let pos = { x: 0, y: 0 };
        let margin = 60;

        let song_graphics = Canvas.createCanvas(size.width, size.height);
        let ctx = song_graphics.getContext('2d');

        // BACKGROUND
        ctx.fillStyle = 'rgb(34, 37, 43)';
        ctx.fillRect(0, 0, size.width, size.height);


        // BUTTONS
        pos = { x: size.width/2-32, y: size.height/2-32+140 };

        // play / pause button
        let play_pause = null;
        if(server_queue.playing.state) play_pause = Buttons.PAUSE;
        else play_pause = Buttons.PLAY;
        ctx.drawImage(play_pause, pos.x, pos.y, 64, 64);

        // skip_back & skip_forward buttons
        ctx.drawImage(Buttons.SKIP_BACK, pos.x-120, pos.y, 64, 64);
        ctx.drawImage(Buttons.SKIP_FORWARD, pos.x+120, pos.y, 64, 64);

        // loop button
        let button = null
        if(server_queue.playing.loop_mode == QueueLoopModes.LOOP_TRACK) button = Buttons.LOOP.TRACK;
        else if(server_queue.playing.loop_mode == QueueLoopModes.LOOP_QUEUE) button = Buttons.LOOP.QUEUE;
        else if(server_queue.playing.loop_mode == QueueLoopModes.SHUFFLE) button = Buttons.LOOP.SHUFFLE;
        else button = Buttons.LOOP.DISABLED;
        
        ctx.drawImage(button, pos.x-310-8, pos.y-8, 64+16, 64+16);

        // volume
        let volume = null;
        if(server_queue.volume.current > 10) volume = Buttons.VOLUME.FULL;
        else volume = Buttons.VOLUME.OFF;

        ctx.drawImage(volume, pos.x+310-8, pos.y-8, 64+16, 64+16);


        // VIDEO TITLE
        pos.x += 32; pos.y += 32;
        ctx.font = '70px Bebas-Regular';
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.textAlign = 'center';
        let text = server_queue.playing.current.title;
        ctx.fillText(text, pos.x, pos.y-90, size.width-(margin*2));


        // PROGRESS
        let start = Math.floor(server_queue.connection.dispatcher.streamTime / 1000);
        let dest = server_queue.playing.current.duration;
        let percent = (start / dest);
        margin = 60;
        let bar = { width: Math.ceil((size.width-margin*2)*percent), height: 50 };
        pos.y = size.height/2-bar.height-140;
        
        // white background
        ctx.fillStyle = 'rgb(255, 255, 255)';
        roundRect(ctx, margin, pos.y, size.width-(margin*2), bar.height, 20, true, false);
        // ctx.fillRect(margin, pos.y, size.width-(margin*2), bar.height);
        // red-orange bar
        ctx.fillStyle = 'rgb(250, 94, 62)';
        let radius_object = {tl:20,tr:0,bl:20,br:0};
        if(bar.width + 12 + 2*margin >= size.width) radius_object = {tl:20,tr:20,bl:20,br:20};
        roundRect(ctx, margin, pos.y, bar.width, bar.height, radius_object, true, false);
        // ctx.fillRect(margin, pos.y, bar.width, bar.height);


        // TIMES
        pos.y += bar.height+50;
        ctx.font = '52px Bebas-Regular';
        ctx.fillStyle = 'rgb(255, 255, 255)'; 

        // current time
        text = bot.music_manager.secondsToDuration(start);
        ctx.textAlign = 'left';
        ctx.fillText(text, margin, pos.y);

        // remaining time
        text = bot.music_manager.secondsToDuration(dest);
        ctx.textAlign = 'right';
        ctx.fillText(text, size.width-margin, pos.y);


        // finally send attachment
        msg.channel.send(new MessageAttachment(song_graphics.toBuffer()));
    }
    else
    {
        bot.deleteMsg(msg);
        return bot.sendAndDelete(msg.channel, error.music_play);
    }
}

NowPlaying.setHelp({
    name: 'now-playing',
    args: '',
    aliases: ['np', 'now', 'music'],
    description: 'displays current playing song',
    permission: 'USER'
});

const error = NowPlaying.error = {
    music_play: "Queue is empty."
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * 
 * Source: https://stackoverflow.com/a/3368118/12126676
 * 
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x The top left x coordinate
 * @param {number} y The top left y coordinate
 * @param {number} width The width of the rectangle
 * @param {number} height The height of the rectangle
 * @param {number | object} [radius] The corner radius object
 * @param {boolean} [fill = false] Whether to fill the rectangle.
 * @param {boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: {tl:number, tr:number, br:number, bl:number} | number = {tl:5, tr:5, br:5, bl:5},
    fill = false, stroke = true
) {
    if(typeof radius == 'number') radius = { tl:radius, tr:radius, br:radius, bl:radius };

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
}

export default NowPlaying;
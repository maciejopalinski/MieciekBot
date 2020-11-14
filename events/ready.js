const {bot} = require('../index.js');

bot.on('ready', async () => {
    console.info(`Logged in as: ${bot.user.tag}`);
    console.info(`Running...`);

    let status = [
        {
            status: 'online',
            activity: {
                type: 'LISTENING',
                name: 'Megadeth',
                url: 'https://github.com/PoProstuMieciek/'
            }
        },
        {
            status: 'online',
            activity: {
                type: 'LISTENING',
                name: 'Slipknot',
                url: 'https://github.com/PoProstuMieciek/'
            }
        },
        {
            status: 'online',
            activity: {
                type: 'PLAYING',
                name: 'Visual Studio Code',
                url: 'https://github.com/PoProstuMieciek/'
            }
        },
        {
            status: 'online',
            activity: {
                type: 'PLAYING',
                name: `on ${bot.guilds.cache.size} ${bot.guilds.cache.size > 1 ? 'servers' : 'server'}`,
                url: 'https://github.com/PoProstuMieciek/'
            }
        }
    ];

    setInterval(function () {
        let index = Math.floor(Math.random() * status.length);
        bot.user.setPresence(status[index]);
    }, 5000);

    await bot.db_manager.databaseCleanup(bot);
});
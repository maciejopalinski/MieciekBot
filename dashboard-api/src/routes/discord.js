const router = require('express').Router();
const ErrorPages = require('../templates/ErrorPages');

const User = require('../database/schemas/User');
const { getBotGuilds, getMutualGuilds } = require('../utils/api');

// /api/discord/@me
router.get('/@me', (req, res) => {
    if(req.user) res.send(req.user);
    else res.status(401).send({ message: "Unauthorized" });
});

// /api/discord/guilds/mutual
router.get('/guilds/mutual', async (req, res) => {
    if(req.user) {
        var user = await User.findOne({ id: req.user.id });
        var mutualGuilds = null;
        
        var botGuilds = await getBotGuilds();
        if(botGuilds.retry_after) {
            setTimeout(async () => {
                botGuilds = await getBotGuilds();
                
                if(!botGuilds.retry_after) {
                    mutualGuilds = getMutualGuilds(botGuilds, user.guilds);
                    res.send(mutualGuilds);
                }
                else {
                    ErrorPages.too_many_requests(res);
                }
            }, botGuilds.retry_after * 2);
        }
        else {
            mutualGuilds = getMutualGuilds(botGuilds, user.guilds);
            res.send(mutualGuilds);
        }
    }
    else ErrorPages.unauthorized(res);
});

module.exports = router;
const router = require('express').Router();
const error = require('../templates/ErrorPages');

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
        const botGuilds = await getBotGuilds();
        const user = await User.findOne({ id: req.user.id });

        const mutualGuilds = getMutualGuilds(botGuilds, user.guilds);
        res.send(mutualGuilds);
    }
    else error.unauthorized(res);
});

module.exports = router;
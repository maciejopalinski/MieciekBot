const router = require('express').Router();
const passport = require('passport');

// /api/auth
router.get('/', (req, res) => {
    if(req.user) res.send(req.user);
    else res.status(401).send({ message: 'Unauthorized' });
});

// /api/auth/discord
router.get('/discord', passport.authenticate('discord'));

// /api/auth/discord/redirect
router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    res.redirect('/api/auth');
});

module.exports = router;
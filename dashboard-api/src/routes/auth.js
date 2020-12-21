const router = require('express').Router();
const passport = require('passport');

// /api/auth
router.get('/', passport.authenticate('discord'));

// /api/auth/redirect
router.get('/redirect', passport.authenticate('discord'), (req, res) => {
    res.redirect(process.env.DASHBOARD_CLIENT_URL + '/dashboard');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect(process.env.DASHBOARD_CLIENT_URL + '/');
    });
});

module.exports = router;
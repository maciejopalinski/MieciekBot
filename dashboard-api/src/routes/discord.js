const router = require('express').Router();

// /api/discord
router.get('/', (req, res) => {
    res.send({
        message: 'Discord'
    });
});

module.exports = router;
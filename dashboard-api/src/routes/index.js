const router = require('express').Router();

const auth = require('./auth');
const discord = require('./discord');

router.get('/', (req, res) => {
    res.send({
        message: 'MieciekBot Dashboard API'
    });
});

router.use('/auth', auth);
router.use('/discord', discord);

module.exports = router;
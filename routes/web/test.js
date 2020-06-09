const router = require('express').Router();

router.get('/web/test', (req, res) => {
    return res.status(200).json('Hello world');
});

module.exports = router
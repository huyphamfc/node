const express = require('express');


const router = express.Router();

router.route('/').get((_, res) => {
    res.end('Hello from the server!')
});


module.exports = router;
const express = require('express');
const accountController = require('./controllers');


const router = express.Router();
router.get('/', accountController.getAllAccounts);
router.post('/signup', accountController.signup);


module.exports = router;
const express = require('express');
const infoController = require('./controllers');


const router = express.Router();
router.get('/', infoController.getAllInfo);
router.post('/register', infoController.register);


module.exports = router;
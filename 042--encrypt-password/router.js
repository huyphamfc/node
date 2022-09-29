const express = require('express');
const passwordController = require('./controllers');


const router = express.Router();
router.get('/', passwordController.getAllInfo);
router.post('/register', passwordController.register);


module.exports = router;
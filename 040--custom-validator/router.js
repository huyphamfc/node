const express = require('express');
const personController = require('./controllers');


const router = express.Router();
router.get('/', personController.getAllPerson);
router.post('/signup', personController.signup);


module.exports = router;
const express = require('express');
const numberController = require('./controllers');


const router = express.Router();
router.route('/').get(numberController.getAllNumbers);
router.route('/new').post(numberController.createNumber);


module.exports = router;